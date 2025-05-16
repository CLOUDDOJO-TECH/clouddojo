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
import { FaBrain, FaUserCheck, FaRocket, FaAward } from 'react-icons/fa6';

// --- Design Tokens ---
const colors = {
  background: '#202832',
  container: '#14181e',
  accent: '#66ffcc',
  text: '#d0e0f0',
  secondaryText: '#a0b0c0',
  buttonText: '#14181e',
  border: 'rgba(102, 255, 204, 0.2)',
  divider: 'rgba(102, 255, 204, 0.1)'
};

const fonts = {
  heading: 'Inter, sans-serif',
  body: 'Inter, sans-serif'
};

const spacing = {
  section: '32px',
  card: '20px',
  button: '12px 24px'
};

// --- Content ---
const company = {
  name: 'CloudDojo',
  logo: 'https://www.clouddojo.tech/images/dojo-logo.png',
  website: 'https://www.clouddojo.tech/',
  year: new Date().getFullYear()
};

const content = {
  title: "Welcome to CloudDojo - No More Guessing!",
  preview: "Start your AWS certification journey with personalized practice tests and AI-powered insights",
  greeting: `Hi {firstName},`,
  welcome: `We're thrilled to have you join ${company.name}! You've taken the first step toward acing your Cloud certification exams.`,
  valueProp: "CloudDojo helps you study smarter with:",
  cta: {
    primary: {
      text: "Take Your First Practice Test",
      url: "https://www.clouddojo.tech/practice"
    },
    secondary: {
      text: "Join Whatsapp Community",
      url: "https://chat.whatsapp.com/Eta3HH4UbtV3CEAp4eOY0a"
    }
  },
  footer: {
    links: [
      { text: "Support", url: "https://www.clouddojo.tech/support" },
      { text: "Blog", url: "https://www.clouddojo.tech/blog" },
      { text: "Contact", url: "https://calendar.notion.so/meet/glenmiracle/7fnt4l09" }
    ],
    legal: `You're receiving this email because you signed up for ${company.name}.`,
    copyright: `© ${company.year} ${company.name}. All rights reserved.`,
    unsubscribe: "|_UNSUBSCRIBE_URL_|"
  }
};

const features = [
  {
    icon: <FaRocket size={24} color={colors.accent} />,
    title: "Targeted Practice",
    description: "Customized question sets focused on your weak areas"
  },
  {
    icon: <FaBrain size={24} color={colors.accent} />,
    title: "AI Analysis",
    description: "Personalized insights to optimize your study time"
  },
  {
    icon: <FaUserCheck size={24} color={colors.accent} />,
    title: "Progress Tracking",
    description: "Visual dashboard to monitor your improvement"
  },
  {
    icon: <FaAward size={24} color={colors.accent} />,
    title: "Certification Readiness",
    description: "Predicts your exam success probability"
  }
];

// --- Styles ---
const styles = {
  main: {
    backgroundColor: colors.background,
    fontFamily: fonts.body
  },
  container: {
    backgroundColor: colors.container,
    maxWidth: '600px',
    margin: '40px auto',
    borderRadius: '8px',
    border: `1px solid ${colors.border}`
  },
  header: {
    padding: '24px 0',
    textAlign: 'center' as const
  },
  logo: {
    width: '120px',
    height: 'auto'
  },
  heading: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: '26px',
    lineHeight: '1.3',
    marginBottom: '20px'
  },
  subheading: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: '20px',
    margin: '24px 0 16px'
  },
  text: {
    color: colors.text,
    fontSize: '16px',
    lineHeight: '1.5',
    marginBottom: '16px'
  },
  secondaryText: {
    color: colors.secondaryText,
    fontSize: '14px',
    lineHeight: '1.4'
  },
  button: {
    backgroundColor: colors.accent,
    color: colors.buttonText,
    fontWeight: 'bold',
    padding: spacing.button,
    borderRadius: '8px',
    textDecoration: 'none',
    display: 'inline-block'
  },
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
    margin: '24px 0'
  },
  featureCard: {
    border: `1px solid ${colors.border}`,
    borderRadius: '8px',
    padding: spacing.card
  },
  footer: {
    padding: '24px 0',
    textAlign: 'center' as const
  },
  footerLink: {
    color: colors.accent,
    fontSize: '12px',
    textDecoration: 'underline',
    margin: '0 8px'
  },
  footerText: {
    color: colors.secondaryText,
    fontSize: '12px',
    margin: '8px 0'
  }
};

// --- Email Component ---
export default function WelcomeEmail({ username }: { username: string | 'there' }) {
  return (
    <Html>
      <Head>
        <title>{content.title}</title>
        <Font
          fontFamily="Inter"
          fallbackFontFamily="sans-serif"
          webFont={{
            url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap',
            format: 'woff2'
          }}
        />
        <style>{`
          @media only screen and (max-width: 600px) {
            .feature-grid {
              grid-template-columns: 1fr !important;
            }
            .button {
              width: 100% !important;
            }
          }
        `}</style>
      </Head>
      <Preview>{content.preview}</Preview>
      <Body style={styles.main}>
        <Container style={styles.container}>
          {/* Header */}
          <Section style={styles.header}>
            <Link href={company.website}>
              <Img
                src={company.logo}
                alt={`${company.name} Logo`}
                style={styles.logo}
              />
            </Link>
          </Section>

          {/* Main Content */}
          <Section style={{ padding: '0 30px' }}>
            <Heading style={styles.heading}>
              Welcome to CloudDojo!
            </Heading>
            
            <Text style={styles.text}>
              {content.greeting.replace('{firstName}', username)}
            </Text>
            
            <Text style={styles.text}>
              {content.welcome}
            </Text>
            
            <Text style={{ ...styles.text, marginBottom: '24px' }}>
              {content.valueProp}
            </Text>

            {/* Features Grid */}
            <div style={styles.featureGrid} className="feature-grid">
              {features.map((feature, index) => (
                <div key={index} style={styles.featureCard}>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ flexShrink: 0 }}>
                      {feature.icon}
                    </div>
                    <div>
                      <Heading as="h3" style={{ ...styles.subheading, fontSize: '18px', margin: '0 0 8px' }}>
                        {feature.title}
                      </Heading>
                      <Text style={styles.secondaryText}>
                        {feature.description}
                      </Text>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div style={{ margin: '32px 0', textAlign: 'center' }}>
              <Button href={content.cta.primary.url} style={styles.button} className="button">
                {content.cta.primary.text}
              </Button>
              
              <div style={{ marginTop: '16px' }}>
                <Link href={content.cta.secondary.url} style={{ ...styles.secondaryText, textDecoration: 'underline' }}>
                  {content.cta.secondary.text}
                </Link>
              </div>
            </div>
          </Section>

          <Hr style={{ borderColor: colors.divider, margin: '0' }} />

          {/* Footer */}
          <Section style={styles.footer}>
            <div style={{ marginBottom: '16px' }}>
              {content.footer.links.map((link, index) => (
                <React.Fragment key={link.text}>
                  {index > 0 && <span style={{ color: colors.secondaryText }}> | </span>}
                  <Link href={link.url} style={styles.footerLink}>
                    {link.text}
                  </Link>
                </React.Fragment>
              ))}
            </div>
            
            <Text style={styles.footerText}>
              {content.footer.legal}
            </Text>
            
            <Text style={styles.footerText}>
              {content.footer.copyright}
            </Text>
            
            <Text style={styles.footerText}>
              <Link href={content.footer.unsubscribe} style={styles.footerLink}>
                Unsubscribe
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}