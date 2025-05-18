
import { getUserTestData } from "./app/(actions)/ai-analysis/get-user-test-data";
import prisma from "./lib/prisma";



async function fetchAndLogUserTestData() {
    // const testResult = await getUserTestData("user_2wrhAf0Zs6kcXW5tOpOdjsqgmy3");
    // console.log("Test result:", testResult);
    const totalUsers = await prisma.user.findMany({
          where: {
            quizAttempts: {
              some: {}
            },
            OR: [
              { aiAnalysisReports: { none: {} } },
              { aiAnalysisReports: { some: { expiresAt: { lte: new Date() } } } }
            ]
          }
        })
    console.log("Total users needing updates:", totalUsers.map(user => user.email));
        return totalUsers
}

// Call the function
fetchAndLogUserTestData();