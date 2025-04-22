import { z } from "zod";
import { drinks, paid, rounds } from "../database/schema";
import { getAllMembers } from "./members.get";
import { getServerSession } from "#auth";

const querySchema = z.object({
  role: z.enum(["member", "guest"]),
});

const bodySchema = z.object({
  users: z.array(z.number()),
  value: z.number(),
  mode: z.enum(["drinks", "paid", "rounds"]),
});

export default eventHandler(async (event) => {
  const query = await getValidatedQuery(event, querySchema.parse);
  const body = await readValidatedBody(event, bodySchema.parse);
  const session = await getServerSession(event);

  const table =
    body.mode === "drinks" ? drinks : body.mode === "paid" ? paid : rounds;

  await useDrizzle()
    .insert(table)
    .values(
      body.users.map((user) => ({
        userId: user,
        value: body.value,
        createdAt: new Date(),
        createdBy: session?.user?.userId || null,
      }))
    );

  return getAllMembers(query.role);
});
