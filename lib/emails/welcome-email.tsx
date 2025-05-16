import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import type * as React from 'react';

interface CloudDojoWelcomeEmailProps {
  username: string;
  steps?: {
    id: number;
    Description: React.ReactNode;
  }[];
  links?: {
    title: string;
    href: string;
  }[];
}

const defaultSteps = [
  {
    id: 1,
    Description: (
      <li className="mb-20" key={1}>
        <strong>Take your first practice test.</strong>{' '}
        Start with a comprehensive AWS practice exam to establish your baseline knowledge and get personalized AI insights.
      </li>
    ),
  },
  {
    id: 2,
    Description: (
      <li className="mb-20" key={2}>
        <strong>Review your AI analysis.</strong>{' '}
        Get detailed insights about your strengths and areas for improvement, along with a personalized study plan.
      </li>
    ),
  },
  {
    id: 3,
    Description: (
      <li className="mb-20" key={3}>
        <strong>Track your progress.</strong>{' '}
        Monitor your certification readiness score and watch your knowledge grow with each practice session.
      </li>
    ),
  },
  {
    id: 4,
    Description: (
      <li className="mb-20" key={4}>
        <strong>Join our community.</strong>{' '}
        Connect with fellow AWS certification candidates and share your journey to success.
      </li>
    ),
  },
];

const defaultLinks = [
  {
    title: 'Practice Tests',
    href: 'https://www.clouddojo.tech/practice-tests',
  },
  { 
    title: 'Study Resources', 
    href: 'https://www.clouddojo.tech/resources' 
  },
  { 
    title: 'Get Support', 
    href: 'https://www.clouddojo.tech/support' 
  },
];

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'https://www.clouddojo.tech';

export const CloudDojoWelcomeEmail = ({
  username,
  steps = defaultSteps,
  links = defaultLinks,
}: CloudDojoWelcomeEmailProps) => {
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
        <Preview>Welcome to CloudDojo - Your AWS Certification Journey Begins!</Preview>
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
              Welcome to CloudDojo, {username}!
            </Heading>

            <Section>
              <Row>
                <Text className="text-base">
                  Congratulations on taking the first step towards mastering AWS certifications! 
                  CloudDojo combines AI-powered analysis with comprehensive practice tests to help you 
                  achieve your certification goals.
                </Text>

                <Text className="text-base">Here's how to get started:</Text>
              </Row>
            </Section>

            <ul>{steps?.map(({ Description }) => Description)}</ul>

            <Section className="text-center">
              <Button 
                href="https://www.clouddojo.tech/dashboard"
                className="rounded-lg bg-brand px-[18px] py-3 text-white"
              >
                Go to your dashboard
              </Button>
            </Section>

            <Section className="mt-45">
              <Row>
                {links?.map((link) => (
                  <Column key={link.title}>
                    <Link
                      className="font-bold text-black underline"
                      href={link.href}
                    >
                      {link.title}
                    </Link>{' '}
                    <span className="text-emerald-500">→</span>
                  </Column>
                ))}
              </Row>
            </Section>
          </Container>

          <Container className="mt-20">
            <Section>
              <Row>
                <Column className="px-20 text-right">
                  <Link href="https://www.clouddojo.tech/settings/notifications">Email Preferences</Link>
                </Column>
              </Row>
            </Section>
            <Text className="mb-45 text-center text-gray-400">
              CloudDojo - Your Path to AWS Certification Success
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default CloudDojoWelcomeEmail; 