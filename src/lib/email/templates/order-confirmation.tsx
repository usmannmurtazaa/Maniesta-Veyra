interface OrderConfirmationProps {
  appName: string;
  orderNumber: string;
  total: number;
  currency: string;
}

export function OrderConfirmationEmail({ appName, orderNumber, total, currency }: OrderConfirmationProps) {
  return (
    <div style={{ fontFamily: 'Inter, sans-serif', color: '#1A1A2E' }}>
      <h1>Thank you for your order!</h1>
      <p>Your order from {appName} has been confirmed.</p>
      <p>
        <strong>Order number:</strong> {orderNumber}
      </p>
      <p>
        <strong>Total:</strong> {currency} {total.toLocaleString()}
      </p>
      <p>We&apos;ll notify you when your order ships.</p>
    </div>
  );
}