import { sealData, unsealData } from 'iron-session';
import { ResponseCookies } from 'next/dist/compiled/@edge-runtime/cookies';
import { NextRequest, NextResponse } from 'next/server';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

export const APP_NAME = 'Next Siws App';
export const COOKIE_NAME = 'web3session';

if (!process.env.SESSION_SECRET) {
  throw new Error('SESSION_SECRET cannot be empty.');
}

if (!process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID) {
  throw new Error('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID cannot be empty.');
}

export const SESSION_OPTIONS = {
  ttl: 60 * 60 * 24 * 30, // 30 days
  password: process.env.SESSION_SECRET!,
};

export type ISiwsSession = {
  nonce?: string;
  chainId?: number;
  address?: string;
  userId?: string;
};

class SiwsSession {
  nonce?: string;
  chainId?: number;
  address?: string;
  userId?: string;

  constructor(session?: ISiwsSession) {
    this.nonce = session?.nonce;
    this.chainId = session?.chainId;
    this.address = session?.address;
    this.userId = session?.userId;
  }

  static async fromCookies(cookies: ReadonlyRequestCookies): Promise<SiwsSession> {
    const sessionCookie = cookies.get(COOKIE_NAME)?.value;

    if (!sessionCookie) throw new Error('Not authenticated');
    return new SiwsSession(await unsealData<ISiwsSession>(sessionCookie, SESSION_OPTIONS));
  }

  static async fromRequest(req: NextRequest): Promise<SiwsSession> {
    const sessionCookie = req.cookies.get(COOKIE_NAME)?.value;

    if (!sessionCookie) return new SiwsSession();
    return new SiwsSession(await unsealData<ISiwsSession>(sessionCookie, SESSION_OPTIONS));
  }

  clear(res: NextResponse | ResponseCookies): Promise<void> {
    this.nonce = undefined;
    this.chainId = undefined;
    this.address = undefined;
    this.userId = undefined;

    return this.persist(res);
  }

  toJSON(): ISiwsSession {
    return {
      nonce: this.nonce,
      address: this.address,
      chainId: this.chainId,
      userId: this.userId,
    };
  }

  async persist(res: NextResponse | ResponseCookies): Promise<void> {
    let cookies: ResponseCookies;
    if (isCookies(res)) cookies = res;
    else cookies = res.cookies;

    cookies.set(COOKIE_NAME, await sealData(this.toJSON(), SESSION_OPTIONS), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });
  }
}

const isCookies = (cookies: NextResponse | ResponseCookies): cookies is ResponseCookies => {
  return (cookies as ResponseCookies).set !== undefined;
};

export default SiwsSession;
