import { auth } from '@/lib/auth/auth';
import { cartService } from '@/lib/services/cart-service';
import { getGuestSessionId } from '@/lib/utils/cart-session';
import { getAvailablePaymentMethods } from '@/lib/payments/factory';
import { CheckoutForm } from '@/components/checkout/checkout-form';
import { Container } from '@/components/layout';
import { notFound } from 'next/navigation';

export default async function CheckoutPage() {
  const session = await auth();
  let cart;
  if (session?.user?.id) {
    cart = await cartService.getOrCreateCart({ userId: session.user.id });
  } else {
    const guestSessionId = getGuestSessionId();
    if (!guestSessionId) return notFound();
    cart = await cartService.getOrCreateCart({ guestSessionId });
  }

  const detailedCart = await cartService.getCart(cart.id);
  if (!detailedCart || detailedCart.items.filter((i) => !i.isSavedForLater).length === 0) {
    return notFound();
  }

  const availablePaymentMethods = getAvailablePaymentMethods();

  const serializedCart = {
    id: detailedCart.id,
    items: detailedCart.items
      .filter((i) => !i.isSavedForLater)
      .map((item) => ({
        id: item.id,
        productVariantId: item.productVariantId,
        customDesignId: item.customDesignId,
        quantity: item.quantity,
        unitPrice: item.productVariant
          ? Number(item.productVariant.price ?? item.productVariant.product.basePrice)
          : Number(item.customDesign?.unitPrice ?? 0),
        name: item.productVariant
          ? item.productVariant.product.name
          : `${item.customDesign?.garment.name} (Custom)`,
        imageUrl: item.productVariant?.product.images[0]?.url || item.customDesign?.previewImageUrl,
        color: item.productVariant?.color.name || item.customDesign?.color.name,
        size: item.productVariant?.size.label || item.customDesign?.size.label,
      })),
    subtotal: detailedCart.items.reduce((sum, item) => {
      const price = item.productVariant
        ? Number(item.productVariant.price ?? item.productVariant.product.basePrice)
        : Number(item.customDesign?.unitPrice ?? 0);
      return sum + price * item.quantity;
    }, 0),
  };

  return (
    <Container className="py-8">
      <h1 className="font-display text-3xl font-bold mb-6">Checkout</h1>
      <CheckoutForm cart={serializedCart} paymentMethods={availablePaymentMethods} />
    </Container>
  );
}