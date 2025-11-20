/**
 * Streak Milestone Email Template
 *
 * Sent when user reaches streak milestones (7, 14, 30, 100 days)
 */

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Hr,
} from '@react-email/components';
import * as React from 'react';

interface StreakMilestoneEmailProps {
  username: string;
  currentStreak: number;
  longestStreak: number;
  streakFreezes: number;
  totalXP: number;
}

export const StreakMilestoneEmail = ({
  username = 'CloudDojo User',
  currentStreak = 7,
  longestStreak = 7,
  streakFreezes = 0,
  totalXP = 0,
}: StreakMilestoneEmailProps) => {
  const getStreakMessage = (days: number) => {
    if (days === 7) return "7-Day Streak! You're on fire! 🔥";
    if (days === 14) return "2-Week Streak! Unstoppable! ⚡";
    if (days === 30) return "30-Day Streak! Legend status! 🌟";
    if (days === 100) return "100-DAY STREAK! You're a PHENOMENON! 🏆";
    return `${days}-Day Streak! Amazing! 💪`;
  };

  const getMotivationalQuote = (days: number) => {
    if (days === 7) return "Consistency is the key to mastery. You're proving it!";
    if (days === 14) return "Your dedication is inspiring. Keep this incredible momentum!";
    if (days === 30) return "30 days of commitment. You're in the top 5% of learners!";
    if (days === 100) return "100 days of relentless learning. You're unstoppable!";
    return "Every day you show up, you're building your future!";
  };

  const getReward = (days: number) => {
    if (days === 7) return "50 bonus XP";
    if (days === 14) return "100 bonus XP + 1 streak freeze";
    if (days === 30) return "300 bonus XP + 2 streak freezes";
    if (days === 100) return "1000 bonus XP + 5 streak freezes + Special Badge";
    return "Bonus XP";
  };

  return (
    <Html>
      <Head />
      <Preview>{getStreakMessage(currentStreak)}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <div style={fireContainer}>
              <span style={fireEmoji}>🔥</span>
            </div>
            <Heading style={h1}>{getStreakMessage(currentStreak)}</Heading>
            <Text style={subtitle}>{getMotivationalQuote(currentStreak)}</Text>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Text style={text}>Hey {username}! 👋</Text>

            <Text style={text}>
              You've just hit an incredible milestone! {currentStreak} consecutive days of learning.
              That's commitment, dedication, and pure determination!
            </Text>

            {/* Streak Stats */}
            <Section style={streakBox}>
              <table style={{ width: '100%' }}>
                <tr>
                  <td style={streakStatCell}>
                    <div style={streakNumber}>{currentStreak}</div>
                    <div style={streakLabel}>Current Streak</div>
                  </td>
                  <td style={streakStatCell}>
                    <div style={streakNumber}>{longestStreak}</div>
                    <div style={streakLabel}>Longest Streak</div>
                  </td>
                  <td style={streakStatCell}>
                    <div style={streakNumber}>{streakFreezes}</div>
                    <div style={streakLabel}>Streak Freezes</div>
                  </td>
                </tr>
              </table>
            </Section>

            {/* Reward Box */}
            <Section style={rewardBox}>
              <Text style={rewardTitle}>🎁 Streak Reward Unlocked!</Text>
              <Text style={rewardText}>{getReward(currentStreak)}</Text>
            </Section>

            {/* XP Progress */}
            <Section style={xpBox}>
              <div style={xpHeader}>
                <span style={xpLabel}>Total XP Earned</span>
                <span style={xpValue}>{totalXP.toLocaleString()} XP</span>
              </div>
              <div style={xpBar}>
                <div style={xpProgress}></div>
              </div>
            </Section>

            <Text style={text}>
              Don't break the streak! Come back tomorrow to keep your momentum going and unlock
              even more rewards.
            </Text>

            {/* CTA Button */}
            <Section style={buttonContainer}>
              <Button style={button} href="https://clouddojo.tech/dashboard">
                Continue Your Streak
              </Button>
            </Section>

            <Hr style={hr} />

            {/* Streak Tips */}
            <Section style={tipsBox}>
              <Text style={tipsTitle}>💡 Streak Tips</Text>
              <ul style={tipsList}>
                <li style={tipItem}>Set a daily reminder to practice</li>
                <li style={tipItem}>Even 5 minutes a day counts!</li>
                <li style={tipItem}>Use streak freezes wisely for busy days</li>
                <li style={tipItem}>Compete with friends to stay motivated</li>
              </ul>
            </Section>

            {/* Social Proof */}
            <Text style={smallText}>
              📊 <strong>Fun fact:</strong> Users with 30+ day streaks are 5x more likely to pass
              their certification exams!
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              CloudDojo - Building habits, building futures
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

export default StreakMilestoneEmail;

// Styles
const main = {
  backgroundColor: '#fef3c7',
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
  padding: '48px 40px 32px',
  textAlign: 'center' as const,
  background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
};

const fireContainer = {
  marginBottom: '16px',
};

const fireEmoji = {
  fontSize: '64px',
  display: 'inline-block',
  animation: 'flicker 1.5s infinite',
};

const h1 = {
  color: '#ffffff',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '0',
  padding: '0',
  marginBottom: '8px',
};

const subtitle = {
  color: '#fef3c7',
  fontSize: '16px',
  margin: '0',
  fontStyle: 'italic' as const,
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

const streakBox = {
  backgroundColor: '#fffbeb',
  borderRadius: '12px',
  padding: '24px',
  marginTop: '24px',
  marginBottom: '24px',
  border: '2px solid #fbbf24',
};

const streakStatCell = {
  textAlign: 'center' as const,
  padding: '0 16px',
};

const streakNumber = {
  fontSize: '36px',
  fontWeight: 'bold',
  color: '#f59e0b',
  marginBottom: '8px',
};

const streakLabel = {
  fontSize: '13px',
  color: '#78350f',
  textTransform: 'uppercase' as const,
  fontWeight: '600',
};

const rewardBox = {
  backgroundColor: '#dcfce7',
  borderRadius: '8px',
  padding: '24px',
  marginTop: '24px',
  marginBottom: '24px',
  textAlign: 'center' as const,
  border: '2px dashed #22c55e',
};

const rewardTitle = {
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#166534',
  margin: '0 0 12px 0',
};

const rewardText = {
  fontSize: '18px',
  color: '#15803d',
  margin: '0',
  fontWeight: '600',
};

const xpBox = {
  marginTop: '24px',
  marginBottom: '24px',
};

const xpHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '8px',
};

const xpLabel = {
  fontSize: '14px',
  color: '#6b7280',
  fontWeight: '600',
};

const xpValue = {
  fontSize: '14px',
  color: '#f59e0b',
  fontWeight: 'bold',
};

const xpBar = {
  height: '8px',
  backgroundColor: '#f3f4f6',
  borderRadius: '4px',
  overflow: 'hidden',
};

const xpProgress = {
  height: '100%',
  width: '75%',
  background: 'linear-gradient(90deg, #f59e0b 0%, #ef4444 100%)',
  borderRadius: '4px',
};

const buttonContainer = {
  textAlign: 'center' as const,
  marginTop: '32px',
  marginBottom: '32px',
};

const button = {
  backgroundColor: '#f59e0b',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 36px',
};

const hr = {
  borderColor: '#e5e7eb',
  margin: '32px 0',
};

const tipsBox = {
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  padding: '20px 24px',
  marginTop: '24px',
  marginBottom: '24px',
};

const tipsTitle = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#111827',
  margin: '0 0 12px 0',
};

const tipsList = {
  margin: '0',
  paddingLeft: '20px',
  color: '#4b5563',
};

const tipItem = {
  fontSize: '14px',
  lineHeight: '24px',
  marginBottom: '6px',
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
  color: '#f59e0b',
  textDecoration: 'underline',
};
