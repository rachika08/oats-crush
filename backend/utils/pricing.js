export const SHIPPING_FEE = 60;
export const FREE_SHIPPING_THRESHOLD = 499;
export const DISCOUNT_THRESHOLD = 1499;
export const DISCOUNT_AMOUNT = 50;

export const calculatePricing = (subtotal) => {
    const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
    const discount = subtotal >= DISCOUNT_THRESHOLD ? DISCOUNT_AMOUNT : 0;
    const totalAmount = subtotal + shippingFee - discount;

    return { subtotal, shippingFee, discount, totalAmount };
};