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

// Static "was" pricing for visual attraction only — no real discount logic,
// no admin control. Only these two products show it; everyone else is unaffected.
const STRIKETHROUGH_PRODUCTS = ["rasmalai", "coffee"];
const STRIKETHROUGH_FACTOR = 0.915; // ~8.5% off — matches the "₹130 → ₹119" example

export function getStrikethroughPrice(product, price) {
  if (!product?.name || !price) return null;

  const nameLower = product.name.toLowerCase();
  const matches = STRIKETHROUGH_PRODUCTS.some((key) => nameLower.includes(key));
  if (!matches) return null;

  const original = Math.round(price / STRIKETHROUGH_FACTOR / 5) * 5;
  const discountPercent = Math.round(((original - price) / original) * 100);

  return { original, discountPercent };
}