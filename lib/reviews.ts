import { prisma } from "@/lib/prisma";

export async function getApprovedReviews(productSlug: string) {
  return prisma.productReview.findMany({
    where: { productSlug, status: "APPROVED" },
    include: { images: true },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    take: 50,
  });
}

export async function getReviewSummary(productSlug: string) {
  const reviews = await getApprovedReviews(productSlug);
  const count = reviews.length;
  const average = count ? reviews.reduce((sum, review) => sum + review.rating, 0) / count : 0;
  const distribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((review) => review.rating === rating).length,
  }));
  return { reviews, count, average, distribution };
}
