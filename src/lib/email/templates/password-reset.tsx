interface PasswordResetProps {
  appName: string;
  resetUrl: string;
}

export function PasswordResetEmail({ appName, resetUrl }: PasswordResetProps) {
  return (
    <div style={{ fontFamily: 'Inter, sans-serif', color: '#1A1A2E' }}>
      <h1>Reset your password</h1>
      <p>We received a request to reset your password for {appName}. Click the button below to choose a new password.</p>
      <a
        href={resetUrl}
        style={{
          display: 'inline-block',
          padding: '12px 24px',
          backgroundColor: '#C0392B',
          color: '#FAFAFA',
          textDecoration: 'none',
          borderRadius: '4px',
        }}
      >
        Reset Password
      </a>
      <p>This link will expire in 30 minutes. If you didn&apos;t request this, please ignore this email.</p>
    </div>
  );
}