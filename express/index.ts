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

  app.get("/users",async (req, res) => {
    try {
      const dbRes = await dbClient.query(
        `select userId, email, username from users`.toLowerCase(),
      );
      if (dbRes) {
        res.send(dbRes.rows);
      } else {
        res.send({
          status: "error",
          code: 500,
          message: "Something unexpected happened selecting user",
        });
      }
    } catch (error) {
      console.error(error);
    }
  })

  app.get("/scores", async (req, res) => {
    try {
      const dbRes = await dbClient.query(
        `select userId, count(drinkId) from drinks group by userId`.toLowerCase(),
      );
      if (dbRes) {
        res.send(dbRes.rows);
      } else {
        res.send({
          status: "error",
          code: 500,
          message: "Something unexpected happened inserting the new drink",
        });
      }
    } catch (error) {
      console.error(error);
    }
  });

  app.get("/drinks", async (req, res) => {
    try {
      const dbRes = await dbClient.query(
        `select "drinkid", ", "userid" from drinks where userid=$1`.toLowerCase(), [req.query.user]
      );
      if (dbRes) {
        res.send(dbRes.rows);
      } else {
        res.send({
          status: "error",
          code: 500,
          message: "Something unexpected happened inserting the new drink",
        });
      }
    } catch (error) {
      console.error(error);
    }
  })

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
      if (dbRes) {
        res.send({ status: "success", code: 200, message: "Success" });
      } else {
        res.send({
          status: "error",
          code: 500,
          message: "Something unexpected happened inserting the new drink",
        });
      }
    } catch (error) {
      console.error(error);
    }
  });

  console.log("listening to routes");
});
