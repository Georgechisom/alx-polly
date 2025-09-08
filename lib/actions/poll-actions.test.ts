import { deletePoll } from "@/lib/actions/poll-actions";
import { supabase } from "@/lib/supabase/client";

// Mock Supabase client
jest.mock("@/lib/supabase/client", () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
  },
}));

describe("Poll Actions", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("deletePoll", () => {
    it("should successfully delete a poll", async () => {
      // Arrange
      const pollId = "some-poll-id";
      const from = supabase.from as jest.Mock;
      const deleteMock = from().delete as jest.Mock;
      const eq = deleteMock().eq as jest.Mock;

      eq.mockResolvedValueOnce({ error: null });

      // Act
      const result = await deletePoll(pollId);

      // Assert
      expect(from).toHaveBeenCalledWith("polls");
      expect(deleteMock).toHaveBeenCalled();
      expect(eq).toHaveBeenCalledWith("id", pollId);
      expect(result).toEqual({ success: true });
    });

    it("should return an error if deletion fails", async () => {
      // Arrange
      const pollId = "some-poll-id";
      const from = supabase.from as jest.Mock;
      const deleteMock = from().delete as jest.Mock;
      const eq = deleteMock().eq as jest.Mock;
      const errorMessage = "Failed to delete";

      eq.mockResolvedValueOnce({ error: { message: errorMessage } });

      // Act
      const result = await deletePoll(pollId);

      // Assert
      expect(result).toEqual({ success: false, error: errorMessage });
    });
  });
});
