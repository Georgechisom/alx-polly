// app/aip / polls / route.test.ts;

import { POST } from "./route";
import { createRouteClient } from "@/lib/supabase/server-client";
import { NextRequest } from "next/server";

// Mock the Supabase client
jest.mock("@/lib/supabase/server-client", () => ({
  createRouteClient: jest.fn(),
}));

// Mock Next.js cookies
jest.mock("next/headers", () => ({
  cookies: jest.fn(() => ({
    get: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
  })),
}));

const mockedCreateClient = createRouteClient as jest.MockedFunction<
  typeof createRouteClient
>;

describe("POST /api/polls", () => {
  let mockSupabase: any;
  let mockRequest: Partial<NextRequest>;

  beforeEach(() => {
    // Create a comprehensive mock of the Supabase client
    mockSupabase = {
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: { id: "user-123" } },
          error: null,
        }),
      },
      from: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      single: jest.fn(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
    };

    mockedCreateClient.mockReturnValue(mockSupabase);

    // Mock the request object
    mockRequest = {
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Happy Path", () => {
    it("should create a poll and return it with a 201 status code", async () => {
      // Arrange
      const mockPollData = {
        title: "New Test Poll",
        options: ["Option 1", "Option 2"],
      };
      const createdPoll = {
        id: "poll-1",
        title: "New Test Poll",
        creator_id: "user-123",
        created_at: new Date().toISOString(),
      };

      (mockRequest.json as jest.Mock).mockResolvedValue(mockPollData);
      mockSupabase.single.mockResolvedValueOnce({
        data: createdPoll,
        error: null,
      });
      mockSupabase.insert.mockResolvedValueOnce({
        data: [{}],
        error: null,
      });

      // Act
      const response = await POST(mockRequest as NextRequest);
      const responseBody = await response.json();

      // Assert
      expect(response.status).toBe(201);
      expect(responseBody).toEqual(createdPoll);

      // Verify the database operations
      expect(mockSupabase.from).toHaveBeenCalledWith("polls");
      expect(mockSupabase.insert).toHaveBeenCalledWith({
        title: "New Test Poll",
        creator_id: "user-123",
      });
      expect(mockSupabase.from).toHaveBeenCalledWith("poll_options");
      expect(mockSupabase.insert).toHaveBeenCalledWith([
        { text: "Option 1", poll_id: "poll-1", order_index: 0 },
        { text: "Option 2", poll_id: "poll-1", order_index: 1 },
      ]);
    });

    it("should handle polls with minimum required fields", async () => {
      // Arrange
      const mockPollData = {
        title: "Minimal Poll",
        options: ["Yes", "No"],
      };
      const createdPoll = {
        id: "poll-minimal",
        title: "Minimal Poll",
        creator_id: "user-123",
      };

      (mockRequest.json as jest.Mock).mockResolvedValue(mockPollData);
      mockSupabase.single.mockResolvedValueOnce({
        data: createdPoll,
        error: null,
      });
      mockSupabase.insert.mockResolvedValueOnce({
        data: [{}],
        error: null,
      });

      // Act
      const response = await POST(mockRequest as NextRequest);

      // Assert
      expect(response.status).toBe(201);
      expect(mockSupabase.auth.getUser).toHaveBeenCalled();
    });
  });

  describe("Validation Errors", () => {
    it("should return a 422 error if the request body is invalid", async () => {
      // Arrange
      const invalidPollData = {
        title: "", // Invalid: empty title
        options: [], // Invalid: no options
      };
      (mockRequest.json as jest.Mock).mockResolvedValue(invalidPollData);

      // Act
      const response = await POST(mockRequest as NextRequest);
      const responseBody = await response.json();

      // Assert
      expect(response.status).toBe(422);
      expect(Array.isArray(responseBody)).toBe(true);
      expect(responseBody.length).toBeGreaterThan(0);

      // Verify that database operations were not called
      expect(mockSupabase.insert).not.toHaveBeenCalled();
    });

    it("should return 422 for missing title", async () => {
      // Arrange
      const invalidData = {
        options: ["Option 1"],
        // title is missing
      };
      (mockRequest.json as jest.Mock).mockResolvedValue(invalidData);

      // Act
      const response = await POST(mockRequest as NextRequest);

      // Assert
      expect(response.status).toBe(422);
    });

    it("should return 422 for insufficient options", async () => {
      // Arrange
      const invalidData = {
        title: "Valid Title",
        options: ["Only One Option"], // Should have at least 2
      };
      (mockRequest.json as jest.Mock).mockResolvedValue(invalidData);

      // Act
      const response = await POST(mockRequest as NextRequest);

      // Assert
      expect(response.status).toBe(422);
    });
  });

  describe("Authentication Errors", () => {
    it("should return 401 if user is not authenticated", async () => {
      // Arrange
      const mockPollData = {
        title: "Test Poll",
        options: ["Option 1", "Option 2"],
      };
      (mockRequest.json as jest.Mock).mockResolvedValue(mockPollData);
      mockSupabase.auth.getUser.mockResolvedValueOnce({
        data: { user: null },
        error: { message: "Not authenticated" },
      });

      // Act
      const response = await POST(mockRequest as NextRequest);

      // Assert
      expect(response.status).toBe(401);
      expect(mockSupabase.insert).not.toHaveBeenCalled();
    });
  });

  describe("Database Errors", () => {
    it("should return 500 error if there is a database error when creating the poll", async () => {
      // Arrange
      const mockPollData = {
        title: "Another Test Poll",
        options: ["Option A", "Option B"],
      };
      const dbError = {
        message: "Database connection failed",
        details: "Connection timeout",
        code: "DB_ERROR",
      };

      (mockRequest.json as jest.Mock).mockResolvedValue(mockPollData);
      mockSupabase.single.mockResolvedValueOnce({
        data: null,
        error: dbError,
      });

      // Act
      const response = await POST(mockRequest as NextRequest);
      const responseText = await response.text();

      // Assert
      expect(response.status).toBe(500);
      expect(responseText).toBe("Error creating poll");
    });

    it("should return 500 error if there is a database error when creating poll options", async () => {
      // Arrange
      const mockPollData = {
        title: "Test Poll",
        options: ["Option 1", "Option 2"],
      };
      const createdPoll = {
        id: "poll-1",
        title: "Test Poll",
        creator_id: "user-123",
      };

      (mockRequest.json as jest.Mock).mockResolvedValue(mockPollData);
      mockSupabase.single.mockResolvedValueOnce({
        data: createdPoll,
        error: null,
      });
      mockSupabase.insert.mockResolvedValueOnce({
        data: null,
        error: { message: "Options insert failed" },
      });

      // Act
      const response = await POST(mockRequest as NextRequest);

      // Assert
      expect(response.status).toBe(500);
    });
  });

  describe("Edge Cases", () => {
    it("should handle malformed JSON in request body", async () => {
      // Arrange
      (mockRequest.json as jest.Mock).mockRejectedValue(
        new Error("Invalid JSON")
      );

      // Act
      const response = await POST(mockRequest as NextRequest);

      // Assert
      expect(response.status).toBe(400);
    });

    it("should handle very long poll titles", async () => {
      // Arrange
      const longTitle = "A".repeat(1000);
      const mockPollData = {
        title: longTitle,
        options: ["Option 1", "Option 2"],
      };
      (mockRequest.json as jest.Mock).mockResolvedValue(mockPollData);

      // Act
      const response = await POST(mockRequest as NextRequest);

      // Assert
      expect(response.status).toBe(422); // Should fail validation
    });

    it("should handle maximum number of poll options", async () => {
      // Arrange
      const maxOptions = Array.from(
        { length: 10 },
        (_, i) => `Option ${i + 1}`
      );
      const mockPollData = {
        title: "Poll with max options",
        options: maxOptions,
      };
      const createdPoll = {
        id: "poll-max",
        title: "Poll with max options",
        creator_id: "user-123",
      };

      (mockRequest.json as jest.Mock).mockResolvedValue(mockPollData);
      mockSupabase.single.mockResolvedValueOnce({
        data: createdPoll,
        error: null,
      });
      mockSupabase.insert.mockResolvedValueOnce({
        data: [{}],
        error: null,
      });

      // Act
      const response = await POST(mockRequest as NextRequest);

      // Assert
      expect(response.status).toBe(201);
    });
  });

  describe("Integration-style Tests", () => {
    it("should successfully create a poll and its options with proper transaction handling", async () => {
      // Arrange
      const mockPollData = {
        title: "Integration Test Poll",
        options: ["Live Option 1", "Live Option 2", "Live Option 3"],
      };
      const createdPoll = {
        id: "poll-integration",
        title: "Integration Test Poll",
        creator_id: "user-123",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      (mockRequest.json as jest.Mock).mockResolvedValue(mockPollData);
      mockSupabase.single.mockResolvedValueOnce({
        data: createdPoll,
        error: null,
      });
      mockSupabase.insert.mockResolvedValueOnce({
        data: [
          { id: "opt-1", text: "Live Option 1", poll_id: "poll-integration" },
          { id: "opt-2", text: "Live Option 2", poll_id: "poll-integration" },
          { id: "opt-3", text: "Live Option 3", poll_id: "poll-integration" },
        ],
        error: null,
      });

      // Act
      const response = await POST(mockRequest as NextRequest);
      const responseBody = await response.json();

      // Assert
      expect(response.status).toBe(201);
      expect(responseBody).toEqual(createdPoll);

      // Verify the complete sequence of database operations
      expect(mockSupabase.auth.getUser).toHaveBeenCalledTimes(1);
      expect(mockSupabase.from).toHaveBeenCalledWith("polls");
      expect(mockSupabase.insert).toHaveBeenCalledWith({
        title: "Integration Test Poll",
        creator_id: "user-123",
      });
      expect(mockSupabase.from).toHaveBeenCalledWith("poll_options");
      expect(mockSupabase.insert).toHaveBeenCalledWith([
        { text: "Live Option 1", poll_id: "poll-integration", order_index: 0 },
        { text: "Live Option 2", poll_id: "poll-integration", order_index: 1 },
        { text: "Live Option 3", poll_id: "poll-integration", order_index: 2 },
      ]);

      // Verify call order
      const fromCalls = mockSupabase.from.mock.calls;
      expect(fromCalls[0][0]).toBe("polls");
      expect(fromCalls[1][0]).toBe("poll_options");
    });
  });
});
