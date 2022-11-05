import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { Client, Pool } from "pg";
import { pool } from "./database/connection";

const app = express();
const port = 3003;

app.use(bodyParser.json());
app.use(cors({ origin: ["http://localhost:3000"] }));

app.get("/", (req, res) => {
  res.send("hello world");
});

app.get("/login", (req, res) => {});

app.get("/users", async (req, res) => {
  try {
    const dbClient = await pool.connect();
    const dbRes = await dbClient.query(
      `select u.userId, u.userName as "userName", u.email, count(drinkId) as drinkCount
      from users u 
      left join drinks d on d.userId = u.userId 
      group by u.userId
      order by count(drinkId) desc`.toLowerCase()
    );

    dbClient.release();

    if (dbRes) {
      res.send(dbRes.rows);
    } else {
      res.send({
        status: "error",
        code: 500,
        message: "Something unexpected happened querying the user data",
      });
    }
  } catch (error) {
    console.error(error);
  }
});

app.get("/drinks", async (req, res) => {
  try {
    const dbClient = await pool.connect();
    const dbRes = await dbClient.query(
      `select "drinkid", ", "userid" from drinks where userid=$1`.toLowerCase(),
      [req.query.user]
    );

    dbClient.release();

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

app.post("/drinks", async (req, res) => {
  try {
    const dbClient = await pool.connect();
    const dbRes = await dbClient.query(
      `insert into drinks ("drinkTypeId", "userId", "createdAt", "updatedAt") values ($1, $2, $3, $4)`.toLowerCase(),
      [
        req.body.drinkTypeId,
        req.body.userId,
        new Date().toISOString(),
        new Date().toISOString(),
      ]
    );

    dbClient.release();

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

app.listen(port, async () => {
  console.log("listening to routes");
});
