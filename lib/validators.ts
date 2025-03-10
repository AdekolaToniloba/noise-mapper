import { z } from "zod";

export const NoiseReportSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  decibels: z.number().min(0).max(150),
});
