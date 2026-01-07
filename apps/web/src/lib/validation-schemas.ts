import { z } from 'zod';
import { MIN_CHARS, RATING } from '@/lib/constants';

// Rating schema: 1-10 integer, no decimals, no zero
export const RatingSchema = z
  .number()
  .int('Rating must be an integer')
  .min(RATING.MIN, `Rating must be at least ${RATING.MIN}`)
  .max(RATING.MAX, `Rating must be at most ${RATING.MAX}`);

// Pillar audit schema (used for all 4 pillars)
export const PillarAuditSchema = z.object({
  rating: RatingSchema,
  habits: z.string().min(MIN_CHARS.HABITS, `Habits description must be at least ${MIN_CHARS.HABITS} characters`),
  hours: z.number().optional(),
  minutes: z.number().optional(),
  patterns: z.string().optional(),
  routines: z.string().optional(),
});

// Energy drains schema
export const EnergyDrainsSchema = z.object({
  biggest_drain: z.string().min(MIN_CHARS.DRAIN, `Biggest drain must be at least ${MIN_CHARS.DRAIN} characters`),
  impact: z.string().min(MIN_CHARS.IMPACT, `Impact description must be at least ${MIN_CHARS.IMPACT} characters`),
  peak_times: z.string().min(MIN_CHARS.TIMES, `Peak times must be at least ${MIN_CHARS.TIMES} characters`),
  crash_times: z.string().min(MIN_CHARS.TIMES, `Crash times must be at least ${MIN_CHARS.TIMES} characters`),
});

// Energy protocols schema (4 commitments)
export const EnergyProtocolsSchema = z.object({
  sleep_commitment: z.string().min(MIN_CHARS.COMMITMENT, `Sleep commitment must be at least ${MIN_CHARS.COMMITMENT} characters`),
  food_commitment: z.string().min(MIN_CHARS.COMMITMENT, `Food commitment must be at least ${MIN_CHARS.COMMITMENT} characters`),
  movement_commitment: z.string().min(MIN_CHARS.COMMITMENT, `Movement commitment must be at least ${MIN_CHARS.COMMITMENT} characters`),
  brain_commitment: z.string().min(MIN_CHARS.COMMITMENT, `Brain commitment must be at least ${MIN_CHARS.COMMITMENT} characters`),
});

// First win schema
export const FirstWinSchema = z.object({
  action: z.string().min(MIN_CHARS.FIRST_WIN, `First Win action must be at least ${MIN_CHARS.FIRST_WIN} characters`),
  timeframe: z.string().min(MIN_CHARS.TIMES, `Timeframe must be at least ${MIN_CHARS.TIMES} characters`),
  accountability_partner: z.string().min(MIN_CHARS.PARTNER, `Accountability partner name must be at least ${MIN_CHARS.PARTNER} characters`),
});

// Complete tool data schema
export const EnergyToolDataSchema = z.object({
  audit: z.object({
    sleep: PillarAuditSchema,
    food: PillarAuditSchema,
    movement: PillarAuditSchema,
    brain: PillarAuditSchema,
  }),
  drains: EnergyDrainsSchema,
  protocols: EnergyProtocolsSchema,
  first_win: FirstWinSchema,
});

// Submission request schema (for POST /api/submissions/submit)
export const SubmissionRequestSchema = z.object({
  userId: z.string().email('Invalid email format'),
  userName: z.string().min(1).max(100, 'Name must be 1-100 characters'),
  companyId: z.string().min(1).max(50, 'Company ID must be 1-50 characters'),
  companyName: z.string().max(100).optional(),
  sprintNumber: z.string().optional(),
  toolData: EnergyToolDataSchema,
});

// Type exports for TypeScript
export type SubmissionRequest = z.infer<typeof SubmissionRequestSchema>;
export type EnergyToolData = z.infer<typeof EnergyToolDataSchema>;
export type PillarAudit = z.infer<typeof PillarAuditSchema>;
export type EnergyDrains = z.infer<typeof EnergyDrainsSchema>;
export type EnergyProtocols = z.infer<typeof EnergyProtocolsSchema>;
export type FirstWin = z.infer<typeof FirstWinSchema>;

