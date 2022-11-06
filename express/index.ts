import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { pool } from "./database/connection";
import { mapToCamelCase } from "./util/helpers";

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
      `select u.user_id, u.username, u.email, count(drink_id) as drink_count
      from users u 
      left join drinks d on d.user_id = u.user_id 
      group by u.user_id
      order by count(drink_id) desc`.toLowerCase()
    );

    dbClient.release();

    if (dbRes) {
      res.send(dbRes.rows.map((item) => mapToCamelCase(item)));
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
      `select drink_id, user_id from drinks where user_id=$1`.toLowerCase(),
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
      `insert into drinks ("drink_type_id", "user_id", "created_at", "updated_at") values ($1, $2, $3, $4)`.toLowerCase(),
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
  console.log("Server is running on port " + port);
});
