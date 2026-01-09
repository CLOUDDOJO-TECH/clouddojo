/**
 * Test Emails Script
 * 
 * Sends test emails of each type to verify the email templates work correctly.
 * Run with: npx ts-node scripts/testEmails.ts
 * 
 * Make sure to set EMAIL_TEST_MODE=true to avoid sending to real users.
 */

import {
  sendWelcomeEmailNew,
  sendPasswordResetEmail,
  sendStudyReminderEmail,
  sendQuizResultsEmail,
} from '../lib/emails/emailService';

// Test email must be explicitly set via environment variable to prevent accidental sends
const TEST_EMAIL = process.env.EMAIL_TEST_ADDRESS;
const TEST_USER_ID = 'test-user-123';
const TEST_NAME = 'Test User';

function validateTestEmail(): boolean {
  if (!TEST_EMAIL) {
    console.error('❌ ERROR: EMAIL_TEST_ADDRESS environment variable is not set');
    console.log('Please set EMAIL_TEST_ADDRESS to your test email before running this script.');
    console.log('Example: EMAIL_TEST_ADDRESS=yourname@example.com npm run email:test');
    return false;
  }
  return true;
}

async function testWelcomeEmail() {
  console.log('\n📧 Testing Welcome Email...');
  const result = await sendWelcomeEmailNew({
    userId: TEST_USER_ID,
    email: TEST_EMAIL!,
    name: TEST_NAME,
  });
  console.log('Welcome Email Result:', result.success ? '✅ Success' : '❌ Failed');
  return result;
}

async function testPasswordResetEmail() {
  console.log('\n📧 Testing Password Reset Email...');
  const result = await sendPasswordResetEmail({
    userId: TEST_USER_ID,
    email: TEST_EMAIL!,
    name: TEST_NAME,
    resetToken: 'test-reset-token-12345',
    expiryMinutes: 60,
  });
  console.log('Password Reset Email Result:', result.success ? '✅ Success' : '❌ Failed');
  return result;
}

async function testStudyReminderEmail() {
  console.log('\n📧 Testing Study Reminder Email...');
  const result = await sendStudyReminderEmail({
    userId: TEST_USER_ID,
    email: TEST_EMAIL!,
    name: TEST_NAME,
    lastCertification: 'AWS Solutions Architect - Associate',
    daysSinceLastStudy: 5,
  });
  console.log('Study Reminder Email Result:', result.success ? '✅ Success' : '❌ Failed');
  return result;
}

async function testQuizResultsEmailPassed() {
  console.log('\n📧 Testing Quiz Results Email (Passed)...');
  const result = await sendQuizResultsEmail({
    userId: TEST_USER_ID,
    email: TEST_EMAIL!,
    name: TEST_NAME,
    quizData: {
      score: 55,
      totalQuestions: 65,
      passPercentage: 72,
      passed: true,
      weakAreas: ['Networking & VPC', 'Security & IAM'],
      nextSteps: 'Great job! Consider reviewing your weak areas and take another practice test to solidify your knowledge.',
    },
  });
  console.log('Quiz Results (Passed) Email Result:', result.success ? '✅ Success' : '❌ Failed');
  return result;
}

async function testQuizResultsEmailFailed() {
  console.log('\n📧 Testing Quiz Results Email (Failed)...');
  const result = await sendQuizResultsEmail({
    userId: TEST_USER_ID,
    email: TEST_EMAIL!,
    name: TEST_NAME,
    quizData: {
      score: 35,
      totalQuestions: 65,
      passPercentage: 72,
      passed: false,
      weakAreas: ['Storage Services', 'Compute & EC2', 'Database Services'],
      nextSteps: 'Focus on the weak areas listed above. Review the AWS documentation and take more practice quizzes to improve.',
    },
  });
  console.log('Quiz Results (Failed) Email Result:', result.success ? '✅ Success' : '❌ Failed');
  return result;
}

async function main() {
  console.log('='.repeat(60));
  console.log('CloudDojo Email Template Test Suite');
  console.log('='.repeat(60));
  
  // Validate test email is set
  if (!validateTestEmail()) {
    process.exit(1);
  }
  
  console.log(`\nTest Email: ${TEST_EMAIL}`);
  console.log(`EMAIL_TEST_MODE: ${process.env.EMAIL_TEST_MODE || 'not set'}`);
  console.log(`NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
  
  if (!process.env.RESEND_API_KEY) {
    console.error('\n❌ ERROR: RESEND_API_KEY environment variable is not set');
    console.log('Please set RESEND_API_KEY before running this script.');
    process.exit(1);
  }

  const results = {
    welcome: false,
    passwordReset: false,
    studyReminder: false,
    quizResultsPassed: false,
    quizResultsFailed: false,
  };

  try {
    const welcomeResult = await testWelcomeEmail();
    results.welcome = welcomeResult.success;
  } catch (error) {
    console.error('Welcome email error:', error);
  }

  try {
    const resetResult = await testPasswordResetEmail();
    results.passwordReset = resetResult.success;
  } catch (error) {
    console.error('Password reset email error:', error);
  }

  try {
    const reminderResult = await testStudyReminderEmail();
    results.studyReminder = reminderResult.success;
  } catch (error) {
    console.error('Study reminder email error:', error);
  }

  try {
    const passedResult = await testQuizResultsEmailPassed();
    results.quizResultsPassed = passedResult.success;
  } catch (error) {
    console.error('Quiz results (passed) email error:', error);
  }

  try {
    const failedResult = await testQuizResultsEmailFailed();
    results.quizResultsFailed = failedResult.success;
  } catch (error) {
    console.error('Quiz results (failed) email error:', error);
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('Test Results Summary');
  console.log('='.repeat(60));
  console.log(`Welcome Email:          ${results.welcome ? '✅' : '❌'}`);
  console.log(`Password Reset Email:   ${results.passwordReset ? '✅' : '❌'}`);
  console.log(`Study Reminder Email:   ${results.studyReminder ? '✅' : '❌'}`);
  console.log(`Quiz Results (Passed):  ${results.quizResultsPassed ? '✅' : '❌'}`);
  console.log(`Quiz Results (Failed):  ${results.quizResultsFailed ? '✅' : '❌'}`);
  
  const allPassed = Object.values(results).every(r => r);
  console.log('\n' + (allPassed ? '✅ All tests passed!' : '❌ Some tests failed'));
  
  process.exit(allPassed ? 0 : 1);
}

main().catch(console.error);
