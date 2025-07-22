import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import type * as React from 'react';

interface FeedbackThankYouEmailProps {
  username: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'https://www.clouddojo.tech';

export const FeedbackThankYouEmail = ({
  username,
}: FeedbackThankYouEmailProps) => {
  return (
    <Html>
      <Head />
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                brand: '#10b981',
                offwhite: '#fafbfb',
              },
              spacing: {
                0: '0px',
                20: '20px',
                45: '45px',
              },
            },
          },
        }}
      >
        <Preview>Thank you for your feedback!</Preview>
        <Body className="bg-offwhite font-sans text-base">
          <Img
            src={`https://www.clouddojo.tech/images/dojo-logo.png`}
            width="184"
            height="75"
            alt="CloudDojo"
            className="mx-auto my-20"
          />
          <Container className="bg-white p-45">
            <Heading className="my-0 text-center leading-8">
              Thank You for Your Feedback, {username}!
            </Heading>

            <Section>
              <Text className="text-base">
                We truly appreciate you taking the time to share your thoughts with us. 
                Your feedback helps us improve CloudDojo and create a better learning experience 
                for AWS certification candidates like you.
              </Text>
            </Section>

            <Section className="mt-6">
              <Text className="text-base font-medium">Here are some helpful resources:</Text>
              <ul className="list-none pl-0">
                <li className="mb-3">
                  <Link
                    href="https://www.clouddojo.tech/practice-tests"
                    className="text-brand hover:text-emerald-700"
                  >
                    → Practice Tests
                  </Link>
                </li>
                <li className="mb-3">
                  <Link
                    href="https://www.clouddojo.tech/resources"
                    className="text-brand hover:text-emerald-700"
                  >
                    → Study Resources
                  </Link>
                </li>
                <li className="mb-3">
                  <Link
                    href="https://www.clouddojo.tech/dashboard"
                    className="text-brand hover:text-emerald-700"
                  >
                    → Your Dashboard
                  </Link>
                </li>
              </ul>
            </Section>

            <Section className="mt-8">
              <Text className="text-sm text-gray-600">
                For additional support, contact{' '}
                <Link
                  href="mailto:support@clouddojo.tech"
                  className="text-brand hover:text-emerald-700"
                >
                  support@clouddojo.tech
                </Link>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default FeedbackThankYouEmail; 