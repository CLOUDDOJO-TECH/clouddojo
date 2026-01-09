import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import { Tailwind } from '@react-email/tailwind';
import type * as React from 'react';

interface BaseLayoutProps {
  previewText: string;
  children: React.ReactNode;
  unsubscribeUrl?: string;
}

// Base URL for links - supports Vercel preview deployments
const getBaseUrl = () => {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  // Default to production URL
  return 'https://www.clouddojo.tech';
};

const baseUrl = getBaseUrl();

// CloudDojo brand colors (teal-green palette)
const tailwindConfig = {
  theme: {
    extend: {
      colors: {
        brand: '#10b981',
        'brand-dark': '#059669',
        offwhite: '#fafbfb',
      },
      spacing: {
        0: '0px',
        20: '20px',
        45: '45px',
      },
    },
  },
};

export const BaseLayout = ({
  previewText,
  children,
  unsubscribeUrl,
}: BaseLayoutProps) => {
  return (
    <Html>
      <Head />
      <Tailwind config={tailwindConfig}>
        <Preview>{previewText}</Preview>
        <Body className="bg-offwhite font-sans text-base">
          {/* Header with Logo */}
          <Container className="mx-auto max-w-[600px]">
            <Section className="py-5 text-center">
              <Link href={baseUrl}>
                <Img
                  src="https://www.clouddojo.tech/images/dojo-logo.png"
                  width="150"
                  height="auto"
                  alt="CloudDojo"
                  className="mx-auto"
                />
              </Link>
            </Section>
          </Container>

          {/* Main Content */}
          <Container className="mx-auto max-w-[600px] bg-white rounded-lg p-8">
            {children}
          </Container>

          {/* Footer */}
          <Container className="mx-auto max-w-[600px] mt-6 mb-8">
            <Section className="text-center">
              {unsubscribeUrl && (
                <Text className="text-gray-500 text-sm mb-2">
                  <Link href={unsubscribeUrl} className="text-gray-500 underline">
                    Unsubscribe
                  </Link>
                  {' | '}
                  <Link href={`${baseUrl}/settings/notifications`} className="text-gray-500 underline">
                    Email Preferences
                  </Link>
                </Text>
              )}
              <Text className="text-gray-400 text-xs">
                CloudDojo - Your Path to AWS Certification Success
              </Text>
              <Text className="text-gray-400 text-xs">
                © {new Date().getFullYear()} CloudDojo. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default BaseLayout;
