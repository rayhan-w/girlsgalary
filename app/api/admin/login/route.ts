import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password required' }, { status: 400 });
    }

    const staff = await prisma.staffUser.findUnique({
      where: { username: username.trim() }
    });

    if (!staff || !staff.isActive) {
      return NextResponse.json({ error: 'Invalid username or account inactive' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, staff.password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    // Record login activity
    await prisma.activityLog.create({
      data: {
        staffName: staff.name,
        action: 'LOGIN',
        details: `Logged in with role ${staff.role}`
      }
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      user: {
        id: staff.id,
        name: staff.name,
        username: staff.username,
        role: staff.role
      }
    });
  } catch (error) {
    console.error('Error logging in admin:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
