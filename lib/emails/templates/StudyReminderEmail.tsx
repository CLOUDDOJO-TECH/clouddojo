import {
  Button,
  Heading,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';
import BaseLayout from './BaseLayout';

interface StudyReminderEmailProps {
  name: string;
  lastCertification: string;
  daysSinceLastStudy: number;
  practiceTestUrl: string;
  unsubscribeUrl: string;
}

export const StudyReminderEmail = ({
  name = 'there',
  lastCertification = 'AWS Solutions Architect',
  daysSinceLastStudy = 3,
  practiceTestUrl = 'https://www.clouddojo.tech/practice-tests',
  unsubscribeUrl = 'https://www.clouddojo.tech/settings/notifications',
}: StudyReminderEmailProps) => {
  const previewText = `It's been ${daysSinceLastStudy} days since your last study session`;

  // Friendly message based on days since last study
  const getMessage = () => {
    if (daysSinceLastStudy <= 3) {
      return "Great job keeping up with your studies! A quick practice session today will help reinforce what you've learned.";
    } else if (daysSinceLastStudy <= 7) {
      return "It's been a few days since your last study session. Consistency is key to certification success!";
    } else {
      return "We miss you! Regular practice is the best way to stay on track for your AWS certification goal.";
    }
  };

  // Emoji based on days
  const getEmoji = () => {
    if (daysSinceLastStudy <= 3) return '🔥';
    if (daysSinceLastStudy <= 7) return '💪';
    return '👋';
  };

  return (
    <BaseLayout previewText={previewText} unsubscribeUrl={unsubscribeUrl}>
      <Heading className="text-2xl font-bold text-gray-900 text-center mb-6">
        {getEmoji()} Time to Continue Your AWS Journey!
      </Heading>

      <Text className="text-gray-700 mb-4">
        Hi {name},
      </Text>

      <Text className="text-gray-700 mb-4">
        {getMessage()}
      </Text>

      <Section className="bg-emerald-50 border border-emerald-200 rounded-lg p-5 mb-6">
        <Text className="text-emerald-800 text-sm m-0 mb-2">
          <strong>📚 Your Progress</strong>
        </Text>
        <Text className="text-emerald-700 text-sm m-0">
          Currently studying: <strong>{lastCertification}</strong>
        </Text>
        <Text className="text-emerald-700 text-sm m-0 mt-1">
          Days since last session: <strong>{daysSinceLastStudy}</strong>
        </Text>
      </Section>

      <Section className="text-center my-8">
        <Button
          href={practiceTestUrl}
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-8 rounded-lg no-underline"
        >
          Continue Studying
        </Button>
      </Section>

      <Section className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
        <Text className="text-gray-600 text-sm m-0 mb-2">
          <strong>💡 Study Tip:</strong>
        </Text>
        <Text className="text-gray-600 text-sm m-0">
          Even 15-20 minutes of daily practice can make a big difference. Focus on your weak areas and you&apos;ll see improvement in no time!
        </Text>
      </Section>

      <Text className="text-gray-500 text-sm text-center mt-6">
        Keep pushing forward. You&apos;ve got this! 🚀
      </Text>
    </BaseLayout>
  );
};

export default StudyReminderEmail;
