import { getSession, withAuth } from '@/dashboard/lib/auth';
import prisma from '@/dashboard/lib/prisma';
import { NextResponse } from 'next/server';

// GET user data
export const GET = withAuth(async (res) => {
  const session = await getSession();

  if (!session || !session.user) {
    console.log('Unauthorized');
    return new Response('Failed to fetch user data', {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        accounts: true, // Fetching account information
      },
    });

    if (!user) {
      return new Response('User not found', {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Create a map of connected accounts
    const connectedAccounts = {
      discord: !!user.accounts.some((acc) => acc.provider === 'discord'),
      google: !!user.accounts.some((acc) => acc.provider === 'google'),
      github: !!user.accounts.some((acc) => acc.provider === 'github'),
      twitter: !!user.accounts.some((acc) => acc.provider === 'twitter'),
    };

    // Construct the safe user data to return
    const safeUserData = {
      id: user.id,
      name: user.name,
      email: user.email, // Include only non-sensitive user details
      connectedAccounts,
    };

    return NextResponse.json(safeUserData);
  } catch (error) {
    console.error('GET Error:', error);
    return new Response('Internal Server Error', {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

// PUT update user data
export const PUT = withAuth(async ({ req }) => {
  const session = await getSession();

  if (!session || !session.user) {
    return new Response('Unauthorized', {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  const { name } = await req.json();

  try {
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { name },
    });

    return NextResponse.json(user);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return new Response('User not found', {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    console.error('PUT Error:', error);
    return new Response('Internal Server Error', {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

// DELETE user account connection
export const DELETE = withAuth(async ({ req }) => {
  const session = await getSession();

  if (!session || !session.user) {
    return new Response('Unauthorized', {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { provider } = await req.json(); // Assuming the front-end sends which provider to disconnect.

  try {
    // Disconnect the account in the database
    await prisma.account.deleteMany({
      where: {
        userId: session.user.id,
        provider: provider,
      },
    });

    return new Response('Account disconnected successfully', {
      status: 204,
    });
  } catch (error) {
    console.error('DELETE Error:', error);
    return new Response('Internal Server Error', {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
