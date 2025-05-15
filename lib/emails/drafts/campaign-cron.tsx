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
} from '@react-email/components';
import { FaBrain, FaChartLine, FaLaptopCode, FaCheckCircle } from 'react-icons/fa'; // Example icons for features

// --- Color Palette ---
const pageBackgroundColor = '#0A192F'; // Dark background
const containerBackgroundColor = '#0A192F'; // Keep container dark for seamless theme
const accentColor = '#00E0B9'; // Bright green accent
const textColor = '#FFFFFF'; // White text for contrast
const lightTextColor = '#B0C4DE'; // Lighter text for secondary info (LightSteelBlue)
const dividerColor = '#555555'; // Divider color from project info
const buttonTextColor = '#0A192F'; // Dark text on bright green button for contrast

// --- Fonts ---
const headingFont = 'Inter, sans-serif';
const bodyFont = 'Inter, sans-serif';

// --- URLs & Content ---
const cloudDojoLogoUrl = "https://cdn.migma.ai/projects/6821f96bc8d7bc6ae950fb77/logos/dojo-logo_logo_nmgpn3.png"; // Secondary logo (better for dark bg)
const cloudDojoWebsiteUrl = "https://www.clouddojo.tech/";
const contactUrl = "https://calendar.notion.so/meet/glenmiracle/7fnt4l09"; // From project info markdown
const signInUrl = "/signin"; // Relative path from sitemap
const supportUrl = "/support"; // Relative path from sitemap
const heroImageUrl = "https://cdn.migma.ai/projects/6821f96bc8d7bc6ae950fb77/images/generated-edd178e34517600fd9f73ffb90bc2424-1747057434264.png"; // Placeholder hero image
const unsubscribeUrl = '|_UNSUBSCRIBE_URL_|';
const companyName = 'CloudDojo';
const copyrightYear = new Date().getFullYear();

// --- Features Data ---
const features = [
  {
    icon: <FaLaptopCode size={32} color={accentColor} />,
    title: 'Real Exam Simulations',
    description: 'Experience targeted practice tests tailored precisely to your AWS certification path.',
  },
  {
    icon: <FaChartLine size={32} color={accentColor} />,
    title: 'Smart Analytics & Dashboard',
    description: 'Instantly identify your weak areas and track your progress with our insightful performance dashboard.',
  },
  {
    icon: <FaBrain size={32} color={accentColor} />,
    title: 'AI-Powered Analysis',
    description: 'Receive personalized feedback from our custom AI, learning from your mistakes to focus your study efforts.',
  },
   {
    icon: <FaCheckCircle size={32} color={accentColor} />,
    title: 'Stop Wasting Time',
    description: 'Move beyond random questions. Our structured approach ensures you know exactly when you\'re ready.',
  },
];

// --- Reusable Padded Section ---
const PaddedSection = ({ children, style, ...props }) => (
  <Section
    style={{
      ...style,
      paddingLeft: '30px',
      paddingRight: '30px',
    }}
    className="content-padding"
    {...props}
  >
    {children}
  </Section>
);

