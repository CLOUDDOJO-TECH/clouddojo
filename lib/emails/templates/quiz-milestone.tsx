/**
 * Quiz Milestone Email Template
 *
 * Sent when user completes milestone quiz counts (10, 25, 50, 100)
 */

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Hr,
} from '@react-email/components';
import * as React from 'react';

interface QuizMilestoneEmailProps {
  username: string;
  quizCount: number;
  totalScore: number;
  averageScore: number;
  nextMilestone: number;
  topCategory?: string;
}

export const QuizMilestoneEmail = ({
  username = 'CloudDojo User',
  quizCount = 10,
  totalScore = 0,
  averageScore = 0,
  nextMilestone = 25,
  topCategory = 'AWS',
}: QuizMilestoneEmailProps) => {
  const getMilestoneMessage = (count: number) => {
    if (count === 10) return "You've completed your first 10 quizzes! 🎯";
    if (count === 25) return "25 quizzes down! You're unstoppable! 🚀";
    if (count === 50) return "50 quizzes! You're halfway to mastery! ⭐";
    if (count === 100) return "100 QUIZZES! You're a CloudDojo legend! 🏆";
    return `${count} quizzes completed! Keep going! 💪`;
  };

  const getEncouragementMessage = (count: number) => {
    if (count === 10) return "This is just the beginning of your cloud certification journey!";
    if (count === 25) return "Your dedication is paying off. Keep this momentum going!";
    if (count === 50) return "You're proving your commitment to cloud mastery!";
    if (count === 100) return "You've shown exceptional dedication. Certification is within reach!";
    return "Every quiz brings you closer to certification success!";
  };

  return (
    <Html>
      <Head />
      <Preview>{getMilestoneMessage(quizCount)}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={h1}>{getMilestoneMessage(quizCount)}</Heading>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Text style={text}>Hey {username}! 👋</Text>

            <Text style={text}>
              Congratulations! You just hit a major milestone on your cloud certification journey.
              {getEncouragementMessage(quizCount)}
            </Text>

            {/* Stats Box */}
            <Section style={statsBox}>
              <table style={{ width: '100%', marginTop: '20px' }}>
                <tr>
                  <td style={statCell}>
                    <div style={statNumber}>{quizCount}</div>
                    <div style={statLabel}>Quizzes Completed</div>
                  </td>
                  <td style={statCell}>
                    <div style={statNumber}>{averageScore}%</div>
                    <div style={statLabel}>Average Score</div>
                  </td>
                  <td style={statCell}>
                    <div style={statNumber}>{totalScore}</div>
                    <div style={statLabel}>Total Points</div>
                  </td>
                </tr>
              </table>
            </Section>

            {topCategory && (
              <Section style={highlightBox}>
                <Text style={highlightText}>
                  🌟 Your strongest area: <strong>{topCategory}</strong>
                </Text>
              </Section>
            )}

            <Text style={text}>
              You're only {nextMilestone - quizCount} quizzes away from your next milestone!
              Keep up the amazing work.
            </Text>

            {/* CTA Button */}
            <Section style={buttonContainer}>
              <Button style={button} href="https://clouddojo.tech/dashboard">
                Continue Learning
              </Button>
            </Section>

            <Hr style={hr} />

            {/* Social Proof */}
            <Text style={smallText}>
              💡 <strong>Did you know?</strong> Users who complete {nextMilestone} quizzes have a
              3x higher certification pass rate!
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              CloudDojo - Your path to cloud certification
            </Text>
            <Text style={footerText}>
              <a href="https://clouddojo.tech/dashboard/settings/email-preferences" style={link}>
                Email Preferences
              </a>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default QuizMilestoneEmail;

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const header = {
  padding: '32px 40px',
  textAlign: 'center' as const,
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
};

const h1 = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0',
  padding: '0',
};

const content = {
  padding: '0 40px',
};

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  marginTop: '16px',
};

const statsBox = {
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  padding: '24px',
  marginTop: '24px',
  marginBottom: '24px',
};

const statCell = {
  textAlign: 'center' as const,
  padding: '0 16px',
};

const statNumber = {
  fontSize: '32px',
  fontWeight: 'bold',
  color: '#667eea',
  marginBottom: '8px',
};

const statLabel = {
  fontSize: '14px',
  color: '#6b7280',
  textTransform: 'uppercase' as const,
};

const highlightBox = {
  backgroundColor: '#fef3c7',
  borderLeft: '4px solid #f59e0b',
  padding: '16px',
  borderRadius: '4px',
  marginTop: '24px',
  marginBottom: '24px',
};

const highlightText = {
  color: '#92400e',
  fontSize: '16px',
  margin: '0',
};

const buttonContainer = {
  textAlign: 'center' as const,
  marginTop: '32px',
  marginBottom: '32px',
};

const button = {
  backgroundColor: '#667eea',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 32px',
};

const hr = {
  borderColor: '#e5e7eb',
  margin: '32px 0',
};

const smallText = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '20px',
};

const footer = {
  padding: '0 40px',
  marginTop: '32px',
};

const footerText = {
  color: '#9ca3af',
  fontSize: '12px',
  lineHeight: '16px',
  textAlign: 'center' as const,
  marginTop: '8px',
};

const link = {
  color: '#667eea',
  textDecoration: 'underline',
};
