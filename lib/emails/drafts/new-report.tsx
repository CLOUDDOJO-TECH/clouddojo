import React from 'react';
import {
  Container,
  Row,
  Column,
  Head,
  Body,
  Text,
  Button,
  Img,
  Link,
  Html,
  Heading,
  Hr,
  Section,
  Preview,
  Font,
} from '@react-email/components';
import { FaBrain, FaBullseye, FaChartLine } from 'react-icons/fa6';

// --- Color Palette ---
const colors = {
  pageBackground: '#202832',
  containerBackground: '#14181e',
  accent: '#66ffcc',
  text: '#d0e0f0',
  lightText: '#a0b0c0',
  buttonText: '#14181e',
  border: 'rgba(102, 255, 204, 0.2)',
  divider: 'rgba(102, 255, 204, 0.1)',
  footerLink: '#66ffcc'
};

// --- Fonts ---
const fonts = {
  heading: 'Inter, sans-serif',
  body: 'Inter, sans-serif'
};

// --- URLs ---
const urls = {
  logo: 'https://www.clouddojo.tech/images/dojo-logo.png',
  website: 'https://www.clouddojo.tech/',
  report: '|_REPORT_URL_|',
  dashboard: 'https://www.clouddojo.tech/dashboard',
  terms: 'https://www.clouddojo.tech/terms',
  support: 'https://www.clouddojo.tech/support',
  blog: 'https://www.clouddojo.tech/blog',
  contact: 'https://calendar.notion.so/meet/glenmiracle/7fnt4l09',
  unsubscribe: '|_UNSUBSCRIBE_URL_|',
  whatsapp: "https://chat.whatsapp.com/Eta3HH4UbtV3CEAp4eOY0a",
};

const companyName = 'CloudDojo';
const currentYear = new Date().getFullYear();

// --- Content ---
const content = {
  en: {
    title: "Your Personalized AWS Certification Report is Ready!",
    previewText: "Your AI-powered AWS certification analysis is now available - discover your strengths and focus areas",
    greeting: "Hi {firstName},",
    intro: "Your latest AWS certification readiness report has been generated with new insights to guide your study plan.",
    reportExplanation: "Our AI analyzed your recent practice tests to identify:",
    insightsHeading: "Key Findings From Your Analysis",
    viewReportButton: "View Full Report",
    ctaHeading: "Optimize Your Study Strategy",
    ctaText: "Access your personalized dashboard to track progress and focus on the most impactful areas",
    ctaButton: "Go to Dashboard",
    footer: {
      support: "Support",
      blog: "Blog",
      contact: "Schedule Call",
      copyright: `© ${currentYear} ${companyName}. All rights reserved.`,
      disclaimer: `You're receiving this email because you're a registered ${companyName} user.`,
      unsubscribe: "Unsubscribe"
    }
  }
};

const reportInsights = [
  {
    icon: <FaBrain size={24} color={colors.accent} />,
    title: 'AI-Powered Insights',
    description: 'Personalized analysis of your performance patterns and knowledge gaps',
  },
  {
    icon: <FaChartLine size={24} color={colors.accent} />,
    title: 'Progress Tracking',
    description: 'See how your scores improve across different AWS service categories',
  },
  {
    icon: <FaBullseye size={24} color={colors.accent} />,
    title: 'Targeted Recommendations',
    description: 'Specific study focus areas to maximize your certification chances',
  },
];

// --- Styles ---
const styles = {
  main: {
    backgroundColor: colors.pageBackground,
    fontFamily: fonts.body,
  },
  container: {
    backgroundColor: colors.containerBackground,
    maxWidth: '600px',
    margin: '40px auto',
    border: `1px solid ${colors.border}`,
    borderRadius: '8px',
  },
  section: {
    padding: '30px',
  },
  header: {
    padding: '24px 30px 16px',
  },
  logo: {
    display: 'block',
    margin: '0 auto',
    width: '120px'
  },
  heading1: {
    color: colors.text,
    fontSize: '26px',
    fontWeight: 'bold',
    lineHeight: '34px',
    margin: '0 0 20px 0',
    fontFamily: fonts.heading,
  },
  heading2: {
    color: colors.text,
    fontSize: '22px',
    fontWeight: 'bold',
    lineHeight: '30px',
    margin: '0 0 16px 0',
    fontFamily: fonts.heading,
  },
  heading3: {
    color: colors.text,
    fontSize: '18px',
    fontWeight: '600',
    lineHeight: '24px',
    margin: '0 0 8px 0',
    fontFamily: fonts.heading,
  },
  paragraph: {
    color: colors.text,
    fontSize: '16px',
    lineHeight: '24px',
    margin: '0 0 20px 0',
  },
  lightText: {
    color: colors.lightText,
    fontSize: '14px',
    lineHeight: '20px',
    margin: '0 0 12px 0',
  },
  button: {
    backgroundColor: colors.accent,
    color: colors.buttonText,
    fontSize: '16px',
    fontWeight: 'bold',
    padding: '12px 24px',
    borderRadius: '8px',
    display: 'inline-block',
    textDecoration: 'none'
  },
  insightCard: {
    border: `1px solid ${colors.border}`,
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '16px',
  },
  ctaSection: {
    backgroundColor: colors.pageBackground,
    padding: '40px 30px',
    textAlign: 'center' as const,
  },
  divider: {
    borderColor: colors.divider,
    margin: '32px 0',
  },
  footer: {
    padding: '24px 30px',
    backgroundColor: colors.containerBackground,
  },
  footerLink: {
    color: colors.footerLink,
    fontSize: '12px',
    textDecoration: 'underline',
    margin: '0 5px',
  },
  footerText: {
    color: colors.lightText,
    fontSize: '12px',
    lineHeight: '18px',
    textAlign: 'center' as const,
    margin: '0 0 8px 0',
  }
};
interface AnalysisNotificationEmailProps {
  username: string;
  userImage?: string;
  certificationName?: string;
  readinessScore?: number;
  language?: string | 'en';
}

