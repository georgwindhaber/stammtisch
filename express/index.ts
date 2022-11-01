import express from "express";
import bodyParser from "body-parser";
import { Client } from "pg";

const app = express();
const port = 3003;

app.use(bodyParser.json());

app.listen(port, async () => {
  const dbClient = new Client({ user: "postgres", password: "brogress" });
  await dbClient.connect();

  app.get("/", (req, res) => {
    res.send("hello world");
  });

  app.get("/login", (req, res) => {});

  app.post("/drinks", async (req, res) => {
    try {
      const dbRes = await dbClient.query(
        `insert into drinks ("drinkTypeId", "userId", "createdAt", "updatedAt") values ($1, $2, $3, $4)`.toLowerCase(),
        [
          req.body.drinkTypeId,
          req.body.userId,
          new Date().toISOString(),
          new Date().toISOString(),
        ]
      );
      res.send(dbRes);
    } catch (error) {
      console.error(error);
    }
  });

  console.log("listening to routes");
});
