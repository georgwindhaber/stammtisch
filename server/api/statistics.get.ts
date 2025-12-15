import { drinks, users } from "../database/schema";

import { eq } from "drizzle-orm";

export default eventHandler(async () => {
  const drinksResult = await useDrizzle()
    .select({
      value: drinks.value,
      name: users.name,
      userId: drinks.userId,
      createdAt: drinks.createdAt,
    })
    .from(drinks)
    .leftJoin(users, eq(drinks.userId, users.userId))
    .orderBy(drinks.createdAt);

  return drinksResult.filter(
    (drink) =>
      drink.value !== null && drink.createdAt !== null && drink.userId !== null
  );
});
