import NextAuth, { getServerSession, type NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import DiscordProvider from 'next-auth/providers/discord';
import TwitterProvider from 'next-auth/providers/twitter';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '@/dashboard/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import { getSearchParams } from '@/dashboard/lib/utils';
import { hashToken } from './crypto';
import { ratelimit } from './upstash';
import credentialsProvider from 'next-auth/providers/credentials';
import { getCsrfToken } from 'next-auth/react';
import {  verifySIWS } from '@talismn/siws';

const VERCEL_DEPLOYMENT = !!process.env.VERCEL_URL;

export interface UserProps {
  id: string;
  name: string;
  username: string;
  gh_username: string;
  email: string;
  image: string;
}

export interface Session {
  user: {
    email: string;
    id: string;
    name: string;
    gh_username?: string;
    accessToken?: string;
    image?: string;
  };
}

export interface Profile {
  id?: number;
  name?: string;
  email?: string;
  avatar_url?: string;
  login?: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    credentialsProvider({
      name: 'Substrate',
      credentials: {
        message: {
          label: 'Message',
          type: 'text',
          placeholder: '0x0',
        },
        signature: {
          label: 'Signature',
          type: 'text',
          placeholder: '0x0',
        },
      },
      async authorize(credentials, req) {
        try {

          const result = await verifySIWS(credentials?.message, credentials?.signature, credentials?.address).then((res) =>{
            console.log("res", res)
            return res
          }).catch((e) => {
            console.log("e", e)
            return e
          })

          console.log('result', result);
          // success
          if (result && result.nonce) {
            // Check if wallet exists
            let wallet = await prisma.wallet.findUnique({
              where: { address: result.address },
            });

            // If wallet does not exist, check for user or create user and wallet
            if (!wallet) {
              // Create user associated with the wallet
              let user = await prisma.user.create({
                data: {
                  // Assuming 'id' field is auto-generated or you have a method to generate it
                  name: result.address,
                  email: `${result.address}@siws.web3`, // Arbitrary temp email
                },
              });

              // Create wallet associated with the found or newly created user
              let userWallet = await prisma.wallet.create({
                data: {
                  address: result.address,
                  userId: user.id, // Use the user's ID here
                },
              });

              const profile = {
                ...user,
                wallets: [userWallet],
              };

              return profile;
            } else {
              console.log('wallet', wallet);

              const user = await prisma.user.findUnique({
                where: { id: wallet.userId },
                include: {
                  wallets: {
                    where: {
                      address: wallet.address,
                    },
                  },
                },
              });

              return user;
            }
          }
        } catch (error) {
          console.log('error', error);
          return null;
        }
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
    }),
    TwitterProvider({
      clientId: process.env.AUTH_TWITTER_ID as string,
      clientSecret: process.env.AUTH_TWITTER_SECRET as string,
      version: '2.0', // opt-in to Twitter OAuth 2.0
      allowDangerousEmailAccountLinking: true,
    }),
    DiscordProvider({
      clientId: process.env.AUTH_DISCORD_ID as string,
      clientSecret: process.env.AUTH_DISCORD_SECRET as string,
      authorization: {
        params: {
          prompt: 'consent',
        },
      },
    }),
    GitHubProvider({
      clientId: process.env.AUTH_GITHUB_ID as string,
      clientSecret: process.env.AUTH_GITHUB_SECRET as string,
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          scope: 'read:user user:email repo', // Include 'repo' in the scope
        },
      },
      profile: (profile: Profile) => {
        // Corrected this line
        return {
          id: profile.id.toString(),
          name: profile.name ?? profile.login,
          email: profile.email,
          image: profile.avatar_url,
          gh_username: profile.login,
        };
      },
    }),
  ],
  pages: {
    signIn: ``,
    verifyRequest: ``,
    error: '',
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  cookies: {
    sessionToken: {
      name: `${VERCEL_DEPLOYMENT ? '__Secure-' : ''}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        // When working on localhost, the cookie domain must be omitted entirely (https://stackoverflow.com/a/1188145)
        domain: VERCEL_DEPLOYMENT ? 'dotstack.xyz' : 'localhost',
        secure: VERCEL_DEPLOYMENT,
      },
    },
  },
  callbacks: {
    signIn: async ({
      user,
      account,
      profile,
    }: {
      user?: any;
      account?: any;
      profile?: Profile;
    }) => {
      const session = await getSession();
      // we expect the user to have an email
      //if (!user.email || (await isBlacklistedEmail(user.email))) {
      if (!user.email && !session?.user.id) {
        return false;
      }
      if (!user.email && session?.user.email) {
        // assign a generic email to the user
        user.email = session.user.email;
      }
      if (!user.email && !session?.user.email) {
        // assign a generic email to the user
        user.email = `${user.name ? user.name : user.username ? user.username : session?.user.id
          }@${account.provider}-provider.com`;
      }
      if (
        account?.provider === 'google' ||
        account?.provider === 'github' ||
        account?.provider === 'twitter' ||
        account?.provider === 'discord' ||
        account?.provider === 'substrate'
      ) {
        const userExists: any = await prisma.user.findUnique({
          where: { email: user.email },
          select: { name: true },
        });
        // if the user already exists via email,
        // update the user with their name and image from Google
        if (userExists && !userExists.name) {
          await prisma.user.update({
            where: { email: user.email },
            data: {
              name: profile?.name,
              gh_username: profile?.login,
              // @ts-ignore - this is a bug in the types, `picture` is a valid on the `Profile` type
              image: profile?.picture,
            },
          });
        }

        // Github specific logic
        if (account?.provider === 'github') {
          // add the user's GitHub username to their user
          if (userExists && (!userExists.gh_username || !userExists.gitProvider)) {
            await prisma.user.update({
              where: { email: user.email },
              data: {
                // @ts-ignore - this is a bug in the types, `login` is a valid on the `Profile` type
                gh_username: profile?.login,
                gitProvider: 'github',
              },
            });
          }

          // create a temp data object to store the user's access token
          const userData = {
            name: profile?.name || user.name,
            image: account.provider === 'github' ? profile?.avatar_url : user.image,
            gh_username: '',
            accessToken: '',
          };

          // GitHub username
          userData.gh_username = profile.login;
          // Store the GitHub access token directly
          userData.accessToken = account.access_token;
        }
      } else if (account?.provider === 'saml' || account?.provider === 'saml-idp') {
        let samlProfile: any;

        if (account?.provider === 'saml-idp') {
          // can't get project id from saml-idp so we return it for now
          return true;
        } else {
          samlProfile = profile;
        }

        if (!samlProfile?.requested?.tenant) {
          return false;
        }
      }
      return true;
    },
    jwt: async ({
      token,
      user,
      trigger,
      account,
      profile,
    }: {
      token?: any;
      user?: any;
      trigger?: any;
      account?: any;
      profile?: Profile;
    }) => {
      // force log out banned users
      //if (!token.email || (await isBlacklistedEmail(token.email))) {
      if (!token.email) {
        return {};
      }

      // Store GitHub access token and ID when signing in with GitHub
      if (account?.provider === 'github') {
        token.accessToken = account.access_token; // GitHub access token
        token.githubId = profile.id.toString(); // GitHub user ID
      }

      if (user) {
        token.user = user;
      }

      // refresh the user's data if they update their name / email
      if (trigger === 'update') {
        const refreshedUser = await prisma.user.findUnique({
          where: { id: token.sub },
        });
        if (refreshedUser) {
          token.user = refreshedUser;
        } else {
          return {};
        }
      }

      return token; // Return the updated token
    },

    session: async ({ session, token }) => {
      session.user = {
        id: token.sub,
        // @ts-ignore
        ...(token || session).user,
      };
      return session;
    },
  },
  events: {
    async signIn(message) {
      if (message.isNewUser) {
        const email = message.user.email as string;
        const user = await prisma.user.findUnique({
          where: { email },
          select: {
            name: true,
            gh_username: true,
            createdAt: true,
          },
        });
      }
    },
  },
};

export default NextAuth(authOptions);

export function getSession() {
  return getServerSession(authOptions) as Promise<{
    user: {
      id: string;
      name: string;
      username: string;
      gh_username: string;
      email: string;
      image: string;
    };
  } | null>;
}

interface WithUsertNextApiHandler {
  (req: NextApiRequest, res: NextApiResponse, session: Session, user?: UserProps): any;
}

const withUserAuth =
  (
    handler: WithUsertNextApiHandler,
    {
      needUserDetails, // if the action needs the user's details
    }: {
      needUserDetails?: boolean;
    } = {},
  ) =>
    async (req: NextApiRequest, res: NextApiResponse) => {
      const session = await getSession();
      if (!session?.user.id) return res.status(401).end('Unauthorized: Login required.');

      if (req.method === 'GET') return handler(req, res, session);

      if (needUserDetails) {
        const user = (await prisma.user.findUnique({
          where: {
            id: session.user.id,
          },
          select: {
            id: true,
            name: true,
            username: true,
            gh_username: true,
            email: true,
          },
        })) as UserProps;

        return handler(req, res, session, user);
      }

      return handler(req, res, session);
    };

export { withUserAuth };

interface WithAuthHandler {
  ({
    req,
    params,
    searchParams,
    headers,
    session,
    domain,
  }: {
    req: Request;
    params: Record<string, string>;
    searchParams: Record<string, string>;
    headers?: Record<string, string>;
    session: Session;
    domain: string;
  }): Promise<Response>;
}
export const withAuth =
  (
    handler: WithAuthHandler,
    {
      allowAnonymous, // special case for /api/services (POST /api/services) – allow no session
    }: {
      requiredRole?: Array<'owner' | 'member'>;
      needNotExceededUsage?: boolean;
      allowAnonymous?: boolean;
    } = {},
  ) =>
    async (req: Request, { params }: { params: Record<string, string> | undefined }) => {
      const searchParams = getSearchParams(req.url);
      const slug = params?.slug || searchParams.projectSlug;
      const domain = params?.domain || searchParams.domain;
      const key = searchParams.key;

      let session: Session | undefined;
      let headers = {};

      const authorizationHeader = req.headers.get('Authorization');
      if (authorizationHeader) {
        if (!authorizationHeader.includes('Bearer ')) {
          return new Response(
            "Misconfigured authorization header. Did you forget to add 'Bearer '? Learn more: https://voiager.org ",
            {
              status: 400,
            },
          );
        }
        const apiKey = authorizationHeader.replace('Bearer ', '');

        const hashedKey = hashToken(apiKey, {
          noSecret: true,
        });

        const user = await prisma.user.findFirst({
          where: {
            tokens: {
              some: {
                hashedKey,
              },
            },
          },
          select: {
            id: true,
            name: true,
            email: true,
          },
        });
        if (!user) {
          return new Response('Unauthorized: Invalid API key.', {
            status: 401,
          });
        }

        const { success, limit, reset, remaining } = await ratelimit(10, '1 s').limit(apiKey);

        headers = {
          'Retry-After': reset.toString(),
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
        };

        if (!success) {
          return new Response('Too many requests.', {
            status: 429,
            headers,
          });
        }
        await prisma.token.update({
          where: {
            hashedKey,
          },
          data: {
            lastUsed: new Date(),
          },
        });
        session = {
          user: {
            id: user.id,
            name: user.name || '',
            email: user.email || '',
          },
        };
      } else {
        session = await getSession();
        if (!session?.user.id) {
          // for demo services, we allow anonymous service creation
          if (allowAnonymous) {
            // @ts-expect-error
            return handler({
              req,
              params: params || {},
              searchParams,
              headers,
            });
          }

          return new Response('Unauthorized: Login required.', {
            status: 401,
            headers,
          });
        }
      }

      return handler({
        req,
        params: params || {},
        searchParams,
        headers,
        session,
        domain,
      });
    };

interface WithSessionHandler {
  ({
    req,
    params,
    searchParams,
    session,
  }: {
    req: Request;
    params: Record<string, string>;
    searchParams: Record<string, string>;
    session: Session;
  }): Promise<Response>;
}

export const withSession =
  (handler: WithSessionHandler) =>
    async (req: Request, { params }: { params: Record<string, string> }) => {
      const session = await getSession();
      if (!session?.user.id) {
        return new Response('Unauthorized: Login required.', { status: 401 });
      }

      const searchParams = getSearchParams(req.url);
      return handler({ req, params, searchParams, session });
    };

// Pass secure keys to the JWT token
export const getAuthToken = async (req) => {
  const token = await getToken({ req });
  if (token) {
    return token;
  } else {
    // Not Signed in
    console.log('No token');
  }
};

//route handler for public data

export const withPrismaPublic =
  (
    handler: WithoutSessionHandler,
    options: {
      allowAnonymous?: boolean;
    } = {},
  ) =>
    async (req: Request, { params }: { params: Record<string, string> | undefined }) => {
      const searchParams = getSearchParams(req.url);
      const slug = params?.slug || searchParams.projectSlug;
      const domain = params?.domain || searchParams.domain;
      const key = searchParams.key;

      let headers = {};

      return handler({
        req,
        params: params || {},
        searchParams,
        headers,
        domain,
      });
    };

interface WithoutSessionHandler {
  ({
    req,
    params,
    searchParams,
    headers,
    domain,
  }: {
    req: Request;
    params: Record<string, string>;
    searchParams: Record<string, string>;
    headers: Record<string, string>;
    domain?: string;
  }): Promise<Response>;
}

export const withPublic =
  (handler: WithoutSessionHandler) =>
    async (req: Request, { params }: { params: Record<string, string> }) => {
      const searchParams = getSearchParams(req.url);
      return handler({
        req,
        params: params || {},
        searchParams,
        headers: {},
      });
    };