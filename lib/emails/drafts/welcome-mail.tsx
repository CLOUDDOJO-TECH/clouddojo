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
import { FaBrain, FaUserCheck, FaRocket } from 'react-icons/fa6'; // Added new icons for welcome features, kept FaBrain

// --- Color Palette ---
const pageBackgroundColor = '#202832'; // Dark background for the page
const containerBackgroundColor = '#14181e'; // Slightly different dark for the main content container
const accentColor = '#66ffcc'; // Bright green accent
const textColor = '#d0e0f0'; // Light text for readability on dark background
const lightTextColor = '#a0b0c0'; // Slightly dimmer text for secondary info
const buttonTextColor = '#14181e'; // Dark text for contrast on green button
const borderColor = 'rgba(102, 255, 204, 0.2)'; // Subtle border using accent color
const dividerColor = 'rgba(102, 255, 204, 0.1)'; // Very subtle divider
const footerLinkColor = '#66ffcc'; // Accent color for footer links

// --- Fonts ---
const headingFont = 'Inter, sans-serif';
const bodyFont = 'Inter, sans-serif';

// --- URLs & Content ---
const logoUrl = 'https://cdn.migma.ai/projects/6821f96bc8d7bc6ae950fb77/logos/dojo-logo_logo_s2vj82.png'; // Primary logo
const websiteUrl = 'https://www.clouddojo.tech/';
const getStartedUrl = '|_GET_STARTED_URL_|'; // Placeholder for getting started/dashboard link
const featuresUrl = '|_FEATURES_URL_|'; // Placeholder for features page/section (not used in this template, but kept from changes)
const supportUrl = 'https://www.clouddojo.tech/support'; // Updated with full URL based on sitemap pattern
const blogUrl = 'https://www.clouddojo.tech/#'; // From sitemap (points to homepage section)
const contactUrl = 'https://calendar.notion.so/meet/glenmiracle/7fnt4l09'; // From research context

const companyName = 'CloudDojo';
const copyrightYear = new Date().getFullYear();
const unsubscribeUrl = '|_UNSUBSCRIBE_URL_|';

// --- Content ---
const content = {
  en: {
    title: "Welcome to CloudDojo - Study Smarter, Pass Faster!", // Changed title
    previewText: "Welcome aboard! Get ready to crush your AWS certification exams with CloudDojo's smart practice tests, AI feedback, and performance tracking. Let's get started!", // Updated preview
    greeting: "Welcome, |_FIRST_NAME_|!", // Changed greeting
    welcomeMessage: `You've made a great choice joining ${companyName}! We're excited to help you prepare effectively for your AWS certification exams.`, // New welcome message
    whatIsCloudDojo: "Tired of random questions and unsure if you're truly ready? CloudDojo provides targeted practice tests, smart analytics to pinpoint weaknesses, and AI-powered feedback to guide your study.", // Explanation of CloudDojo
    getStartedHeading: "Here's how to get started:", // New section heading
    getStartedButton: "Go to My Dashboard", // Changed primary button text
    ctaHeading: "Ready to Ace Your Exam?", // Updated CTA heading
    ctaText: "Begin your journey with a practice test or explore the features designed to accelerate your learning.", // Updated CTA text
    ctaButton: "Start a Practice Test", // Changed secondary button text
    footerSupport: "Support",
    footerBlog: "Blog",
    footerContact: "Contact",
    footerCopyright: `© ${copyrightYear} ${companyName}. All rights reserved.`,
    footerDisclaimer: `You're receiving this email because you just signed up for ${companyName}.`, // Updated disclaimer
    footerUnsubscribe: "Unsubscribe",
  },
  // Add other languages if needed
};

// Function to get content based on language
const getContent = (lang) => {
  return content[lang] || content.en; // Default to English if language not found
};


// Replaced reportInsights with welcomeFeatures
const welcomeFeatures = [
  {
    icon: <FaUserCheck size={24} color={accentColor} />,
    title: 'Personalized Dashboard',
    description: 'Track your progress, review performance analytics, and manage your study plan.',
  },
  {
    icon: <FaRocket size={24} color={accentColor} />,
    title: 'Targeted Practice Tests',
    description: 'Focus on specific AWS certification domains with tailored question sets.',
  },
  {
    icon: <FaBrain size={24} color={accentColor} />, // Reused icon
    title: 'AI-Powered Feedback',
    description: 'Get real-time insights and suggestions based on your performance.',
  },
];

