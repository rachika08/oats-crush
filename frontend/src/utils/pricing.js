export const SHIPPING_FEE = 60;
export const FREE_SHIPPING_THRESHOLD = 499;
export const DISCOUNT_THRESHOLD = 1499;
export const DISCOUNT_AMOUNT = 50;
export const FREE_BLENDER_THRESHOLD = 2999;

export const REWARD_TIERS = [
  { amount: FREE_SHIPPING_THRESHOLD, label: "Free Shipping" },
  { amount: DISCOUNT_THRESHOLD, label: "₹50 Off" },
  { amount: FREE_BLENDER_THRESHOLD, label: "Free Blender" },
];

export function calculatePricing(subtotal, itemCount = 1) {
  const shippingFee =
    itemCount === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const discount = subtotal >= DISCOUNT_THRESHOLD ? DISCOUNT_AMOUNT : 0;
  const grandTotal = itemCount > 0 ? subtotal + shippingFee - discount : 0;

  return { subtotal, shippingFee, discount, grandTotal };
}