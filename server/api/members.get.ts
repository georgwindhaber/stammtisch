import { drinks, paid, rounds, users } from "../database/schema";
import { count, eq, isNull, ne, sum } from "drizzle-orm";

const joinArrays = (arr1, arr2, key) => {
  return arr1
    .map((obj1) => {
      const matchingObj = arr2.find((obj2) => obj2[key] === obj1[key]);
      return { ...obj1, ...matchingObj };
    })
    .filter((obj) => obj[key] !== undefined);
};

export const getAllMembers = async () => {
  const drinksRequest = useDrizzle()
    .select({
      name: users.name,
      userId: users.userId,
      drinks: sum(drinks.value),
    })
    .from(tables.users)
    .leftJoin(drinks, eq(drinks.userId, users.userId))
    .groupBy(users.userId, users.name);

  const paidRequest = useDrizzle()
    .select({
      name: users.name,
      userId: users.userId,
      paid: sum(paid.value),
    })
    .from(tables.users)
    .leftJoin(paid, eq(paid.userId, users.userId))
    .groupBy(users.userId, users.name);

  const roundsRequest = useDrizzle()
    .select({
      name: users.name,
      userId: users.userId,
      rounds: sum(rounds.value),
    })
    .from(tables.users)
    .leftJoin(rounds, eq(rounds.userId, users.userId))
    .groupBy(users.userId, users.name);

  const [drinksData, paidData, roundsData] = await Promise.all([
    drinksRequest,
    paidRequest,
    roundsRequest,
  ]);

  const drinksAndPaid = joinArrays(drinksData, paidData, "userId");
  const allData = joinArrays(drinksAndPaid, roundsData, "userId");

  return allData;
};

export default eventHandler(async () => {
  const result = await getAllMembers();
  return result;
});
