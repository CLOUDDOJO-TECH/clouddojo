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
} from "@react-email/components";
import * as React from "react";

interface StreakRiskEmailProps {
  firstName: string;
  currentStreak: number;
  streakFreezes: number;
  dashboardUrl: string;
}

export default function StreakRiskEmail({
  firstName = "there",
  currentStreak = 7,
  streakFreezes = 1,
  dashboardUrl = "https://clouddojo.tech/dashboard",
}: StreakRiskEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Don't lose your {currentStreak}-day streak! Complete a quiz today.</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={logo}>CloudDojo</Text>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            {/* Fire Icon */}
            <Text style={fireIcon}>🔥</Text>

            {/* Heading */}
            <Heading style={h1}>Your Streak is at Risk!</Heading>

            {/* Greeting */}
            <Text style={text}>Hey {firstName},</Text>

            {/* Main Message */}
            <Text style={text}>
              You're on a <strong style={bold}>{currentStreak}-day streak</strong> – that's amazing! But
              we haven't seen you today yet.
            </Text>

            <Text style={text}>
              Complete just one quiz before midnight to keep your streak alive and continue building your
              certification mastery.
            </Text>

            {/* Streak Freezes */}
            {streakFreezes > 0 && (
              <Section style={freezeBox}>
                <Text style={freezeText}>
                  ❄️ You have <strong>{streakFreezes}</strong> streak freeze
                  {streakFreezes !== 1 ? "s" : ""} available
                </Text>
                <Text style={freezeSubtext}>
                  (A streak freeze will protect your streak if you miss a day)
                </Text>
              </Section>
            )}

            {/* CTA Button */}
            <Section style={buttonContainer}>
              <Button style={button} href={dashboardUrl}>
                Continue My Streak
              </Button>
            </Section>

            {/* Stats Preview */}
            <Section style={statsBox}>
              <Text style={statsTitle}>Your Progress:</Text>
              <Text style={statsText}>
                🔥 Current Streak: <strong>{currentStreak} days</strong>
              </Text>
              <Text style={statsText}>
                ❄️ Streak Freezes: <strong>{streakFreezes}</strong>
              </Text>
            </Section>

            {/* Motivational Footer */}
            <Text style={footerText}>
              Don't let {currentStreak} days of hard work go to waste. It only takes 5 minutes to keep your
              momentum going!
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerLink}>
              Don't want these reminders?{" "}
              <a href={`${dashboardUrl}/settings`} style={link}>
                Manage your notifications
              </a>
            </Text>
            <Text style={footerCopyright}>© 2025 CloudDojo. All rights reserved.</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0",
  marginBottom: "40px",
  maxWidth: "600px",
};

const header = {
  backgroundColor: "#0f172a",
  padding: "20px",
  textAlign: "center" as const,
};

const logo = {
  color: "#ffffff",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "0",
};

const content = {
  padding: "40px 30px",
};

const fireIcon = {
  fontSize: "60px",
  textAlign: "center" as const,
  margin: "0 0 20px 0",
};

const h1 = {
  color: "#1f2937",
  fontSize: "28px",
  fontWeight: "bold",
  margin: "0 0 20px 0",
  textAlign: "center" as const,
};

const text = {
  color: "#374151",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0 0 16px 0",
};

const bold = {
  color: "#0f172a",
  fontWeight: "bold",
};

const freezeBox = {
  backgroundColor: "#dbeafe",
  border: "2px solid #3b82f6",
  borderRadius: "8px",
  padding: "16px",
  margin: "20px 0",
  textAlign: "center" as const,
};

const freezeText = {
  color: "#1e40af",
  fontSize: "16px",
  margin: "0 0 4px 0",
};

const freezeSubtext = {
  color: "#3b82f6",
  fontSize: "13px",
  margin: "0",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "30px 0",
};

const button = {
  backgroundColor: "#0f172a",
  borderRadius: "8px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "14px 32px",
};

const statsBox = {
  backgroundColor: "#f9fafb",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  padding: "20px",
  margin: "20px 0",
};

const statsTitle = {
  color: "#6b7280",
  fontSize: "14px",
  fontWeight: "bold",
  margin: "0 0 12px 0",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
};

const statsText = {
  color: "#374151",
  fontSize: "15px",
  margin: "0 0 8px 0",
};

const footerText = {
  color: "#6b7280",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "20px 0 0 0",
  textAlign: "center" as const,
  fontStyle: "italic",
};

const footer = {
  backgroundColor: "#f9fafb",
  padding: "20px 30px",
  textAlign: "center" as const,
};

const footerLink = {
  color: "#6b7280",
  fontSize: "13px",
  margin: "0 0 8px 0",
};

const link = {
  color: "#3b82f6",
  textDecoration: "underline",
};

const footerCopyright = {
  color: "#9ca3af",
  fontSize: "12px",
  margin: "0",
};
