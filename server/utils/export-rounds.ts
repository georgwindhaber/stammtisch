import { drinks, paid, rounds, users } from "../database/schema";
import { useDrizzle } from "./drizzle";
import { eq, sum } from "drizzle-orm";
import { writeFile } from "node:fs/promises";
import { exportSheet, ExportTypes } from "@psych/sheet";
import { format } from "date-fns";

interface GroupedRounds {
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
    userId: users.userId,
    rounds: sum(rounds.value),
  })
  .from(rounds)
  .leftJoin(users, eq(rounds.userId, users.userId))
  .groupBy(users.userId, users.name);

const roundsResult = await useDrizzle()
  .select()
  .from(rounds)
  .leftJoin(users, eq(users.userId, rounds.userId));

const roundsFormatted = roundsResult.map((entry) => {
  return {
    datum: format(entry.rounds.createdAt, "dd.MM.yyyy hh:mm:ss"),
    name: entry.users?.name,
    menge: entry.rounds.value,
    "eingetragen von": entry.rounds.createdBy
      ? findUser(entry.rounds.createdBy)?.name
      : "",
  };
});

await writeFile(
  "./data/rounds.csv",
  exportSheet(roundsFormatted, ExportTypes.CSV),
);

const roundsLegacy = roundsResult.reduce<GroupedRounds>((acc, entry) => {
  const dateString = entry.rounds.createdAt.toISOString();

  if (!acc[dateString]) {
    acc[dateString] = {
      date: dateString,
      members: [],
      guests: [],
      value: entry.rounds.value,
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

const roundsLegacyList = Object.values(roundsLegacy);
const roundsLegacyListFlat = [];

for (const entry of roundsLegacyList) {
  if (entry.value > 0) {
    for (let i = 0; i < entry.value; i++) {
      roundsLegacyListFlat.push({
        datum: format(entry.date, "dd.MM.yyyy hh:mm:ss"),
        members: entry.members.join(", "),
        guests: entry.guests.join(", "),
      });
    }
  } else {
    roundsLegacyListFlat.push({
      datum: format(entry.date, "dd.MM.yyyy hh:mm:ss"),
      members: entry.members.join(", "),
      guests: entry.guests.join(", "),
      "negativ wert": entry.value,
    });
  }
}

console.log(checksum);

await writeFile(
  "./data/rounds-legacy.csv",
  exportSheet(roundsLegacyListFlat, ExportTypes.CSV),
);
