/**
 * Level Up Email Template
 *
 * Sent when user reaches a new XP level
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

interface LevelUpEmailProps {
  username: string;
  newLevel: number;
  totalXP: number;
  xpToNextLevel: number;
  unlockedFeatures?: string[];
}

export const LevelUpEmail = ({
  username = 'CloudDojo User',
  newLevel = 5,
  totalXP = 500,
  xpToNextLevel = 600,
  unlockedFeatures = [],
}: LevelUpEmailProps) => {
  const getLevelMessage = (level: number) => {
    if (level === 5) return "Level 5! You're climbing fast! ⚡";
    if (level === 10) return "Level 10! Double digits! 🎯";
    if (level === 25) return "Level 25! You're a pro! 🌟";
    if (level === 50) return "Level 50! Elite status! 👑";
    if (level === 100) return "Level 100! LEGENDARY! 🏆";
    return `Level ${level} Achieved! 🎊`;
  };

  const hasFeatures = unlockedFeatures && unlockedFeatures.length > 0;

  return (
    <Html>
      <Head />
      <Preview>{getLevelMessage(newLevel)}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <div style={levelBadge}>
              <div style={levelNumber}>{newLevel}</div>
            </div>
            <Heading style={h1}>Level Up!</Heading>
            <Text style={subtitle}>You've reached Level {newLevel}</Text>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Text style={text}>Congratulations, {username}! 🎉</Text>

            <Text style={text}>
              Your dedication to learning is paying off! You've just leveled up and you're getting
              closer to cloud certification mastery every day.
            </Text>

            {/* Level Progress */}
            <Section style={progressBox}>
              <div style={progressHeader}>
                <div>
                  <div style={currentLevel}>Level {newLevel}</div>
                  <div style={levelLabel}>Current Level</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={xpCount}>{totalXP.toLocaleString()}</div>
                  <div style={xpLabel}>Total XP</div>
                </div>
              </div>

              <div style={progressBarContainer}>
                <div style={progressBar}>
                  <div style={progressFill}></div>
                </div>
                <div style={progressText}>
                  {xpToNextLevel - totalXP} XP to Level {newLevel + 1}
                </div>
              </div>
            </Section>

            {/* Unlocked Features */}
            {hasFeatures && (
              <Section style={featuresBox}>
                <Text style={featuresTitle}>🎁 New Features Unlocked!</Text>
                <ul style={featuresList}>
                  {unlockedFeatures.map((feature, index) => (
                    <li key={index} style={featureItem}>
                      ✅ {feature}
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {/* Achievement Stats */}
            <Section style={statsGrid}>
              <table style={{ width: '100%' }}>
                <tr>
                  <td style={statBox}>
                    <div style={statIcon}>🏆</div>
                    <div style={statValue}>{Math.floor(newLevel / 5)}</div>
                    <div style={statName}>Milestones</div>
                  </td>
                  <td style={statBox}>
                    <div style={statIcon}>⚡</div>
                    <div style={statValue}>{newLevel * 20}</div>
                    <div style={statName}>Avg XP/Day</div>
                  </td>
                  <td style={statBox}>
                    <div style={statIcon}>📈</div>
                    <div style={statValue}>Top {Math.max(100 - newLevel * 2, 1)}%</div>
                    <div style={statName}>Ranking</div>
                  </td>
                </tr>
              </table>
            </Section>

            <Text style={text}>
              Keep up the fantastic work! Every quiz, every practice session, every day of learning
              brings you closer to your certification goals.
            </Text>

            {/* CTA Buttons */}
            <Section style={buttonContainer}>
              <Button style={primaryButton} href="https://clouddojo.tech/dashboard">
                View Dashboard
              </Button>
            </Section>

            <Section style={buttonContainer}>
              <Button style={secondaryButton} href="https://clouddojo.tech/dashboard/leaderboard">
                Check Leaderboard
              </Button>
            </Section>

            <Hr style={hr} />

            {/* Next Level Preview */}
            <Section style={nextLevelBox}>
              <Text style={nextLevelTitle}>🎯 Next Milestone</Text>
              <Text style={nextLevelText}>
                Reach Level {newLevel + 5} to unlock exclusive content and advanced features!
              </Text>
            </Section>

            {/* Social Proof */}
            <Text style={smallText}>
              💪 <strong>Keep climbing!</strong> You're in the top {Math.max(100 - newLevel * 2, 1)}%
              of CloudDojo learners!
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              CloudDojo - Level up your cloud skills
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

export default LevelUpEmail;

// Styles
const main = {
  backgroundColor: '#1e1b4b',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#0f172a',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
  borderRadius: '8px',
};

const header = {
  padding: '48px 40px 32px',
  textAlign: 'center' as const,
  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
};

const levelBadge = {
  width: '100px',
  height: '100px',
  borderRadius: '50%',
  backgroundColor: '#ffffff',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '16px',
  border: '4px solid #fbbf24',
};

const levelNumber = {
  fontSize: '48px',
  fontWeight: 'bold',
  color: '#6366f1',
};

const h1 = {
  color: '#ffffff',
  fontSize: '36px',
  fontWeight: 'bold',
  margin: '0',
  padding: '0',
  marginBottom: '8px',
};

const subtitle = {
  color: '#e0e7ff',
  fontSize: '18px',
  margin: '0',
};

const content = {
  padding: '0 40px',
};

const text = {
  color: '#e2e8f0',
  fontSize: '16px',
  lineHeight: '24px',
  marginTop: '16px',
};

const progressBox = {
  backgroundColor: '#1e293b',
  borderRadius: '12px',
  padding: '24px',
  marginTop: '24px',
  marginBottom: '24px',
  border: '2px solid #334155',
};

const progressHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '20px',
};

const currentLevel = {
  fontSize: '32px',
  fontWeight: 'bold',
  color: '#6366f1',
};

const levelLabel = {
  fontSize: '12px',
  color: '#94a3b8',
  textTransform: 'uppercase' as const,
  marginTop: '4px',
};

const xpCount = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#fbbf24',
};

const xpLabel = {
  fontSize: '12px',
  color: '#94a3b8',
  textTransform: 'uppercase' as const,
  marginTop: '4px',
};

const progressBarContainer = {
  marginTop: '16px',
};

const progressBar = {
  height: '12px',
  backgroundColor: '#334155',
  borderRadius: '6px',
  overflow: 'hidden',
  marginBottom: '8px',
};

const progressFill = {
  height: '100%',
  width: '65%',
  background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
  borderRadius: '6px',
};

const progressText = {
  fontSize: '13px',
  color: '#cbd5e1',
  textAlign: 'center' as const,
};

const featuresBox = {
  backgroundColor: '#059669',
  borderRadius: '8px',
  padding: '24px',
  marginTop: '24px',
  marginBottom: '24px',
};

const featuresTitle = {
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#ffffff',
  margin: '0 0 16px 0',
};

const featuresList = {
  margin: '0',
  paddingLeft: '0',
  listStyle: 'none',
};

const featureItem = {
  fontSize: '16px',
  color: '#d1fae5',
  marginBottom: '8px',
  lineHeight: '24px',
};

const statsGrid = {
  marginTop: '24px',
  marginBottom: '24px',
};

const statBox = {
  textAlign: 'center' as const,
  padding: '16px',
  backgroundColor: '#1e293b',
  borderRadius: '8px',
};

const statIcon = {
  fontSize: '32px',
  marginBottom: '8px',
};

const statValue = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#6366f1',
  marginBottom: '4px',
};

const statName = {
  fontSize: '12px',
  color: '#94a3b8',
  textTransform: 'uppercase' as const,
};

const buttonContainer = {
  textAlign: 'center' as const,
  marginTop: '16px',
};

const primaryButton = {
  backgroundColor: '#6366f1',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 36px',
  width: '100%',
  maxWidth: '300px',
};

const secondaryButton = {
  backgroundColor: 'transparent',
  border: '2px solid #6366f1',
  borderRadius: '6px',
  color: '#6366f1',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 36px',
  width: '100%',
  maxWidth: '300px',
};

const hr = {
  borderColor: '#334155',
  margin: '32px 0',
};

const nextLevelBox = {
  backgroundColor: '#312e81',
  borderRadius: '8px',
  padding: '20px',
  textAlign: 'center' as const,
  marginTop: '24px',
  marginBottom: '24px',
};

const nextLevelTitle = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#ffffff',
  margin: '0 0 8px 0',
};

const nextLevelText = {
  fontSize: '15px',
  color: '#c7d2fe',
  margin: '0',
};

const smallText = {
  color: '#94a3b8',
  fontSize: '14px',
  lineHeight: '20px',
};

const footer = {
  padding: '0 40px',
  marginTop: '32px',
};

const footerText = {
  color: '#64748b',
  fontSize: '12px',
  lineHeight: '16px',
  textAlign: 'center' as const,
  marginTop: '8px',
};

const link = {
  color: '#6366f1',
  textDecoration: 'underline',
};
