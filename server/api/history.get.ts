import { drinks, paid, rounds, users } from "../database/schema";
import { eq, desc, aliasedTable } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const entryLimit = parseInt(query.limit as string, 10) || 10; // Default to 10 if no limit is provided

    const db = useDrizzle();
    const createdByAlias = aliasedTable(users, "createdBy");

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
      .orderBy(desc(drinks.createdAt))
      .limit(entryLimit);

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
      .orderBy(desc(rounds.createdAt))
      .limit(entryLimit);

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
      .orderBy(desc(paid.createdAt))
      .limit(entryLimit);

    return { drinks: drinksResult, rounds: roundsResult, paid: paidResult };
  } catch (error) {
    console.error("Error fetching history:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
