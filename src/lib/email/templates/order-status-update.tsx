interface OrderStatusUpdateProps {
  appName: string;
  orderNumber: string;
  status: string;
}

export function OrderStatusUpdateEmail({ appName, orderNumber, status }: OrderStatusUpdateProps) {
  return (
    <div style={{ fontFamily: 'Inter, sans-serif', color: '#1A1A2E' }}>
      <h1>Order status updated</h1>
      <p>Your order #{orderNumber} from {appName} is now: <strong>{status}</strong>.</p>
      <p>Log in to your account for more details.</p>
    </div>
  );
}