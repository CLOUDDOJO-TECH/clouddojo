import {
  Button,
  Heading,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';
import BaseLayout from './BaseLayout';

interface PasswordResetEmailProps {
  name: string;
  resetUrl: string;
  expiryTime: string;
}

export const PasswordResetEmail = ({
  name = 'there',
  resetUrl = 'https://www.clouddojo.tech/reset-password',
  expiryTime = '1 hour',
}: PasswordResetEmailProps) => {
  const previewText = 'Reset your CloudDojo password';

  return (
    <BaseLayout previewText={previewText}>
      <Heading className="text-2xl font-bold text-gray-900 text-center mb-6">
        Password Reset Request
      </Heading>

      <Text className="text-gray-700 mb-4">
        Hi {name},
      </Text>

      <Text className="text-gray-700 mb-4">
        We received a request to reset your CloudDojo password. Click the button below to create a new password:
      </Text>

      <Section className="text-center my-8">
        <Button
          href={resetUrl}
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-8 rounded-lg no-underline"
        >
          Reset Password
        </Button>
      </Section>

      <Section className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
        <Text className="text-amber-800 text-sm m-0">
          ⏰ <strong>This link expires in {expiryTime}.</strong> After that, you&apos;ll need to request a new password reset.
        </Text>
      </Section>

      <Section className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
        <Text className="text-gray-600 text-sm m-0 mb-2">
          <strong>🔒 Security Note:</strong>
        </Text>
        <Text className="text-gray-600 text-sm m-0">
          If you didn&apos;t request this password reset, you can safely ignore this email. Your password will remain unchanged.
        </Text>
        <Text className="text-gray-600 text-sm m-0 mt-2">
          For your security, never share this link with anyone. CloudDojo staff will never ask for your password.
        </Text>
      </Section>

      <Text className="text-gray-500 text-sm">
        If the button above doesn&apos;t work, copy and paste this link into your browser:
      </Text>
      <Text className="text-emerald-600 text-sm break-all">
        {resetUrl}
      </Text>
    </BaseLayout>
  );
};

export default PasswordResetEmail;
