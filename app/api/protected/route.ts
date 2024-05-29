import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// Verify JWT
const verifyJWT = (token: string) => {
  try {
    jwt.verify(token, process.env.JWT_SECRET!);
    return true;
  } catch (e) {
    return false;
  }
};

// GET handler (or POST, depending on your use case)
export const GET = async (req: NextRequest): Promise<NextResponse> => {
  const authorizationHeader = req.headers.get('authorization');
  if (typeof authorizationHeader !== 'string') {
    return NextResponse.json({ error: "You are not logged in!" }, { status: 401 });
  }

  const jwtToken = authorizationHeader.split(" ")[1];
  if (!verifyJWT(jwtToken)) {
    return NextResponse.json({ error: "You are not logged in!" }, { status: 401 });
  }

  const randomText = crypto.randomBytes(8).toString('hex');
  return NextResponse.json({ randomText });
};
