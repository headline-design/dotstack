import { tap } from '@/dashboard/lib/utils';
import prisma from '@/dashboard/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import SiwsSession from '@/dashboard/lib/siws-session';
import { getSession } from '@/dashboard/lib/auth';
import { generateNonce } from '@/siws-app/siws-extender/utils';
import { SiwsMessage, verifySIWS } from '@talismn/siws';
import { SiwsErrorType } from '@/siws-app/siws-extender/types';

// Verify SIWS
const verifySIWSMessage = async (message: string, signature: string, address: string) => {
  console.log("message", message);
  try {
    return await verifySIWS(message, signature, address);
  } catch (e) {
    throw new Error('Invalid signature!');
  }
};

export const GET = async (req: NextRequest): Promise<NextResponse> => {
  const session = await getSession();

  return NextResponse.json(session);
};

export const PUT = async (req: NextRequest): Promise<NextResponse> => {
  const session = await SiwsSession.fromRequest(req);
  if (!session?.nonce) session.nonce = generateNonce();

  return tap(new NextResponse(session.nonce), (res: any) => session.persist(res));
};

export const POST = async (req: NextRequest) => {
  const { message, signature, address } = await req.json();

  const session = await SiwsSession.fromRequest(req);
  console.log('---session at 37', session);

  try {
    const fields = await verifySIWSMessage(message, signature, address);

    if (fields.nonce !== session.nonce) {
      return tap(new NextResponse('Invalid nonce.', { status: 422 }), (res: any) =>
        session.clear(res),
      );
    }
    session.address = fields.address;
    session.nonce = undefined;
    session.userId = fields.address;
  } catch (error) {
    switch (error) {
      case SiwsErrorType.INVALID_NONCE:
      case SiwsErrorType.INVALID_SIGNATURE:
        return tap(new NextResponse(String(error), { status: 422 }), (res: any) =>
          session.clear(res),
        );

      default:
        return tap(new NextResponse(String(error), { status: 400 }), (res: any) =>
          session.clear(res),
        );
    }
  }

  const user: any = await prisma.user.upsert({
    where: { id: session.userId },
    create: { id: session.userId },
    update: { id: session.userId },
  });

  // then add a wallet to the user

  session.userId = user.id;

  return tap(new NextResponse(''), (res: any) => session.persist(res));
};

export const DELETE = async (req: NextRequest) => {
  const session = await SiwsSession.fromRequest(req);

  return tap(new NextResponse(''), (res: any) => session.clear(res));
};
