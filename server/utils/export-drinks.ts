import { drinks, paid, rounds, users } from "../database/schema";
import { useDrizzle } from "./drizzle";
import { eq, sum } from "drizzle-orm";
import { writeFile } from "node:fs/promises";
import { exportSheet, ExportTypes } from "@psych/sheet";
import { format } from "date-fns";

interface GroupedDrinks {
  [date: string]: {
    date: string;
    members: Array<string>;
    guests: Array<string>;
    value: number;
  };
}

const usersResult = await useDrizzle().select().from(users);

const findUser = (userId: number) => {
  return usersResult.find((user) => user.userId === userId);
};

const checksum = await useDrizzle()
  .select({
    name: users.name,
    role: users.role,
    userId: users.userId,
    drinks: sum(drinks.value),
  })
  .from(users)
  .leftJoin(drinks, eq(drinks.userId, users.userId))
  .where(eq(users.role, "member"))
  .groupBy(users.userId, users.name);

const drinksResult = await useDrizzle()
  .select()
  .from(drinks)
  .leftJoin(users, eq(users.userId, drinks.userId));

const drinksFormatted = drinksResult.map((entry) => {
  return {
    datum: format(entry.drinks.createdAt, "dd.MM.yyyy hh:mm:ss"),
    name: entry.users?.name,
    menge: entry.drinks.value,
    "eingetragen von": entry.drinks.createdBy
      ? findUser(entry.drinks.createdBy)?.name
      : "",
  };
});

await writeFile(
  "./data/drinks.csv",
  exportSheet(drinksFormatted, ExportTypes.CSV),
);

const drinksLegacy = drinksResult.reduce<GroupedDrinks>((acc, entry) => {
  const dateString = entry.drinks.createdAt.toISOString();

  if (!acc[dateString]) {
    acc[dateString] = {
      date: dateString,
      members: [],
      guests: [],
      value: entry.drinks.value,
    };
  }

  if (entry.users?.role === "member") {
    acc[dateString].members.push(entry.users.name);
  }
  if (entry.users?.role === "guest") {
    acc[dateString].guests.push(entry.users.name);
  }

  return acc;
}, {});

const drinksLegacyList = Object.values(drinksLegacy);
const drinksLegacyListFlat = [];

for (const entry of drinksLegacyList) {
  if (entry.value > 0) {
    for (let i = 0; i < entry.value; i++) {
      drinksLegacyListFlat.push({
        datum: format(entry.date, "dd.MM.yyyy hh:mm:ss"),
        members: entry.members.join(", "),
        guests: entry.guests.join(", "),
      });
    }
  } else {
    drinksLegacyListFlat.push({
      datum: format(entry.date, "dd.MM.yyyy hh:mm:ss"),
      members: entry.members.join(", "),
      guests: entry.guests.join(", "),
      "negativ wert": entry.value,
    });
  }
}

console.log(checksum);

await writeFile(
  "./data/paid-legacy.csv",
  exportSheet(drinksLegacyListFlat, ExportTypes.CSV),
);