// --- Reusable Components ---
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
  margin: '40px auto',
  border: `1px solid ${borderColor}`,
  borderRadius: '8px',
  overflow: 'hidden',
};

const header = {
  paddingTop: '24px',
  paddingBottom: '16px',
};

const logoStyle = {
  display: 'block',
  margin: '0 auto',
};

const sectionSpacing = {
  paddingTop: '32px',
  paddingBottom: '32px',
};

const h1 = {
  color: textColor,
  fontSize: '26px',
  fontWeight: 'bold',
  lineHeight: '34px',
  margin: '0 0 20px 0',
  textAlign: 'center' as const,
  fontFamily: headingFont,
};

const h2 = {
  color: textColor,
  fontSize: '22px',
  fontWeight: 'bold',
  lineHeight: '30px',
  margin: '0 0 16px 0',
  textAlign: 'center' as const,
  fontFamily: headingFont,
};

const h3 = {
  color: textColor,
  fontSize: '18px',
  fontWeight: '600',
  lineHeight: '24px',
  margin: '0 0 8px 0',
  fontFamily: headingFont,
};

const paragraph = {
  color: textColor,
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 20px 0',
  textAlign: 'left' as const,
};

const paragraphCentered = {
  ...paragraph,
  textAlign: 'center' as const,
};

const lightParagraph = {
  ...paragraph,
  color: lightTextColor,
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0 0 12px 0',
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
  textAlign: 'center' as const,
  border: 'none',
  cursor: 'pointer',
  msoLineHeightRule: 'exactly',
};

// Renamed insightCard style for clarity, content is similar
const featureCard = {
  border: `1px solid ${borderColor}`,
  borderRadius: '8px',
  padding: '20px',
  marginBottom: '16px',
};

// Updated CTA section style slightly if needed (keeping background for contrast)
const ctaSectionStyle = {
  backgroundColor: pageBackgroundColor,
  paddingTop: '40px',
  paddingBottom: '40px',
  textAlign: 'center' as const,
};

const hr = {
  borderColor: dividerColor,
  margin: '32px 0',
};

const footer = {
  paddingTop: '24px',
  paddingBottom: '24px',
  backgroundColor: containerBackgroundColor, // Match container background
};

const footerLinkStyle = {
  color: footerLinkColor,
  fontSize: '12px',
  textDecoration: 'underline',
  margin: '0 5px',
};

const footerSeparator = {
  color: lightTextColor,
  fontSize: '12px',
  margin: '0 5px',
};

const footerText = {
  color: lightTextColor,
  fontSize: '12px',
  lineHeight: '18px',
  textAlign: 'center' as const,
  margin: '0 0 8px 0',
};

// Add styles for column padding if not already implicitly handled
const columnPadding = {
  paddingLeft: '8px', // Gutter space
  paddingRight: '8px', // Gutter space
};