// --- Email Component ---
export default function CloudDojoAiReportEmail({ username, language, certificationName, readinessScore,}: AnalysisNotificationEmailProps) {
  const langContent = content[language as keyof typeof content];
  
  return (
    <Html lang={language}>
      <Head>
        <title>{langContent.title}</title>
        <Font
          fontFamily="Inter"
          fallbackFontFamily="sans-serif"
          webFont={{
            url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap',
            format: 'woff2',
          }}
        />
        <style>{`
          @media only screen and (max-width: 600px) {
            .section-padding {
              padding-left: 20px !important;
              padding-right: 20px !important;
            }
            .mobile-stack {
              display: block !important;
              width: 100% !important;
            }
            .mobile-center {
              text-align: center !important;
            }
            .mobile-button {
              display: block !important;
              width: 100% !important;
              max-width: 300px !important;
              margin: 10px auto !important;
            }
          }
        `}</style>
      </Head>
      <Preview>{langContent.previewText}</Preview>
      <Body style={styles.main}>
        <Container style={styles.container}>
          {/* Header */}
          <Section style={styles.header}>
            <Row>
              <Column align="center">
                <Link href={urls.website}>
                  <Img
                    src={urls.logo}
                    alt={`${companyName} Logo`}
                    style={styles.logo}
                  />
                </Link>
              </Column>
            </Row>
          </Section>

          {/* Main Content */}
          <Section style={styles.section} className="section-padding">
            <Heading as="h1" style={styles.heading1}>{langContent.title}</Heading>
            
            <Text style={styles.paragraph}>
              {langContent.greeting.replace('{firstName}', username)}
            </Text>
            
            <Text style={styles.paragraph}>
              {langContent.intro}
            </Text>
            
            <Text style={styles.lightText}>
              {langContent.reportExplanation}
            </Text>

            {/* Insights */}
            <Heading as="h2" style={{ ...styles.heading2, textAlign: 'left' }}>
              {langContent.insightsHeading}
            </Heading>
            
            {reportInsights.map((insight, index) => (
              <Section key={index} style={styles.insightCard}>
                <Row>
                  <Column style={{ width: '40px', verticalAlign: 'top', paddingRight: '16px' }}>
                    {insight.icon}
                  </Column>
                  <Column>
                    <Heading as="h3" style={styles.heading3}>{insight.title}</Heading>
                    <Text style={styles.lightText}>{insight.description}</Text>
                  </Column>
                </Row>
              </Section>
            ))}

            {/* Primary CTA */}
            <Row style={{ marginTop: '32px' }}>
              <Column align="center">
                <Button href={urls.report} style={styles.button} className="mobile-button">
                  {langContent.viewReportButton}
                </Button>
              </Column>
            </Row>
          </Section>

          {/* CTA Section */}
          <Section style={styles.ctaSection}>
            <Heading as="h2" style={styles.heading2}>{langContent.ctaHeading}</Heading>
            <Text style={{ ...styles.paragraph, textAlign: 'center' }}>
              {langContent.ctaText}
            </Text>
            <Button href={urls.dashboard} style={styles.button} className="mobile-button">
              {langContent.ctaButton}
            </Button>
            <Button href={urls.whatsapp} style={styles.button} className="mobile-button">
              {langContent.ctaButton}
            </Button>
          </Section>

          <Hr style={styles.divider} />

          {/* Footer */}
          <Section style={styles.footer} className="section-padding">
            <Row>
              <Column align="center">
                <Link href={urls.support} style={styles.footerLink}>
                  {langContent.footer.support}
                </Link>
                <span style={{ ...styles.footerText, display: 'inline-block', margin: '0 8px' }}>|</span>
                <Link href={urls.blog} style={styles.footerLink}>
                  {langContent.footer.blog}
                </Link>
                <span style={{ ...styles.footerText, display: 'inline-block', margin: '0 8px' }}>|</span>
                <Link href={urls.contact} style={styles.footerLink}>
                  {langContent.footer.contact}
                </Link>
              </Column>
            </Row>
            
            <Row style={{ marginTop: '16px' }}>
              <Column align="center">
                <Text style={styles.footerText}>
                  {langContent.footer.copyright}
                </Text>
                <Text style={styles.footerText}>
                  {langContent.footer.disclaimer}
                </Text>
                <Link href={urls.unsubscribe} style={styles.footerLink}>
                  {langContent.footer.unsubscribe}
                </Link>
              </Column>
            </Row>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}