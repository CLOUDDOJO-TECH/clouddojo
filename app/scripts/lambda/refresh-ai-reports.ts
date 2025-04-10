import { refreshAllExpiredReports } from "@/app/(actions)/ai-analysis/get-cached-ai-analysis";

/**
 * AWS Lambda function to refresh all expired AI analysis reports.
 * This can be scheduled to run every Friday at 8am using CloudWatch Events.
 */
export const handler = async (event: any) => {
  console.log("Starting scheduled AI analysis refresh");
  
  try {
    const result = await refreshAllExpiredReports();
    
    if (!result.success) {
      console.error("Failed to refresh reports:", result.error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Failed to refresh reports", error: result.error })
      };
    }
    
    console.log("Successfully refreshed reports:", result.message);
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: result.message,
        successes: result.details?.filter(r => r.status === 'fulfilled' && r.value.success).length,
        failures: result.details?.filter(r => r.status !== 'fulfilled' || !r.value.success).length,
      })
    };
  } catch (error) {
    console.error("Error in Lambda function:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error", error: error instanceof Error ? error.message : "Unknown error" })
    };
  }
}; 