import { aliasedTable, sum } from "drizzle-orm";
import { users, drinks, rounds, paid } from "../database/schema";
import { asc, desc } from "drizzle-orm";
import { unionAll } from "drizzle-orm/sqlite-core";

export default eventHandler(async () => {
  const drinker = aliasedTable(users, "drinker");
  const drinksQuery = useDrizzle()
    .select({
      value: drinks.value,
      name: drinker.name,
      userId: drinks.userId,
      createdBy: users.name,
    })
    .from(drinks)
    .leftJoin(drinker, eq(drinks.userId, drinker.userId))
    .leftJoin(users, eq(drinks.createdBy, users.userId))
    .orderBy(desc(drinks.createdAt))
    .limit(10);

  const rounder = aliasedTable(users, "drinker");
  const roundsQuery = useDrizzle()
    .select({
      value: rounds.value,
      name: rounder.name,
      userId: rounds.userId,
      createdBy: users.name,
    })
    .from(rounds)
    .leftJoin(rounder, eq(rounds.userId, rounder.userId))
    .leftJoin(users, eq(rounds.createdBy, users.userId))
    .orderBy(desc(rounds.createdAt))
    .limit(10);

  const payer = aliasedTable(users, "payer");
  const payersQuery = useDrizzle()
    .select({
      value: paid.value,
      name: payer.name,
      userId: paid.userId,
      createdBy: users.name,
    })
    .from(paid)
    .leftJoin(payer, eq(paid.userId, payer.userId))
    .leftJoin(users, eq(paid.createdBy, users.userId))
    .orderBy(desc(paid.createdAt))
    .limit(10);

  return await unionAll(drinksQuery, payersQuery, roundsQuery);
});
