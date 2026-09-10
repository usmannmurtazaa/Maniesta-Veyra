interface CustomOrderApprovedProps {
  appName: string;
  orderNumber: string;
}

export function CustomOrderApprovedEmail({ appName, orderNumber }: CustomOrderApprovedProps) {
  return (
    <div style={{ fontFamily: 'Inter, sans-serif', color: '#1A1A2E' }}>
      <h1>Custom order approved</h1>
      <p>Good news! Your custom design order #{orderNumber} has been approved by {appName}.</p>
      <p>Production is now underway. We&apos;ll update you when it ships.</p>
    </div>
  );
}