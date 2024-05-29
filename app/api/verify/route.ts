import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { verifySIWS } from '@talismn/siws';
import { SIWS_HOSTNAME } from '@/siws-app/lib/constants';
import SiwsSession, { COOKIE_NAME } from '@/siws-app/lib/siws-session';

// Verify SIWS
const verifySIWSMessage = async (message: string, signature: string, address: string) => {
  console.log("message", message);
  try {
    return await verifySIWS(message, signature, address);
  } catch (e) {
    throw new Error('Invalid signature!');
  }
};

// POST handler
export const POST = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const session = await SiwsSession.fromRequest(req);
    const nonce = session.nonce;
    if (!nonce) {
      console.log("Invalid session! Please try again.", nonce);
      return NextResponse.json({ error: "Invalid session! Please try again." }, { status: 401 });
    }

    const { signature, message, address } = await req.json();
    const siwsMessage = await verifySIWSMessage(message, signature, address);

    if (nonce !== siwsMessage.nonce) {
      console.log("Invalid nonce! Please try again.", nonce, siwsMessage.nonce);
      return NextResponse.json({ error: "Invalid nonce! Please try again." }, { status: 401 });
    }

    if (siwsMessage.domain !== SIWS_HOSTNAME) {
      throw new Error("SIWS Error: Signature was meant for a different domain.");
    }

    const jwtPayload = {
      address: siwsMessage.address,
      // ... add additional user information here
    };

    const jwtToken = jwt.sign(jwtPayload, process.env.JWT_SECRET!, {
      algorithm: 'HS256',
    });

    return NextResponse.json({ jwtToken });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Invalid signature!" }, { status: 401 });
  }
};
