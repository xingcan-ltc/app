import { z } from "zod";
import { zMinUser } from "./User";
import { zGroup } from "./Group";
import { zNullableDateColumn } from "./DateColumn";

export const zMentorship = z.object({
  id: z.string(),
  endedAt: zNullableDateColumn,
  mentor: zMinUser,
  mentee: zMinUser,
  group: zGroup,
});
export type Mentorship = z.TypeOf<typeof zMentorship>;

export function isValidMentorshipIds(menteeId: string | null, mentorId: string | null) {
  return z.string().uuid().safeParse(menteeId).success
    && z.string().uuid().safeParse(mentorId).success
    && menteeId !== mentorId;
}
