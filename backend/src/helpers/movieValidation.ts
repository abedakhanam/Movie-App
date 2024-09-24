import { z } from "zod";

// Movie creation validation schema
export const createMovieSchema = z.object({
  name: z.string().min(1, "Name must have at least 1 character").max(100),
  releaseYear: z.number().min(1880).max(new Date().getFullYear()),
  rating: z.number().min(0).max(10).optional(),
  votes: z.number().min(0).optional(),
  duration: z.number().positive().optional(),
  type: z.string().max(50).optional(),
  certificate: z.string().max(10).optional(),
  description: z.string().max(1000).optional(),

  genres: z.array(z.number().positive())
    .nonempty("At least one genre must be selected"),
});

// Movie update validation schema
export const updateMovieSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  releaseYear: z.number().min(1880).max(new Date().getFullYear()).optional(),
  rating: z.number().min(0).max(10).optional(),
  votes: z.number().min(0).optional(),
  duration: z.number().positive().optional(),
  type: z.string().max(50).optional(),
  certificate: z.string().max(10).optional(),
  description: z.string().max(1000).optional(),

  genres: z.array(z.number().positive()).optional(),
});