// --- Email Template ---
export default function CloudDojoLaunchEmail({ firstName = 'Cloud Aspirant' }) {
  const previewText = `🚀 CloudDojo is LIVE! Study smarter for your AWS certification with AI-powered practice tests and analytics. Pass faster!`;

  return (
    <Html>
      <Head>
        <title>CloudDojo Launch: Study Smarter, Pass AWS Exams Faster!</title>
         <style>{`
          body {
            background-color: ${pageBackgroundColor};
            margin: 0;
            padding: 0;
            font-family: ${bodyFont};
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          .content-padding { padding-left: 30px; padding-right: 30px; }

          @media only screen and (max-width: 600px) {
            .content-padding { padding-left: 20px !important; padding-right: 20px !important; }
            .mobile-stack {
              display: block !important;
              width: 100% !important;
            }
            .mobile-column {
              display: block !important;
              width: 100% !important;
              max-width: 100% !important;
              padding-right: 0 !important;
              padding-left: 0 !important;
              box-sizing: border-box !important;
              margin-bottom: 24px !important; /* Increased spacing between stacked feature cards */
            }
             .mobile-column:last-child {
                 margin-bottom: 0 !important; /* Remove margin from last stacked item */
             }
             .mobile-column > table {
                width: 100% !important;
             }
             .mobile-column td {
                width: 100% !important;
             }
            .mobile-center { text-align: center !important; }
            .mobile-hide { display: none !important; }
            .mobile-full-width {
              width: 100% !important;
              max-width: 100% !important;
            }
             .mobile-image {
                width: 100% !important;
                height: auto !important;
             }
             .mobile-button {
                display: block !important;
                width: 90% !important; /* Make button slightly less than full width */
                max-width: 300px !important; /* Max width for larger mobile */
                margin: 16px auto !important; /* Center button */
                text-align: center !important;
             }
             .mobile-heading {
                font-size: 28px !important;
                line-height: 36px !important;
             }
             .mobile-subheading {
                 font-size: 22px !important;
                 line-height: 30px !important;
             }
             .feature-card {
                 padding: 20px !important; /* Adjust padding for mobile */
             }
          }
        `}</style>
      </Head>
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* --- Header --- */}
          <PaddedSection style={header}>
            <Row>
              <Column align="center">
                <Link href={cloudDojoWebsiteUrl}>
                  <Img
                    src={cloudDojoLogoUrl}
                    alt="CloudDojo Logo"
                    width="150" // Adjusted size for better visibility
                    height="auto"
                    style={logo}
                  />
                </Link>
              </Column>
            </Row>
          </PaddedSection>

          {/* --- Hero Section --- */}
          <Section style={sectionSpacing}>
            <Row>
              <Column align="center">
                <Img
                  src={heroImageUrl}
                  alt="Abstract image representing cloud technology and learning with green accents on a dark background"
                  width="600"
                  height="auto"
                  style={heroImage}
                  className="mobile-image"
                />
              </Column>
            </Row>
             <PaddedSection style={heroTextContainer}>
              <Column align="center">
                <Heading as="h1" style={h1} className="mobile-heading">
                  Study Smarter. Pass Faster.
                </Heading>
                <Text style={paragraph}>
                  Stop wasting time on random AWS questions. CloudDojo is here to revolutionize your certification prep with targeted practice, smart analytics, and AI-powered feedback.
                </Text>
                <Button href={cloudDojoWebsiteUrl} style={buttonPrimary} className="mobile-button">
                  Start Practicing Now
                </Button>
              </Column>
            </PaddedSection>
          </Section>

          {/* --- Problem/Solution Section --- */}
          <PaddedSection style={sectionSpacing}>
            <Heading as="h2" style={h2} className="mobile-subheading">Tired of Studying Without Strategy?</Heading>
            <Text style={paragraphCentered}>
              Most cloud certification preps offer a sea of questions but no clear path. You study hard, but are you studying <b style={{ color: accentColor }}>effectively</b>? CloudDojo provides the focus and insight you need to know you're truly ready for exam day.
            </Text>
          </PaddedSection>

          <Hr style={hr} />

          {/* --- Features Section --- */}
          <PaddedSection style={sectionSpacing}>
            <Heading as="h2" style={h2} className="mobile-subheading">How CloudDojo Elevates Your Prep</Heading>
            <Text style={paragraphCentered}>
              Leverage cutting-edge tools designed for efficient learning and exam success.
            </Text>

            {/* Desktop: 2 columns / Mobile: Stacking 1 column */}
            {features.reduce((rows, feature, index) => {
              if (index % 2 === 0) rows.push([]);
              rows[rows.length - 1].push(feature);
              return rows;
            }, []).map((row, rowIndex) => (
              <Row key={`feature-row-${rowIndex}`} style={{ marginTop: rowIndex > 0 ? '24px' : '24px' }}>
                {row.map((feature, colIndex) => (
                  <Column
                    key={`feature-${rowIndex}-${colIndex}`}
                    className="mobile-column"
                    style={{
                      width: '50%',
                      paddingRight: colIndex === 0 ? '12px' : '0', // Gutter space
                      paddingLeft: colIndex === 1 ? '12px' : '0', // Gutter space
                      verticalAlign: 'top', // Ensure cards align at the top
                    }}
                  >
                    <Section style={featureCard} className="feature-card">
                      <Row>
                        <Column align="center" style={{ paddingBottom: '16px' }}>
                          {feature.icon}
                        </Column>
                      </Row>
                      <Heading as="h3" style={featureTitle}>{feature.title}</Heading>
                      <Text style={featureDescription}>{feature.description}</Text>
                    </Section>
                  </Column>
                ))}
                {/* Add an empty column if the last row has only one item */}
                {row.length === 1 && <Column style={{ width: '50%', paddingLeft: '12px' }} className="mobile-hide"></Column>}
              </Row>
            ))}
          </PaddedSection>

          <Hr style={hr} />

          {/* --- Final CTA Section --- */}
          <PaddedSection style={ctaSection}>
            <Heading as="h2" style={h2} className="mobile-subheading">Ready to Ace Your AWS Exam?</Heading>
            <Text style={paragraphCentered}>
              Join CloudDojo today and transform your study approach. Gain the confidence and knowledge to pass your certification with flying colors.
            </Text>
            <Button href={cloudDojoWebsiteUrl} style={buttonPrimary} className="mobile-button">
              Explore CloudDojo Features
            </Button>
          </PaddedSection>

          {/* --- Footer --- */}
          <PaddedSection style={footer}>
             <Row style={{ marginBottom: '16px' }}>
              <Column align="center">
                 {/* Using table for better email client compatibility */}
                <table cellPadding="0" cellSpacing="0" border="0" align="center">
                  <tr>
                    <td style={{ padding: '0 8px' }}>
                      <Link href={cloudDojoWebsiteUrl} style={footerLink}>Website</Link>
                    </td>
                    <td style={{ padding: '0 8px' }}>
                      <Link href={supportUrl} style={footerLink}>Support</Link>
                    </td>
                     <td style={{ padding: '0 8px' }}>
                      <Link href={contactUrl} style={footerLink}>Contact</Link>
                    </td>
                  </tr>
                </table>
              </Column>
            </Row>
            <Row>
              <Column align="center">
                <Text style={footerText}>
                  © {copyrightYear} {companyName}. All rights reserved.
                </Text>
                <Text style={footerText}>
                  You are receiving this email because you signed up for CloudDojo updates.
                </Text>
                <Link href={unsubscribeUrl} style={footerLink}>Unsubscribe</Link>
              </Column>
            </Row>
          </PaddedSection>
        </Container>
      </Body>
    </Html>
  );
}

