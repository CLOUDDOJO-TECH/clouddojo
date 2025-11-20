/**
 * Badge Unlocked Email Template
 *
 * Sent when user earns a new badge
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

interface BadgeUnlockedEmailProps {
  username: string;
  badgeName: string;
  badgeDescription: string;
  badgeIcon: string;
  badgeTier: string; // bronze, silver, gold, platinum
  totalBadges: number;
  nextBadge?: string;
}

export const BadgeUnlockedEmail = ({
  username = 'CloudDojo User',
  badgeName = 'Quiz Master',
  badgeDescription = 'Complete 10 quizzes with 80%+ score',
  badgeIcon = '🏆',
  badgeTier = 'gold',
  totalBadges = 1,
  nextBadge,
}: BadgeUnlockedEmailProps) => {
  const getTierColor = (tier: string) => {
    const colors = {
      bronze: '#cd7f32',
      silver: '#c0c0c0',
      gold: '#ffd700',
      platinum: '#e5e4e2',
    };
    return colors[tier as keyof typeof colors] || colors.gold;
  };

  const getTierGradient = (tier: string) => {
    const gradients = {
      bronze: 'linear-gradient(135deg, #cd7f32 0%, #b87333 100%)',
      silver: 'linear-gradient(135deg, #c0c0c0 0%, #a8a8a8 100%)',
      gold: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
      platinum: 'linear-gradient(135deg, #e5e4e2 0%, #d4d4d4 100%)',
    };
    return gradients[tier as keyof typeof gradients] || gradients.gold;
  };

  return (
    <Html>
      <Head />
      <Preview>🎉 You unlocked the {badgeName} badge!</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header with Badge Animation */}
          <Section style={{
            ...header,
            background: getTierGradient(badgeTier),
          }}>
            <div style={badgeContainer}>
              <div style={badgeIcon}>{badgeIcon}</div>
            </div>
            <Heading style={h1}>Badge Unlocked!</Heading>
            <Text style={badgeNameText}>{badgeName}</Text>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Text style={text}>Congratulations, {username}! 🎊</Text>

            <Text style={text}>
              You've just unlocked a new badge! Your dedication and hard work are paying off.
            </Text>

            {/* Badge Details */}
            <Section style={badgeDetailsBox}>
              <table style={{ width: '100%' }}>
                <tr>
                  <td style={{ width: '80px', verticalAlign: 'top' }}>
                    <div style={{ fontSize: '48px', textAlign: 'center' }}>{badgeIcon}</div>
                  </td>
                  <td style={{ verticalAlign: 'top', paddingLeft: '16px' }}>
                    <div style={badgeTitle}>{badgeName}</div>
                    <div style={badgeTierText}>{badgeTier.toUpperCase()} BADGE</div>
                    <div style={badgeDescriptionText}>{badgeDescription}</div>
                  </td>
                </tr>
              </table>
            </Section>

            {/* Progress Stats */}
            <Section style={statsContainer}>
              <div style={statItem}>
                <div style={statNumber}>{totalBadges}</div>
                <div style={statLabel}>Total Badges</div>
              </div>
            </Section>

            {nextBadge && (
              <Section style={nextBadgeBox}>
                <Text style={nextBadgeText}>
                  🎯 <strong>Next challenge:</strong> {nextBadge}
                </Text>
              </Section>
            )}

            <Text style={text}>
              Keep collecting badges to unlock exclusive features and showcase your expertise!
            </Text>

            {/* CTA Buttons */}
            <Section style={buttonRow}>
              <Button style={primaryButton} href="https://clouddojo.tech/dashboard/badges">
                View All Badges
              </Button>
            </Section>

            <Section style={buttonRow}>
              <Button style={secondaryButton} href="https://clouddojo.tech/dashboard">
                Continue Learning
              </Button>
            </Section>

            <Hr style={hr} />

            {/* Share Section */}
            <Section style={shareBox}>
              <Text style={shareText}>
                📢 Share your achievement on social media!
              </Text>
              <div style={{ textAlign: 'center', marginTop: '12px' }}>
                <a href="#" style={socialLink}>Twitter</a>
                <span style={{ margin: '0 8px', color: '#d1d5db' }}>•</span>
                <a href="#" style={socialLink}>LinkedIn</a>
                <span style={{ margin: '0 8px', color: '#d1d5db' }}>•</span>
                <a href="#" style={socialLink}>Facebook</a>
              </div>
            </Section>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              CloudDojo - Gamifying your cloud certification journey
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

export default BadgeUnlockedEmail;

// Styles
const main = {
  backgroundColor: '#0f172a',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#1e293b',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
  borderRadius: '8px',
};

const header = {
  padding: '48px 40px',
  textAlign: 'center' as const,
};

const badgeContainer = {
  marginBottom: '24px',
};

const badgeIcon = {
  fontSize: '80px',
  lineHeight: '1',
  animation: 'bounce 1s infinite',
};

const h1 = {
  color: '#ffffff',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '0',
  padding: '0',
  marginBottom: '8px',
};

const badgeNameText = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: '600',
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

const badgeDetailsBox = {
  backgroundColor: '#334155',
  borderRadius: '12px',
  padding: '24px',
  marginTop: '24px',
  marginBottom: '24px',
  border: '2px solid #475569',
};

const badgeTitle = {
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#ffffff',
  marginBottom: '4px',
};

const badgeTierText = {
  fontSize: '12px',
  fontWeight: '600',
  color: '#fbbf24',
  letterSpacing: '1px',
  marginBottom: '8px',
};

const badgeDescriptionText = {
  fontSize: '14px',
  color: '#cbd5e1',
  lineHeight: '20px',
};

const statsContainer = {
  textAlign: 'center' as const,
  padding: '24px',
  backgroundColor: '#0f172a',
  borderRadius: '8px',
  marginTop: '24px',
  marginBottom: '24px',
};

const statItem = {
  display: 'inline-block',
};

const statNumber = {
  fontSize: '40px',
  fontWeight: 'bold',
  color: '#fbbf24',
  marginBottom: '8px',
};

const statLabel = {
  fontSize: '14px',
  color: '#94a3b8',
  textTransform: 'uppercase' as const,
};

const nextBadgeBox = {
  backgroundColor: '#1e3a8a',
  borderLeft: '4px solid #3b82f6',
  padding: '16px',
  borderRadius: '4px',
  marginTop: '24px',
  marginBottom: '24px',
};

const nextBadgeText = {
  color: '#bfdbfe',
  fontSize: '16px',
  margin: '0',
};

const buttonRow = {
  textAlign: 'center' as const,
  marginTop: '16px',
};

const primaryButton = {
  backgroundColor: '#8b5cf6',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 32px',
  width: '100%',
  maxWidth: '300px',
};

const secondaryButton = {
  backgroundColor: 'transparent',
  border: '2px solid #8b5cf6',
  borderRadius: '6px',
  color: '#8b5cf6',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '10px 32px',
  width: '100%',
  maxWidth: '300px',
};

const hr = {
  borderColor: '#334155',
  margin: '32px 0',
};

const shareBox = {
  textAlign: 'center' as const,
  padding: '24px',
  backgroundColor: '#0f172a',
  borderRadius: '8px',
};

const shareText = {
  color: '#cbd5e1',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0',
};

const socialLink = {
  color: '#8b5cf6',
  textDecoration: 'none',
  fontSize: '14px',
  fontWeight: '600',
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
  color: '#8b5cf6',
  textDecoration: 'underline',
};
