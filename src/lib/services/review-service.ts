import { prisma } from '@/lib/db/prisma';
import { ReviewStatus } from '@prisma/client';

export class ReviewService {
  async createReview(input: {
    productId: string;
    userId: string;
    rating: number;
    title?: string;
    content?: string;
    orderItemId?: string;
  }) {
    return prisma.review.create({
      data: {
        ...input,
        status: ReviewStatus.PENDING,
        isVerifiedPurchase: false,
      },
    });
  }

  async approveReview(reviewId: string) {
    return prisma.review.update({
      where: { id: reviewId },
      data: { status: ReviewStatus.APPROVED },
    });
  }

  async rejectReview(reviewId: string) {
    return prisma.review.update({
      where: { id: reviewId },
      data: { status: ReviewStatus.REJECTED },
    });
  }

  async getProductReviews(productId: string, page = 1, limit = 10) {
    const where = { productId, status: ReviewStatus.APPROVED };
    const [total, reviews] = await Promise.all([
      prisma.review.count({ where }),
      prisma.review.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: { user: { select: { firstName: true, lastName: true } } },
        orderBy: { createdAt: 'desc' },
      }),
    ]);
    return { data: reviews, pagination: { page, limit, total } };
  }
}

export const reviewService = new ReviewService();