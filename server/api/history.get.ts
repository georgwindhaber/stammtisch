import { H3Event } from "h3";
import { z } from "zod";
import { drinks, paid, rounds, users } from "../database/schema";
import { eq, desc } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const entryLimit = parseInt(query.limit as string, 10) || 10; // Default to 10 if no limit is provided

    const db = useDrizzle();

    const drinksResult = await db
      .select()
      .from(drinks)
      .orderBy(desc(drinks.createdAt))
      .limit(entryLimit);

    const roundsResult = await db
      .select()
      .from(rounds)
      .orderBy(desc(rounds.createdAt))
      .limit(entryLimit);

    const paidResult = await db
      .select()
      .from(paid)
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
