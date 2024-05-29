import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import SiwsSession, { COOKIE_NAME } from '@/siws-app/lib/siws-session';
import { generateNonce } from '@/siws-extender/utils';
import { tap } from '@/siws-app/lib/utils';


export const GET = async (req: NextRequest): Promise<NextResponse> => {
  const nonce = generateNonce();
  return NextResponse.json({ nonce });
};

export const PUT = async (req: NextRequest): Promise<NextResponse> => {
  const session = await SiwsSession.fromRequest(req);
  if (!session?.nonce) session.nonce = generateNonce();

  return tap(new NextResponse(session.nonce), (res: any) => session.persist(res));
};

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  const nonce = crypto.randomUUID();
  const response = NextResponse.json({ nonce });

  const session = new SiwsSession({ nonce });
  await session.persist(response);

  // Verify that the cookie is set
  if (!response.cookies.get(COOKIE_NAME)) {
    throw new Error('Failed to set cookie');
  }

  return response;
};