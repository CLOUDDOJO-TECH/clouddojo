/**
 * Feature Adoption Email Template
 *
 * Sent when user hasn't used a key feature
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

interface FeatureAdoptionEmailProps {
  username: string;
  featureName: string;
  featureDescription: string;
  featureBenefits: string[];
  featureIcon: string;
  ctaUrl: string;
}

export const FeatureAdoptionEmail = ({
  username = 'CloudDojo User',
  featureName = 'AI Analysis',
  featureDescription = 'Get personalized insights on your quiz performance',
  featureBenefits = ['Identify weak areas', 'Track improvement', 'Get study recommendations'],
  featureIcon = '🤖',
  ctaUrl = 'https://clouddojo.tech/dashboard/analysis',
}: FeatureAdoptionEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Unlock the power of {featureName} - You're missing out!</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <div style={iconContainer}>
              <span style={icon}>{featureIcon}</span>
            </div>
            <Heading style={h1}>You Haven't Tried This Yet!</Heading>
            <Text style={subtitle}>{featureName}</Text>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Text style={text}>Hey {username}! 👋</Text>

            <Text style={text}>
              We noticed you haven't explored our <strong>{featureName}</strong> feature yet.
              You're missing out on something that could seriously boost your learning!
            </Text>

            {/* Feature Spotlight */}
            <Section style={spotlightBox}>
              <div style={featureHeader}>
                <span style={featureIconLarge}>{featureIcon}</span>
                <span style={featureTitle}>{featureName}</span>
              </div>
              <Text style={featureDesc}>{featureDescription}</Text>
            </Section>

            {/* Benefits List */}
            <Section style={benefitsSection}>
              <Text style={benefitsTitle}>What you'll get:</Text>
              <table style={{ width: '100%' }}>
                {featureBenefits.map((benefit, index) => (
                  <tr key={index}>
                    <td style={benefitRow}>
                      <span style={checkmark}>✓</span>
                      <span style={benefitText}>{benefit}</span>
                    </td>
                  </tr>
                ))}
              </table>
            </Section>

            {/* Success Story */}
            <Section style={testimonialBox}>
              <Text style={testimonialText}>
                "This feature helped me identify my weak areas and improve my score by 25%!"
              </Text>
              <Text style={testimonialAuthor}>— Sarah K., AWS Certified Solutions Architect</Text>
            </Section>

            <Text style={text}>
              It only takes 2 minutes to try it out. Ready to level up your learning?
            </Text>

            {/* CTA Button */}
            <Section style={buttonContainer}>
              <Button style={button} href={ctaUrl}>
                Try {featureName} Now
              </Button>
            </Section>

            <Hr style={hr} />

            {/* Quick Start Guide */}
            <Section style={guideBox}>
              <Text style={guideTitle}>🚀 Quick Start Guide</Text>
              <ol style={guideList}>
                <li style={guideStep}>Click the button above</li>
                <li style={guideStep}>Complete a quick setup (30 seconds)</li>
                <li style={guideStep}>See immediate results</li>
              </ol>
            </Section>

            {/* Social Proof */}
            <Text style={smallText}>
              ⭐ <strong>Over 10,000 users</strong> are already using {featureName} to accelerate
              their learning!
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              CloudDojo - Unlock your full potential
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

export default FeatureAdoptionEmail;

// Styles
const main = {
  backgroundColor: '#f3f4f6',
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
  padding: '40px 40px 32px',
  textAlign: 'center' as const,
  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
};

const iconContainer = {
  marginBottom: '16px',
};

const icon = {
  fontSize: '64px',
  display: 'inline-block',
};

const h1 = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0',
  padding: '0',
  marginBottom: '8px',
};

const subtitle = {
  color: '#d1fae5',
  fontSize: '20px',
  margin: '0',
  fontWeight: '600',
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

const spotlightBox = {
  backgroundColor: '#ecfdf5',
  borderRadius: '12px',
  padding: '24px',
  marginTop: '24px',
  marginBottom: '24px',
  border: '2px solid #10b981',
};

const featureHeader = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: '12px',
};

const featureIconLarge = {
  fontSize: '40px',
  marginRight: '12px',
};

const featureTitle = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#065f46',
};

const featureDesc = {
  fontSize: '16px',
  color: '#047857',
  margin: '0',
  lineHeight: '24px',
};

const benefitsSection = {
  marginTop: '24px',
  marginBottom: '24px',
};

const benefitsTitle = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#111827',
  marginBottom: '16px',
};

const benefitRow = {
  padding: '8px 0',
};

const checkmark = {
  display: 'inline-block',
  width: '24px',
  height: '24px',
  backgroundColor: '#10b981',
  color: '#ffffff',
  borderRadius: '50%',
  textAlign: 'center',
  lineHeight: '24px',
  fontSize: '14px',
  fontWeight: 'bold',
  marginRight: '12px',
};

const benefitText = {
  fontSize: '16px',
  color: '#374151',
  lineHeight: '24px',
};

const testimonialBox = {
  backgroundColor: '#fffbeb',
  borderLeft: '4px solid #f59e0b',
  padding: '20px',
  borderRadius: '4px',
  marginTop: '24px',
  marginBottom: '24px',
};

const testimonialText = {
  fontSize: '16px',
  color: '#78350f',
  fontStyle: 'italic' as const,
  margin: '0 0 8px 0',
  lineHeight: '24px',
};

const testimonialAuthor = {
  fontSize: '14px',
  color: '#92400e',
  margin: '0',
  fontWeight: '600',
};

const buttonContainer = {
  textAlign: 'center' as const,
  marginTop: '32px',
  marginBottom: '32px',
};

const button = {
  backgroundColor: '#10b981',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '18px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 40px',
};

const hr = {
  borderColor: '#e5e7eb',
  margin: '32px 0',
};

const guideBox = {
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  padding: '20px 24px',
  marginTop: '24px',
  marginBottom: '24px',
};

const guideTitle = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#111827',
  margin: '0 0 12px 0',
};

const guideList = {
  margin: '0',
  paddingLeft: '20px',
  color: '#4b5563',
};

const guideStep = {
  fontSize: '15px',
  lineHeight: '28px',
  marginBottom: '4px',
};

const smallText = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '20px',
  textAlign: 'center' as const,
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
  color: '#10b981',
  textDecoration: 'underline',
};
