import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import type * as React from 'react';

interface FeedbackNotificationEmailProps {
  userName: string;
  userEmail: string;
  feedbackType: string;
  feedbackContent: string;
  mood: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'https://www.clouddojo.tech';

export const FeedbackNotificationEmail = ({
  userName,
  userEmail,
  feedbackType,
  feedbackContent,
  mood,
}: FeedbackNotificationEmailProps) => {
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
        <Preview>New Feedback Received from {userName}</Preview>
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
              New Feedback Received
            </Heading>

            <Section className="mt-6">
              <Text className="text-base font-medium mb-4">User Information:</Text>
              <div className="bg-gray-50 p-4 rounded-lg">
                <Text className="text-sm mb-2">
                  <strong>Name:</strong> {userName}
                </Text>
                <Text className="text-sm mb-2">
                  <strong>Email:</strong> {userEmail}
                </Text>
                <Text className="text-sm mb-2">
                  <strong>Feedback Type:</strong> {feedbackType}
                </Text>
                <Text className='text-sm mb-2'>
                  <strong>Mood</strong> {mood}
                </Text>
              </div>
            </Section>

            <Section className="mt-6">
              <Text className="text-base font-medium mb-4">Feedback Content:</Text>
              <div className="bg-gray-50 p-4 rounded-lg">
                <Text className="text-sm whitespace-pre-wrap">{feedbackContent}</Text>
              </div>
            </Section>

            <Section className="mt-8">
              <Text className="text-sm text-gray-600 text-center">
                This is an automated notification from the CloudDojo feedback system.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default FeedbackNotificationEmail; 