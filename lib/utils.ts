export function formatPrice(price: number): string {
  return `৳${Math.round(price).toLocaleString('en-US')}`;
}

export function calculateDiscount(regularPrice: number, offerPrice: number): number {
  if (!regularPrice || regularPrice <= offerPrice) return 0;
  return Math.round(((regularPrice - offerPrice) / regularPrice) * 100);
}

export function formatDate(dateStr: string | Date): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
