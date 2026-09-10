interface VerificationEmailProps {
  appName: string;
  verificationUrl: string;
}

export function VerificationEmail({ appName, verificationUrl }: VerificationEmailProps) {
  return (
    <div style={{ fontFamily: 'Inter, sans-serif', color: '#1A1A2E' }}>
      <h1>Verify your email</h1>
      <p>Welcome to {appName}. Please click the button below to verify your email address.</p>
      <a
        href={verificationUrl}
        style={{
          display: 'inline-block',
          padding: '12px 24px',
          backgroundColor: '#1A1A2E',
          color: '#FAFAFA',
          textDecoration: 'none',
          borderRadius: '4px',
        }}
      >
        Verify Email
      </a>
      <p>If you didn&apos;t create an account, you can ignore this email.</p>
    </div>
  );
}