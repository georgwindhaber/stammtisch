import { drinks, paid, rounds, users } from "../database/schema";
import { eq, desc, aliasedTable, gte, lt } from "drizzle-orm";
import { z } from "zod";

// Zod schema for query parameters
const querySchema = z.object({
  timeframeMs: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().positive())
    .optional()
    .default(String(7 * 24 * 60 * 60 * 1000)), // Default to 1 week in milliseconds
  offset: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().nonnegative())
    .optional()
    .default("0"),
});

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const { timeframeMs, offset } = querySchema.parse(query);

    const db = useDrizzle();
    const createdByAlias = aliasedTable(users, "createdBy");

    // Calculate the date range for the requested period
    // offset=0: now - timeframeMs to now (current period)
    // offset=1: now - 2*timeframeMs to now - timeframeMs (previous period)
    const now = Date.now();
    const endDate = new Date(now - offset * timeframeMs);
    const startDate = new Date(now - (offset + 1) * timeframeMs);

    const drinksResult = await db
      .select({
        value: drinks.value,
        entryId: drinks.drinkId,
        createdAt: drinks.createdAt,
        userName: users.name,
        createdByName: createdByAlias.name,
      })
      .from(drinks)
      .leftJoin(users, eq(drinks.userId, users.userId))
      .leftJoin(createdByAlias, eq(drinks.createdBy, createdByAlias.userId))
      .where(
        and(gte(drinks.createdAt, startDate), lt(drinks.createdAt, endDate)),
      )
      .orderBy(desc(drinks.createdAt));

    const roundsResult = await db
      .select({
        value: rounds.value,
        entryId: rounds.roundId,
        createdAt: rounds.createdAt,
        userName: users.name,
        createdByName: createdByAlias.name,
      })
      .from(rounds)
      .leftJoin(users, eq(rounds.userId, users.userId))
      .leftJoin(createdByAlias, eq(rounds.createdBy, createdByAlias.userId))
      .where(
        and(gte(rounds.createdAt, startDate), lt(rounds.createdAt, endDate)),
      )
      .orderBy(desc(rounds.createdAt));

    const paidResult = await db
      .select({
        value: paid.value,
        entryId: paid.paidId,
        createdAt: paid.createdAt,
        userName: users.name,
        createdByName: createdByAlias.name,
      })
      .from(paid)
      .leftJoin(users, eq(paid.userId, users.userId))
      .leftJoin(createdByAlias, eq(paid.createdBy, createdByAlias.userId))
      .where(and(gte(paid.createdAt, startDate), lt(paid.createdAt, endDate)))
      .orderBy(desc(paid.createdAt));

    return { drinks: drinksResult, rounds: roundsResult, paid: paidResult };
  } catch (error) {
    console.error("Error fetching history:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
