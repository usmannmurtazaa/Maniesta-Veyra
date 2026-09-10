interface CustomOrderReceivedProps {
  appName: string;
  orderNumber: string;
}

export function CustomOrderReceivedEmail({ appName, orderNumber }: CustomOrderReceivedProps) {
  return (
    <div style={{ fontFamily: 'Inter, sans-serif', color: '#1A1A2E' }}>
      <h1>Custom order received</h1>
      <p>Your custom design order #{orderNumber} has been received by {appName}.</p>
      <p>Our team will review your design and begin production shortly. We&apos;ll notify you of any updates.</p>
    </div>
  );
}