// --- Styles ---
const main = {
  backgroundColor: pageBackgroundColor,
  fontFamily: bodyFont,
  margin: '0 auto',
  padding: '0',
};

const container = {
  backgroundColor: containerBackgroundColor,
  maxWidth: '600px',
  margin: '0 auto',
  border: `1px solid ${dividerColor}`, // Subtle border
};

const header = {
  paddingTop: '24px',
  paddingBottom: '16px',
};

const logo = {
  display: 'block',
  margin: '0 auto',
};

const sectionSpacing = {
  paddingTop: '32px',
  paddingBottom: '32px',
};

const heroImage = {
  display: 'block',
  width: '100%',
  height: 'auto',
  maxWidth: '600px', // Ensure it doesn't exceed container width
};

const heroTextContainer = {
 paddingTop: '24px',
 paddingBottom: '24px',
 textAlign: 'center',
};

const h1 = {
  color: textColor,
  fontSize: '32px', // Prominent heading
  fontWeight: 'bold',
  lineHeight: '40px',
  margin: '0 0 16px 0',
  fontFamily: headingFont,
  textAlign: 'center',
};

const h2 = {
  color: textColor,
  fontSize: '26px', // Slightly smaller than H1
  fontWeight: 'bold',
  lineHeight: '34px',
  margin: '0 0 12px 0',
  textAlign: 'center',
  fontFamily: headingFont,
};

const h3 = {
  color: textColor,
  fontSize: '18px',
  fontWeight: 'bold',
  lineHeight: '24px',
  margin: '0 0 8px 0',
  fontFamily: headingFont,
  textAlign: 'center',
};

const paragraph = {
  color: lightTextColor, // Use lighter text for paragraphs
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 24px 0',
  textAlign: 'center',
};

const paragraphCentered = {
  ...paragraph,
  textAlign: 'center',
};

const buttonPrimary = {
  backgroundColor: accentColor,
  color: buttonTextColor,
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  padding: '12px 24px',
  borderRadius: '8px', // Rounded corners
  display: 'inline-block',
  textAlign: 'center',
  border: 'none',
  cursor: 'pointer',
  msoLineHeightRule: 'exactly', // Outlook fix
};

const featureCard = {
  backgroundColor: '#162B4D', // Slightly lighter dark shade for cards
  border: `1px solid ${dividerColor}`,
  borderRadius: '8px',
  padding: '24px', // Internal padding for cards
  height: '100%', // Make cards in a row equal height (works best with consistent content length)
  boxSizing: 'border-box',
  textAlign: 'center',
};

const featureTitle = {
  ...h3, // Use H3 style but ensure it's centered if not already
  color: accentColor, // Use accent color for feature titles
  marginBottom: '12px',
};

const featureDescription = {
  color: lightTextColor,
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0',
  textAlign: 'center',
};

const ctaSection = {
  backgroundColor: '#162B4D', // Match feature card background
  paddingTop: '40px',
  paddingBottom: '40px',
  textAlign: 'center',
};

const hr = {
  borderColor: dividerColor,
  margin: '32px 0', // Space around dividers
  borderWidth: '0.5px',
};

const footer = {
  paddingTop: '24px',
  paddingBottom: '24px',
  borderTop: `1px solid ${dividerColor}`,
};

const footerText = {
  color: lightTextColor, // Use lighter text for footer
  fontSize: '12px',
  lineHeight: '18px',
  textAlign: 'center',
  margin: '0 0 8px 0',
};

const footerLink = {
  color: accentColor, // Use accent color for footer links
  fontSize: '12px',
  textDecoration: 'underline',
};
