import { paid, users } from "../database/schema";
import { useDrizzle } from "./drizzle";
import { eq, sum } from "drizzle-orm";
import { writeFile } from "node:fs/promises";
import { exportSheet, ExportTypes } from "@psych/sheet";
import { format } from "date-fns";

const usersResult = await useDrizzle().select().from(users);

const findUser = (userId: number) => {
  return usersResult.find((user) => user.userId === userId);
};

const checksum = await useDrizzle()
  .select({
    name: users.name,
    userId: users.userId,
    paid: sum(paid.value),
  })
  .from(users)
  .leftJoin(paid, eq(paid.userId, users.userId))
  .groupBy(users.userId, users.name);

const paidResult = await useDrizzle()
  .select()
  .from(paid)
  .leftJoin(users, eq(users.userId, paid.userId));

const paidFormatted = paidResult.map((entry) => {
  return {
    datum: format(entry.paid.createdAt, "dd.MM.yyyy hh:mm:ss"),
    name: entry.users?.name,
    menge: entry.paid.value,
    "eingetragen von": entry.paid.createdBy
      ? findUser(entry.paid.createdBy)?.name
      : "",
  };
});

await writeFile("./data/paid.csv", exportSheet(paidFormatted, ExportTypes.CSV));

const paidFormattedLegacy = paidResult.map((entry) => {
  return {
    Zeitstempel: format(entry.paid.createdAt, "dd.MM.yyyy hh:mm:ss"),
    "Hannes Apfelbacher":
      entry.users?.name === "Hannes Apfelbacher" ? entry.paid.value : "",
    "Christian Rinnhofer":
      entry.users?.name === "Christian Rinnhofer" ? entry.paid.value : "",
    "Roman Froihofer":
      entry.users?.name === "Roman Froihofer" ? entry.paid.value : "",
    "Hannes Buchebner":
      entry.users?.name === "Hannes Buchebner" ? entry.paid.value : "",
    "Markus Buchebner":
      entry.users?.name === "Markus Buchebner" ? entry.paid.value : "",
    "Matthias Meierhofer":
      entry.users?.name === "Matthias Meierhofer" ? entry.paid.value : "",
    "Philipp Paier":
      entry.users?.name === "Philipp Paier" ? entry.paid.value : "",
    "Gast Name": entry.users?.role === "guest" ? entry.users.name : "",
    "Gast Bezahlt": entry.users?.role === "guest" ? entry.paid.value : "",
  };
});

await writeFile(
  "./data/paid-legacy.csv",
  exportSheet(paidFormattedLegacy, ExportTypes.CSV),
);

console.log(checksum.filter((e) => e.paid));
