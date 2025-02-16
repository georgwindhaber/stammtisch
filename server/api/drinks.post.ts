import { z } from "zod";
import { drinks } from "../database/schema";
import { getAllMembers } from "./members.get";

const bodySchema = z.object({
  users: z.array(z.number()),
  value: z.number(),
});

export default eventHandler(async (event) => {
  const body = await readValidatedBody(event, bodySchema.parse);

  await useDrizzle()
    .insert(drinks)
    .values(
      body.users.map((user) => ({
        userId: user,
        value: body.value,
        createdAt: new Date(),
      }))
    );

  return getAllMembers();
});
