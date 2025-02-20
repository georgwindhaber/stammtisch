import { z } from "zod";
import { drinks, paid, rounds, users } from "../database/schema";
import { getAllMembers } from "./members.get";

const bodySchema = z.object({
  name: z.string(),
});

export default eventHandler(async (event) => {
  const body = await readValidatedBody(event, bodySchema.parse);

  await useDrizzle()
    .insert(users)
    .values({ name: body.name, createdAt: new Date(), updatedAt: new Date() });

  return getAllMembers("guest");
});
