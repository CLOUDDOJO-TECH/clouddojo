import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import LeaderboardPage from "./page"; // Adjust path as necessary

// Mock fetch
global.fetch = jest.fn();

// Mock next/navigation
jest.mock("next/navigation", () => ({
  usePathname: jest.fn().mockReturnValue("/dashboard/leaderboard"),
  // Mock other hooks like useRouter if needed by child components, though not directly by this page
}));

// Mock UI components that might cause issues or are not relevant to the logic being tested
jest.mock("@/components/ui/avatar", () => ({
  Avatar: ({ children, className }: { children: React.ReactNode, className?: string }) => <div data-testid="avatar" className={className}>{children}</div>,
  AvatarImage: ({ src, alt }: { src: string, alt: string}) => <img src={src} alt={alt} data-testid="avatar-image" />,
  AvatarFallback: ({ children }: { children: React.ReactNode }) => <div data-testid="avatar-fallback">{children}</div>,
}));

jest.mock("@/components/ui/card", () => ({
  Card: ({ children, className }: { children: React.ReactNode, className?: string }) => <div className={`mock-card ${className || ''}`} data-testid="card">{children}</div>,
  CardHeader: ({ children, className }: { children: React.ReactNode, className?:string }) => <div className={`mock-card-header ${className || ''}`} data-testid="card-header">{children}</div>,
  CardTitle: ({ children, className }: { children: React.ReactNode, className?:string }) => <h3 className={`mock-card-title ${className || ''}`} data-testid="card-title">{children}</h3>,
  CardContent: ({ children, className }: { children: React.ReactNode, className?:string }) => <div className={`mock-card-content ${className || ''}`} data-testid="card-content">{children}</div>,
  TableCaption: ({ children, className }: { children: React.ReactNode, className?:string }) => <caption className={className} data-testid="table-caption">{children}</caption>
}));


const mockLeaderboardData = [
  { userId: "user1", firstName: "Podium", lastName: "One", percentageScore: 95, timeSpentSecs: 100 },
  { userId: "user2", firstName: "Podium", lastName: "Two", percentageScore: 90, timeSpentSecs: 110 },
  { userId: "user3", firstName: "Podium", lastName: "Three", percentageScore: 85, timeSpentSecs: 120 },
  { userId: "user4", firstName: "Table", lastName: "UserA", percentageScore: 80, timeSpentSecs: 130 },
  { userId: "user5", firstName: "Table", lastName: "UserB", percentageScore: 75, timeSpentSecs: 140 },
  { userId: "user6", firstName: "Another", lastName: "Searchable", percentageScore: 70, timeSpentSecs: 150 },
];

describe("LeaderboardPage", () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  test("displays loading state initially", () => {
    (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {})); // Never resolves
    render(<LeaderboardPage />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("displays error state if fetch fails", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("API Error"));
    render(<LeaderboardPage />);
    expect(await screen.findByText("Error: API Error")).toBeInTheDocument();
  });

  test("displays 'No leaderboard data available' if fetch returns empty array", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });
    render(<LeaderboardPage />);
    expect(await screen.findByText("No leaderboard data available.")).toBeInTheDocument();
  });

  describe("with successful data fetch", () => {
    beforeEach(() => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockLeaderboardData,
      });
    });

    test("renders podium and table correctly", async () => {
      render(<LeaderboardPage />);

      // Check for podium users
      expect(await screen.findByText("Podium One")).toBeInTheDocument();
      expect(screen.getByText("Podium Two")).toBeInTheDocument();
      expect(screen.getByText("Podium Three")).toBeInTheDocument();

      // Check ranks in podium (look for #1, #2, #3 within specific card structures if possible, or by text)
      // This depends on how podium items are structured. Assuming text like "#1" exists.
      expect(screen.getByText("#1")).toBeInTheDocument();
      expect(screen.getByText("#2")).toBeInTheDocument();
      expect(screen.getByText("#3")).toBeInTheDocument();


      // Check for table users
      expect(screen.getByText("Table UserA")).toBeInTheDocument();
      expect(screen.getByText("Table UserB")).toBeInTheDocument();
      expect(screen.getByText("Another Searchable")).toBeInTheDocument();

      // Check ranks in table (Rank column with 4, 5, 6)
      expect(screen.getByRole("cell", { name: "4" })).toBeInTheDocument();
      expect(screen.getByRole("cell", { name: "5" })).toBeInTheDocument();
      expect(screen.getByRole("cell", { name: "6" })).toBeInTheDocument();
    });

    test("search functionality filters the table but not the podium", async () => {
      render(<LeaderboardPage />);
      await screen.findByText("Podium One"); // Ensure data is loaded

      // Podium users should always be visible
      expect(screen.getByText("Podium One")).toBeInTheDocument();
      expect(screen.getByText("Podium Two")).toBeInTheDocument();
      expect(screen.getByText("Podium Three")).toBeInTheDocument();

      // Table users initially visible
      expect(screen.getByText("Table UserA")).toBeInTheDocument();
      expect(screen.getByText("Another Searchable")).toBeInTheDocument();

      const searchInput = screen.getByPlaceholderText("Search by name...");
      fireEvent.change(searchInput, { target: { value: "Another" } });

      // Podium users still visible
      expect(screen.getByText("Podium One")).toBeInTheDocument();
      expect(screen.getByText("Podium Two")).toBeInTheDocument();
      expect(screen.getByText("Podium Three")).toBeInTheDocument();

      // Filtered table users
      expect(screen.queryByText("Table UserA")).not.toBeInTheDocument();
      expect(screen.getByText("Another Searchable")).toBeInTheDocument();
      // Check rank of "Another Searchable" is still 6
      const rowOfSearchedUser = screen.getByText("Another Searchable").closest('tr');
      const rankCellInRow = rowOfSearchedUser?.querySelector('td:first-child, th:first-child'); // or use getByRole on the row
      expect(rankCellInRow).toHaveTextContent("6");


      fireEvent.change(searchInput, { target: { value: "NonExistent" } });
      expect(screen.getByText("No users found matching your search.")).toBeInTheDocument();
      expect(screen.queryByText("Table UserA")).not.toBeInTheDocument();
      expect(screen.queryByText("Another Searchable")).not.toBeInTheDocument();
    });
  });

  test("displays 'All users are on the podium!' if 3 or fewer users", async () => {
    const fewUsersData = mockLeaderboardData.slice(0, 2); // Only 2 users
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => fewUsersData,
    });
    render(<LeaderboardPage />);
    expect(await screen.findByText("Podium One")).toBeInTheDocument();
    expect(screen.getByText("Podium Two")).toBeInTheDocument();
    expect(screen.getByText("All users are on the podium!")).toBeInTheDocument();
    // Ensure search input and "Full Rankings" title are not present
    expect(screen.queryByPlaceholderText("Search by name...")).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", {name: "Full Rankings"})).not.toBeInTheDocument();

  });
});