// --- Email Component ---
// Renamed component function
export default function CloudDojoWelcomeEmail({ firstName = 'Cloud Explorer', language = 'en' }) {
  const currentContent = getContent(language);
  const featuresRow1 = welcomeFeatures.slice(0, 2); // First two features
  const featuresRow2 = welcomeFeatures.slice(2, 3); // Third feature

  return (
    <Html lang={language}>
      <Head>
        {/* Updated title */}
        <title>{currentContent.title}</title>
        <Font
          fontFamily="Inter"
          fallbackFontFamily="sans-serif"
          webFont={{
            url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
        <style>{`
          body { background-color: ${pageBackgroundColor}; margin: 0; padding: 0; }
          .content-padding { padding-left: 30px; padding-right: 30px; }

          /* New styles for two-column layout */
          .feature-column { width: 50%; vertical-align: top; } /* Base style for 2 columns */
          .feature-column-padding { padding-left: 8px; padding-right: 8px; }

          @media only screen and (max-width: 600px) {
            .content-padding { padding-left: 20px !important; padding-right: 20px !important; }
            .mobile-stack { display: block !important; width: 100% !important; }
            .mobile-center { text-align: center !important; }
            .mobile-button { display: block !important; width: 100% !important; max-width: 300px !important; margin: 10px auto !important; }
            .mobile-column {
              display: block !important;
              width: 100% !important;
              max-width: 100% !important;
              padding-right: 0 !important;
              padding-left: 0 !important;
              box-sizing: border-box !important;
              margin-bottom: 16px !important;
            }
             .mobile-column > table { width: 100% !important; }
             /* Target only the text column in feature cards */
             .feature-text-column td { width: 100% !important; }
             .mobile-image { width: 100% !important; height: auto !important; max-width: 100% !important; margin: 0 auto 20px auto !important; }
             .feature-icon-column { width: 40px !important; padding-right: 16px !important; } /* Maintain icon column width */

             /* Mobile styles for new feature columns */
             .feature-column { width: 100% !important; display: block !important; padding-left: 0 !important; padding-right: 0 !important; } /* Stack columns */
             .feature-column-padding { padding-left: 0 !important; padding-right: 0 !important; }
             .feature-row-2-column { max-width: 100% !important; margin: 0 auto !important; } /* Ensure single centered column takes full width */
          }
        `}</style>
      </Head>
       {/* Updated preview text */}
      <Preview>{currentContent.previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* START HEADER COMPONENT */}
          <PaddedSection style={header}>
            <Row>
              <Column align="center">
                <Link href={websiteUrl}>
                  <Img
                    src={logoUrl}
                    alt={`${companyName} Logo`}
                    width="120" // Adjusted size
                    height="auto"
                    style={logoStyle}
                  />
                </Link>
              </Column>
            </Row>
          </PaddedSection>
          {/* END HEADER COMPONENT */}

          {/* START MAIN CONTENT SECTION */}
          <PaddedSection style={sectionSpacing}>
            <Row>
              <Column>
                 {/* Updated heading */}
                <Heading as="h1" style={h1}>{currentContent.title}</Heading>
                 {/* Updated text content */}
                <Text style={paragraph}>
                  {currentContent.greeting.replace('|_FIRST_NAME_|', firstName)}
                </Text>
                <Text style={paragraph}>
                  {currentContent.welcomeMessage}
                </Text>
                <Text style={lightParagraph}>
                  {currentContent.whatIsCloudDojo}
                </Text>
              </Column>
            </Row>

            {/* --- MODIFIED Features Section START --- */}
            <Row style={{ marginTop: '24px', marginBottom: '16px' }}>
              <Column>
                <Heading as="h2" style={{ ...h2, textAlign: 'left' }}>{currentContent.getStartedHeading}</Heading>
              </Column>
            </Row>

            {/* Row 1: First two features */}
            <Row>
              {featuresRow1.map((feature, index) => (
                <Column key={index} className="feature-column feature-column-padding" style={columnPadding}>
                  <Section style={featureCard}>
                     {/* Using table for better email client compatibility inside the card */}
                     <table width="100%" cellPadding="0" cellSpacing="0" role="presentation">
                        <tbody>
                          <tr>
                            <td style={{ width: '40px', verticalAlign: 'top', paddingRight: '16px' }}>
                              {feature.icon}
                            </td>
                            <td style={{ verticalAlign: 'top' }}>
                              <Heading as="h3" style={h3}>{feature.title}</Heading>
                              <Text style={lightParagraph}>{feature.description}</Text>
                            </td>
                          </tr>
                        </tbody>
                     </table>
                  </Section>
                </Column>
              ))}
            </Row>

            {/* Row 2: Third feature (centered) */}
            {featuresRow2.length > 0 && (
              <Row style={{ marginTop: '0' }}> {/* Adjust margin if needed */}
                {/* You might need a spacer column on each side for true centering in some clients,
                    or adjust the width/max-width for a simpler approach.
                    Here, we place it in a single column that stacks correctly. */}
                <Column className="feature-column feature-column-padding feature-row-2-column" style={{ ...columnPadding, width: '100%', maxWidth: 'calc(50% - 16px)', margin: '0 auto' }}> {/* Centering attempt for desktop */}
                   {featuresRow2.map((feature, index) => (
                     <Section key={index} style={featureCard}>
                       <table width="100%" cellPadding="0" cellSpacing="0" role="presentation">
                         <tbody>
                           <tr>
                             <td style={{ width: '40px', verticalAlign: 'top', paddingRight: '16px' }}>
                               {feature.icon}
                             </td>
                             <td style={{ verticalAlign: 'top' }}>
                               <Heading as="h3" style={h3}>{feature.title}</Heading>
                               <Text style={lightParagraph}>{feature.description}</Text>
                             </td>
                           </tr>
                         </tbody>
                       </table>
                     </Section>
                   ))}
                </Column>
              </Row>
            )}
            {/* --- MODIFIED Features Section END --- */}


            {/* Primary CTA Button */}
            <Row style={{ marginTop: '32px' }}>
              <Column align="center">
                 {/* Updated button text and href */}
                <Button href={getStartedUrl} style={buttonPrimary} className="mobile-button">
                  {currentContent.getStartedButton}
                </Button>
              </Column>
            </Row>
          </PaddedSection>
          {/* END MAIN CONTENT SECTION */}

          {/* START CTA SECTION - REMOVED */}
          {/*
          <Section style={ctaSectionStyle}>
             <Row>
               <Column align="center">
                 <Img
                    src="https://placehold.co/600x200/14181e/66ffcc?text=Start+Your+Journey"
                    alt="Stylized graphic representing a starting line or progress bar in CloudDojo's brand colors (dark background, green accents)"
                    width="600"
                    height="auto"
                    style={{ maxWidth: '100%', marginBottom: '24px' }}
                    className="mobile-image"
                 />
                 <PaddedSection>
                   <Heading as="h2" style={h2}>{currentContent.ctaHeading}</Heading>
                   <Text style={paragraphCentered}>
                     {currentContent.ctaText}
                   </Text>
                   <Button href={getStartedUrl} style={buttonPrimary} className="mobile-button">
                     {currentContent.ctaButton}
                   </Button>
                 </PaddedSection>
               </Column>
             </Row>
          </Section>
          */}
          {/* END CTA SECTION - REMOVED */}

          <Hr style={hr} />

          {/* START FOOTER COMPONENT */}
          <PaddedSection style={footer}>
            {/* Footer Links */}
            <Row style={{ marginBottom: '16px' }}>
              <Column align="center">
                <table cellPadding="0" cellSpacing="0" border="0" align="center">
                  <tbody>
                    <tr>
                      <td style={{ paddingRight: '8px', paddingLeft: '8px' }}>
                        <Link href={supportUrl} style={footerLinkStyle}>{currentContent.footerSupport}</Link>
                      </td>
                      <td style={{ paddingRight: '8px', paddingLeft: '8px' }}>
                        <span style={footerSeparator}>|</span>
                      </td>
                      <td style={{ paddingRight: '8px', paddingLeft: '8px' }}>
                        <Link href={blogUrl} style={footerLinkStyle}>{currentContent.footerBlog}</Link>
                      </td>
                      <td style={{ paddingRight: '8px', paddingLeft: '8px' }}>
                        <span style={footerSeparator}>|</span>
                      </td>
                      <td style={{ paddingRight: '8px', paddingLeft: '8px' }}>
                        <Link href={contactUrl} style={footerLinkStyle}>{currentContent.footerContact}</Link>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Column>
            </Row>

            {/* Disclaimer & Copyright */}
            <Row>
              <Column align="center">
                 <Text style={footerText}>
                  {currentContent.footerCopyright}
                </Text>
                 {/* Updated disclaimer text */}
                <Text style={footerText}>
                  {currentContent.footerDisclaimer}
                </Text>
                <Text style={footerText}>
                  <Link href={unsubscribeUrl} style={footerLinkStyle}>{currentContent.footerUnsubscribe}</Link>
                </Text>
              </Column>
            </Row>
          </PaddedSection>
          {/* END FOOTER COMPONENT */}
        </Container>
      </Body>
    </Html>
  );
}
