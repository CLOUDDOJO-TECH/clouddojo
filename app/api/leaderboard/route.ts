import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        quizAttempts: true,
      },
    });

    const leaderboard = users
      .map((user) => {
        if (user.quizAttempts.length === 0) {
          return null; // or handle as needed, e.g. rank last
        }

        // Find the best quiz attempt
        const bestAttempt = user.quizAttempts.reduce((best, current) => {
          if (current.percentageScore > best.percentageScore) {
            return current;
          }
          if (current.percentageScore === best.percentageScore) {
            return current.timeSpentSecs < best.timeSpentSecs ? current : best;
          }
          return best;
        });

        return {
          userId: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          percentageScore: bestAttempt.percentageScore,
          timeSpentSecs: bestAttempt.timeSpentSecs,
        };
      })
      .filter(Boolean); // Remove users with no attempts for now

    // Sort the leaderboard: highest score first, then by less time spent
    leaderboard.sort((a, b) => {
      if (b.percentageScore !== a.percentageScore) {
        return b.percentageScore - a.percentageScore;
      }
      return a.timeSpentSecs - b.timeSpentSecs;
    });

    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard data" },
      { status: 500 }
    );
  }
}
