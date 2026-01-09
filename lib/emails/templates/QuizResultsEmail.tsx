import {
  Button,
  Heading,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';
import BaseLayout from './BaseLayout';

interface QuizResultsEmailProps {
  name: string;
  score: number;
  totalQuestions: number;
  passPercentage: number;
  passed: boolean;
  weakAreas: string[];
  nextSteps: string;
  retakeUrl: string;
}

export const QuizResultsEmail = ({
  name = 'there',
  score = 72,
  totalQuestions = 65,
  passPercentage = 72,
  passed = true,
  weakAreas = ['Networking & VPC', 'Security & IAM'],
  nextSteps = 'Focus on your weak areas and take another practice test to solidify your knowledge.',
  retakeUrl = 'https://www.clouddojo.tech/practice-tests',
}: QuizResultsEmailProps) => {
  const percentage = Math.round((score / totalQuestions) * 100);
  const previewText = passed
    ? `🎉 Congratulations! You passed with ${percentage}%`
    : `Your practice test results: ${percentage}%`;

  return (
    <BaseLayout previewText={previewText}>
      {passed ? (
        // Passed State
        <>
          <Section className="text-center mb-6">
            <Text className="text-5xl m-0">🎉</Text>
          </Section>
          <Heading className="text-2xl font-bold text-emerald-600 text-center mb-2">
            Congratulations, {name}!
          </Heading>
          <Text className="text-gray-700 text-center mb-6">
            You passed your practice test!
          </Text>
        </>
      ) : (
        // Failed State
        <>
          <Section className="text-center mb-6">
            <Text className="text-5xl m-0">📚</Text>
          </Section>
          <Heading className="text-2xl font-bold text-gray-900 text-center mb-2">
            Keep Going, {name}!
          </Heading>
          <Text className="text-gray-700 text-center mb-6">
            You&apos;re making progress. Let&apos;s review your results.
          </Text>
        </>
      )}

      {/* Score Summary */}
      <Section className={`rounded-lg p-6 mb-6 text-center ${passed ? 'bg-emerald-50 border border-emerald-200' : 'bg-orange-50 border border-orange-200'}`}>
        <Text className={`text-4xl font-bold m-0 ${passed ? 'text-emerald-600' : 'text-orange-600'}`}>
          {percentage}%
        </Text>
        <Text className="text-gray-600 text-sm m-0 mt-2">
          {score} out of {totalQuestions} questions correct
        </Text>
        <Text className="text-gray-500 text-xs m-0 mt-1">
          Passing score: {passPercentage}%
        </Text>
      </Section>

      {/* Weak Areas (if any) */}
      {weakAreas.length > 0 && (
        <Section className="bg-gray-50 border border-gray-200 rounded-lg p-5 mb-6">
          <Text className="text-gray-800 font-semibold m-0 mb-3">
            📊 Areas to Improve:
          </Text>
          {weakAreas.map((area, index) => (
            <Text key={index} className="text-gray-600 text-sm m-0 mb-1">
              • {area}
            </Text>
          ))}
        </Section>
      )}

      {/* Next Steps */}
      <Section className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-6">
        <Text className="text-blue-800 font-semibold m-0 mb-2">
          🎯 Recommended Next Steps:
        </Text>
        <Text className="text-blue-700 text-sm m-0">
          {nextSteps}
        </Text>
      </Section>

      {/* CTA */}
      <Section className="text-center my-8">
        <Button
          href={retakeUrl}
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-8 rounded-lg no-underline"
        >
          {passed ? 'Take Another Test' : 'Practice Again'}
        </Button>
      </Section>

      {passed ? (
        <Text className="text-gray-500 text-sm text-center">
          Great job! Keep practicing to maintain your edge. 💪
        </Text>
      ) : (
        <Text className="text-gray-500 text-sm text-center">
          Every practice test brings you closer to certification success. You&apos;ve got this! 🚀
        </Text>
      )}
    </BaseLayout>
  );
};

export default QuizResultsEmail;
