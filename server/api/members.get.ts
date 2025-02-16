import { drinks, paid, rounds, users } from "../database/schema";
import { count, eq, isNull, ne, sum } from "drizzle-orm";

export const getAllMembers = async () => {
  const dbResult = await useDrizzle()
    .select({
      name: users.name,
      userId: users.userId,
      drinks: count(drinks.drinkId),
      rounds: count(rounds.roundId),
      paid: sum(paid.value),
    })
    .from(tables.users)
    .leftJoin(drinks, eq(drinks.userId, users.userId))
    .leftJoin(rounds, eq(rounds.userId, users.userId))
    .leftJoin(paid, eq(paid.userId, users.userId))
    .groupBy(users.userId);

  return dbResult.map((row) => ({
    ...row,
    paid: row.paid ?? 0,
  }));
};

export default eventHandler(async () => {
  const result = await getAllMembers();
  return result;
});
