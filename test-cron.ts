
import { getUserTestData } from "./app/(actions)/ai-analysis/get-user-test-data";



async function fetchAndLogUserTestData() {
    const testResult = await getUserTestData("user_2wrhAf0Zs6kcXW5tOpOdjsqgmy3");
    console.log("Test result:", testResult);
}

// Call the function
fetchAndLogUserTestData();