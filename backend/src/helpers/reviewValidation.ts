import { z } from "zod";

const reviewSchema = z.object({
  userID: z.number().int().positive("Invalid user ID"),
  movieID: z.number().int().positive("Invalid movie ID"),
  rating: z
    .number()
    .int()
    .min(1, "Rating must be at least 1")
    .max(10, "Rating cannot be more than 10")
    .optional()
    .nullable(),
  review: z.string().optional(),
  createdAt: z.date().optional(),
});

export default reviewSchema;
