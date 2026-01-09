import {
  Button,
  Column,
  Heading,
  Link,
  Row,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';
import BaseLayout from './BaseLayout';

interface WelcomeEmailProps {
  name: string;
  dashboardUrl: string;
}

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

export const WelcomeEmail = ({
  name = 'there',
  dashboardUrl = 'https://www.clouddojo.tech/dashboard',
}: WelcomeEmailProps) => {
  const previewText = 'Welcome to CloudDojo - Your AWS Certification Journey Begins!';

  return (
    <BaseLayout previewText={previewText}>
      <Heading className="text-2xl font-bold text-gray-900 text-center mb-6">
        Welcome to CloudDojo, {name}! 🎉
      </Heading>

      <Text className="text-gray-700 mb-4">
        Congratulations on taking the first step towards mastering AWS certifications! 
        CloudDojo combines AI-powered analysis with comprehensive practice tests to help you 
        achieve your certification goals.
      </Text>

      <Section className="bg-emerald-50 border border-emerald-200 rounded-lg p-5 mb-6">
        <Text className="text-emerald-800 font-semibold m-0 mb-3">
          🚀 What you can do on CloudDojo:
        </Text>
        <Text className="text-emerald-700 text-sm m-0 mb-2">
          • Take realistic practice tests tailored to AWS certifications
        </Text>
        <Text className="text-emerald-700 text-sm m-0 mb-2">
          • Get AI-powered analysis of your strengths and weak areas
        </Text>
        <Text className="text-emerald-700 text-sm m-0 mb-2">
          • Track your certification readiness with our dashboard
        </Text>
        <Text className="text-emerald-700 text-sm m-0">
          • Receive personalized study recommendations
        </Text>
      </Section>

      <Section className="text-center my-8">
        <Button
          href={dashboardUrl}
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-8 rounded-lg no-underline"
        >
          Start Your First Practice Test
        </Button>
      </Section>

      <Section className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
        <Text className="text-gray-600 text-sm m-0 mb-2">
          <strong>💡 Getting Started Tip:</strong>
        </Text>
        <Text className="text-gray-600 text-sm m-0">
          We recommend starting with a full practice test to establish your baseline. 
          Our AI will then create a personalized study plan based on your results!
        </Text>
      </Section>

      <Section className="mt-8">
        <Row>
          {defaultLinks.map((link) => (
            <Column key={link.title} className="text-center">
              <Link
                className="font-medium text-emerald-600 underline text-sm"
                href={link.href}
              >
                {link.title}
              </Link>
            </Column>
          ))}
        </Row>
      </Section>

      <Text className="text-gray-500 text-sm text-center mt-8">
        Welcome aboard! We&apos;re excited to be part of your certification journey. 🎓
      </Text>
    </BaseLayout>
  );
};

export default WelcomeEmail;
