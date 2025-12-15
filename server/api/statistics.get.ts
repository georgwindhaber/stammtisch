import { drinks, users } from "../database/schema";

import { eq } from "drizzle-orm";

export default defineCachedEventHandler(
  async () => {
    const drinksResult = await useDrizzle()
      .select({
        value: drinks.value,
        name: users.name,
        userId: drinks.userId,
        createdAt: drinks.createdAt,
        role: users.role,
      })
      .from(drinks)
      .leftJoin(users, eq(drinks.userId, users.userId))
      .orderBy(drinks.createdAt);

    return drinksResult.filter(
      (drink) =>
        drink.value !== null &&
        drink.createdAt !== null &&
        drink.userId !== null
    );
  },
  {
    maxAge: 60 * 60 * 24,
  }
);
