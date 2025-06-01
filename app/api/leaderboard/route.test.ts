import { GET } from "./route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Mock Prisma
jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findMany: jest.fn(),
    },
  },
}));

// Mock NextResponse
jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((data, options) => ({
      json: () => Promise.resolve(data), // Make it behave like a Response
      status: options?.status || 200,
      ok: (options?.status || 200) < 300,
      ...options
    })),
  },
}));


describe("GET /api/leaderboard", () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  test("should return sorted leaderboard data", async () => {
    const mockUsers = [
      {
        id: "user1",
        firstName: "Alice",
        lastName: "Smith",
        quizAttempts: [
          { percentageScore: 80, timeSpentSecs: 120 },
          { percentageScore: 90, timeSpentSecs: 100 }, // Best attempt
        ],
      },
      {
        id: "user2",
        firstName: "Bob",
        lastName: "Johnson",
        quizAttempts: [
          { percentageScore: 90, timeSpentSecs: 110 }, // Worse time than Alice's 90
        ],
      },
      {
        id: "user3",
        firstName: "Charlie",
        lastName: "Brown",
        quizAttempts: [], // No attempts
      },
      {
        id: "user4",
        firstName: "Diana",
        lastName: "Prince",
        quizAttempts: [
          { percentageScore: 95, timeSpentSecs: 150 }, // Highest score
        ],
      },
       {
        id: "user5",
        firstName: "Eve",
        lastName: "Adams",
        quizAttempts: [
          { percentageScore: 90, timeSpentSecs: 100 }, // Same as Alice, but different user
        ],
      },
    ];
    (prisma.user.findMany as jest.Mock).mockResolvedValue(mockUsers);

    const response = await GET();
    const data = await response.json();

    expect(NextResponse.json).toHaveBeenCalledWith(expect.any(Array), { status: undefined }); // Check default status if no error
    expect(data).toEqual([
      { userId: "user4", firstName: "Diana", lastName: "Prince", percentageScore: 95, timeSpentSecs: 150 },
      { userId: "user1", firstName: "Alice", lastName: "Smith", percentageScore: 90, timeSpentSecs: 100 },
      { userId: "user5", firstName: "Eve", lastName: "Adams", percentageScore: 90, timeSpentSecs: 100 }, // Test tie-breaking, order between user1 and user5 might vary if not further sorted by ID/name
      { userId: "user2", firstName: "Bob", lastName: "Johnson", percentageScore: 90, timeSpentSecs: 110 },
    ]);
    expect(data.length).toBe(4); // User3 is filtered out
  });

  test("should return an empty array if no users exist", async () => {
    (prisma.user.findMany as jest.Mock).mockResolvedValue([]);
    const response = await GET();
    const data = await response.json();

    expect(NextResponse.json).toHaveBeenCalledWith([]);
    expect(data).toEqual([]);
  });

  test("should return an empty array if users exist but have no quiz attempts", async () => {
    const mockUsers = [
      { id: "user1", firstName: "Test", lastName: "UserA", quizAttempts: [] },
      { id: "user2", firstName: "Test", lastName: "UserB", quizAttempts: [] },
    ];
    (prisma.user.findMany as jest.Mock).mockResolvedValue(mockUsers);
    const response = await GET();
    const data = await response.json();

    expect(NextResponse.json).toHaveBeenCalledWith([]);
    expect(data).toEqual([]);
  });

  test("should sort by timeSpentSecs if percentageScores are equal", async () => {
    const mockUsers = [
      {
        id: "user1",
        firstName: "Player",
        lastName: "One",
        quizAttempts: [{ percentageScore: 85, timeSpentSecs: 120 }],
      },
      {
        id: "user2",
        firstName: "Player",
        lastName: "Two",
        quizAttempts: [{ percentageScore: 85, timeSpentSecs: 100 }], // Better time
      },
      {
        id: "user3",
        firstName: "Player",
        lastName: "Three",
        quizAttempts: [{ percentageScore: 85, timeSpentSecs: 110 }],
      },
    ];
    (prisma.user.findMany as jest.Mock).mockResolvedValue(mockUsers);
    const response = await GET();
    const data = await response.json();

    expect(NextResponse.json).toHaveBeenCalledWith(expect.any(Array));
    expect(data).toEqual([
      { userId: "user2", firstName: "Player", lastName: "Two", percentageScore: 85, timeSpentSecs: 100 },
      { userId: "user3", firstName: "Player", lastName: "Three", percentageScore: 85, timeSpentSecs: 110 },
      { userId: "user1", firstName: "Player", lastName: "One", percentageScore: 85, timeSpentSecs: 120 },
    ]);
  });

  test("should handle users with multiple attempts correctly, picking the best one", async () => {
    const mockUsers = [
      {
        id: "user1",
        firstName: "Multi",
        lastName: "Attempt",
        quizAttempts: [
          { percentageScore: 70, timeSpentSecs: 200 },
          { percentageScore: 80, timeSpentSecs: 150 }, // Best attempt
          { percentageScore: 75, timeSpentSecs: 180 },
        ],
      },
       {
        id: "user2",
        firstName: "Another",
        lastName: "Player",
        quizAttempts: [
          { percentageScore: 80, timeSpentSecs: 160 }, // Worse time than user1's best
        ],
      },
    ];
    (prisma.user.findMany as jest.Mock).mockResolvedValue(mockUsers);
    const response = await GET();
    const data = await response.json();

    expect(NextResponse.json).toHaveBeenCalledWith(expect.any(Array));
    expect(data).toEqual([
      { userId: "user1", firstName: "Multi", lastName: "Attempt", percentageScore: 80, timeSpentSecs: 150 },
      { userId: "user2", firstName: "Another", lastName: "Player", percentageScore: 80, timeSpentSecs: 160 },
    ]);
  });

  test("should handle tie-breaking (same score, same time) - order may depend on original data or be stable", async () => {
    // If not explicitly sorted by another field (e.g. name, ID), the order of ties might be
    // based on their original order in the DB response, or other factors.
    // For this test, we ensure they are both present and correctly scored.
    const mockUsers = [
      {
        id: "userA",
        firstName: "Alpha",
        lastName: "One",
        quizAttempts: [{ percentageScore: 90, timeSpentSecs: 100 }],
      },
      {
        id: "userB",
        firstName: "Beta",
        lastName: "Two",
        quizAttempts: [{ percentageScore: 90, timeSpentSecs: 100 }],
      },
    ];
    (prisma.user.findMany as jest.Mock).mockResolvedValue(mockUsers);
    const response = await GET();
    const data = await response.json();

    expect(NextResponse.json).toHaveBeenCalledWith(expect.any(Array));
    expect(data.length).toBe(2);
    expect(data).toContainEqual({ userId: "userA", firstName: "Alpha", lastName: "One", percentageScore: 90, timeSpentSecs: 100 });
    expect(data).toContainEqual({ userId: "userB", firstName: "Beta", lastName: "Two", percentageScore: 90, timeSpentSecs: 100 });
  });

  test("should return 500 if Prisma call fails", async () => {
    (prisma.user.findMany as jest.Mock).mockRejectedValue(new Error("Database error"));

    const response = await GET();
    // const data = await response.json(); // Don't call .json() again here, it's done by NextResponse mock

    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: "Failed to fetch leaderboard data" },
      { status: 500 }
    );
     expect(response.status).toBe(500);
  });
});
