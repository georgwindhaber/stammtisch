import { z } from "zod";
import { drinks, paid, rounds } from "../database/schema";
import { getAllMembers } from "./members.get";
import { getServerSession } from "#auth";
import { eq } from "drizzle-orm";

const bodySchema = z.object({
  entityId: z.number(),
  mode: z.enum(["drinks", "paid", "rounds"]),
});

export default eventHandler(async (event) => {
  const body = await readValidatedBody(event, bodySchema.parse);
  const session = await getServerSession(event);

  const table =
    body.mode === "drinks" ? drinks : body.mode === "paid" ? paid : rounds;

  const id =
    body.mode === "drinks"
      ? drinks.drinkId
      : body.mode === "paid"
        ? paid.paidId
        : rounds.roundId;

  await useDrizzle().delete(table).where(eq(id, body.entityId));
});
