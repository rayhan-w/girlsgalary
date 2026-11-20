import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productId, customerName, customerPhone, rating, comment } = body;

    if (!productId || !customerName || !comment) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        productId,
        customerName: customerName.trim(),
        customerPhone: customerPhone?.trim() || null,
        rating: Math.min(5, Math.max(1, Number(rating) || 5)),
        comment: comment.trim(),
        status: 'PENDING'
      }
    });

    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error('Error submitting review:', error);
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      include: { product: { select: { name: true } } },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}
