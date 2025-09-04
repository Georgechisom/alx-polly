import { deletePoll } from "./poll-actions";
import { createSupabaseServerClient, getCurrentUser } from "../supabase/utils";

// Mock the server client
jest.mock("../supabase/utils", () => ({
  createSupabaseServerClient: jest.fn(),
  getCurrentUser: jest.fn(),
}));

const mockedGetCurrentUser = getCurrentUser as jest.MockedFunction<
  typeof getCurrentUser
>;

const mockSupabaseClient = {
  from: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
};

describe("Poll Actions", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("deletePoll", () => {
    beforeEach(() => {
      (createSupabaseServerClient as jest.Mock).mockResolvedValue(
        mockSupabaseClient
      );
      mockedGetCurrentUser.mockResolvedValue({
        id: "user-123",
        app_metadata: {},
        user_metadata: {},
        aud: "authenticated",
        created_at: "2023-01-01T00:00:00.000Z"
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);
    });

    it("should successfully delete a poll", async () => {
      // Arrange
      const pollId = "some-poll-id";
      mockSupabaseClient.eq.mockResolvedValueOnce({ error: null });

      // Act
      const result = await deletePoll(pollId);

      // Assert
      expect(mockSupabaseClient.from).toHaveBeenCalledWith("polls");
      expect(mockSupabaseClient.delete).toHaveBeenCalled();
      expect(mockSupabaseClient.eq).toHaveBeenCalledWith("id", pollId);
      expect(result).toEqual({ success: true });
    });

    it("should return an error if deletion fails", async () => {
      // Arrange
      const pollId = "some-poll-id";
      const errorMessage = "Failed to delete";
      mockSupabaseClient.eq.mockResolvedValueOnce({
        error: { message: errorMessage },
      });

      // Act
      const result = await deletePoll(pollId);
      // Assert
      expect(result).toEqual({ success: false, error: errorMessage });
    });
  });
});
