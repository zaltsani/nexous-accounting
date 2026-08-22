import z from "zod";

export const baseJournalSchema = z.object({
  code: z.string(),
  name: z.string(),
});

export const journalSchema = baseJournalSchema;
export const createJournalSchema = baseJournalSchema;
export const updateJournalSchema = createJournalSchema.partial();

export type IBaseJournal = z.infer<typeof baseJournalSchema>;
export type IJournal = z.infer<typeof journalSchema>;
export type ICreateJournal = z.infer<typeof createJournalSchema>;
export type IUpdateJournal = z.infer<typeof updateJournalSchema>;
