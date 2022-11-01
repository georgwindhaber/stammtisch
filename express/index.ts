import express from "express";
import bodyParser from "body-parser";
import { Client } from "pg";

const app = express();
const port = 3003;

app.use(bodyParser.json());

app.get("/", (req, res) => {
  console.log("new req")
  res.send("hello world");
});

app.get("/login", (req, res) => {});

app.get("/drink", (req, res) => {});

app.listen(port, async () => {
  const dbClient = new Client({ user: "postgres", password: "brogress" });
  await dbClient.connect();

  const res = await dbClient.query("select $1::text as message", [
    "Hello world lletzzzz gooooo",
  ]);
  console.log(res.rows[0].message);

  console.log("listening to routes");
});
