import { sum } from "drizzle-orm";
import { drinks, users } from "../database/schema";
import { getAllMembers } from "./members.get";

export default eventHandler(async () => {
  return await useDrizzle()
    .select({ value: sum(drinks.value), role: users.role })
    .from(users)
    .leftJoin(drinks, eq(drinks.userId, users.userId))
    .groupBy(users.role);
});
