import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/auth';
import { cartService } from '@/lib/services/cart-service';
import { getGuestSessionId } from '@/lib/utils/cart-session';
import { getAvailablePaymentMethods } from '@/lib/payments/factory';
import { CheckoutForm } from '@/components/checkout/checkout-form';
import { Container } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Checkout',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default async function CheckoutPage() {
  // ---- Resolve cart ----------------------------------------------------
  let cart;
  try {
    const session = await auth();

    if (session?.user?.id) {
      cart = await cartService.getOrCreateCart({ userId: session.user.id });
    } else {
      const guestSessionId = await getGuestSessionId();
      // No session, no cart cookie → nothing to check out. Send to shop.
      if (!guestSessionId) redirect('/cart');
      cart = await cartService.getOrCreateCart({ guestSessionId });
    }
  } catch (error) {
    console.error('[checkout] failed to resolve cart:', error);
    redirect('/cart');
  }

  // ---- Load cart contents ---------------------------------------------
  let detailedCart;
  try {
    detailedCart = await cartService.getCart(cart.id);
  } catch (error) {
    console.error('[checkout] failed to load cart:', error);
    redirect('/cart');
  }

  const activeItems = detailedCart.items.filter((i) => !i.isSavedForLater);

  // Empty cart → send them back to /cart where the empty state shows.
  if (activeItems.length === 0) {
    redirect('/cart');
  }

  // ---- Serialize for the client form ----------------------------------
  const availablePaymentMethods = getAvailablePaymentMethods();

  const serializedCart = {
    id: detailedCart.id,
    items: activeItems.map((item) => ({
      id: item.id,
      productVariantId: item.productVariantId,
      customDesignId: item.customDesignId,
      quantity: item.quantity,
      unitPrice: item.productVariant
        ? Number(item.productVariant.price ?? item.productVariant.product.basePrice)
        : Number(item.customDesign?.unitPrice ?? 0),
      name: item.productVariant
        ? item.productVariant.product.name
        : `${item.customDesign?.garment.name ?? 'Custom item'}`,
      imageUrl:
        item.productVariant?.product.images[0]?.url ||
        item.customDesign?.previewImageUrl ||
        null,
      color:
        item.productVariant?.color.name ||
        item.customDesign?.color.name ||
        null,
      size:
        item.productVariant?.size.label ||
        item.customDesign?.size.label ||
        null,
    })),
    subtotal: activeItems.reduce((sum, item) => {
      const price = item.productVariant
        ? Number(item.productVariant.price ?? item.productVariant.product.basePrice)
        : Number(item.customDesign?.unitPrice ?? 0);
      return sum + price * item.quantity;
    }, 0),
  };

  return (
    <Container className="py-8 md:py-12">
      <h1 className="font-display text-3xl md:text-4xl font-bold mb-8 text-mv-text">
        Checkout
      </h1>
      <CheckoutForm
        cart={serializedCart}
        paymentMethods={availablePaymentMethods}
      />
    </Container>
  );
}