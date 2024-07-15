import express from "express";
import { User } from "./models/user.js";
import bcrypt from "bcrypt";
import {
  verifyMail,
  verifyPassword,
  verifyUsername,
} from "./utils/validations.js";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import { SECRET_KEY, SERVER_PORT } from "./utils/config.js";
import path from "path";
import { fileURLToPath } from "url";
import { verifyAuthentication } from "./utils/middleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "register.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.post("/login", async (req, res) => {
  const body = req.body;
  const { keyword, password } = body;
  try {
    const user = await User.findOne({
      where: {
        [Op.or]: [{ username: keyword }, { email: keyword }],
      },
    });

    if (!user) throw new Error("Wrong credentials");
    const comparePassword = await bcrypt.compare(password, user.password);

    if (!comparePassword) throw new Error("Wrong credentials");

    const token = jwt.sign(
      { username: user.username, email: user.email },
      SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    res.json(token);
  } catch (error) {
    const message = error?.message
      ? error.message
      : "An error occurred on the server. Please try again later.";
    res.status(401);
    res.json({ message });
  }
});

app.post("/api/v1/users", async (req, res) => {
  const body = req.body;
  const { username, password, email } = body;
  try {
    verifyUsername(username);
    verifyMail(email);
    verifyPassword(password);

    const usernameExists = await User.findOne({ where: { username } });
    if (usernameExists) throw new Error("Username is already used!");
    const emailExists = await User.findOne({ where: { email } });
    if (emailExists) throw new Error("Email is already used!");

    const hashedPassword = await bcrypt.hashSync(password, 10);
    const user = await User.create({
      username,
      password: hashedPassword,
      email,
    });

    res.json(user);
  } catch (error) {
    const message = error?.message
      ? error.message
      : "An error occurred on the server. Please try again later.";
    res.status(409);
    res.json({ message });
  }
});

app.get("/api/v1/protected/users", verifyAuthentication, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const index = (page - 1) * limit;

  try {
    const users = await User.findAndCountAll({ limit, offset: index });
    const nextPage = Math.ceil(users.count / limit) <= page ? null : page + 1;
    const prevPage = page - 1 === 0 ? null : page - 1;

    res.json({
      current_page: page,
      next_page: nextPage,
      prev_page: prevPage,
      limit,
      total_records: users.count,
      total_page: Math.ceil(users.count / limit),
      data: users.rows,
    });
  } catch (error) {
    const message = error?.message
      ? error.message
      : "An error occurred on the server. Please try again later.";
    res.status(409);
    res.json({ message });
  }
});

app.get("/api/v1/users", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const index = (page - 1) * limit;

  try {
    const users = await User.findAndCountAll({ limit, offset: index });
    const nextPage = Math.ceil(users.count / limit) <= page ? null : page + 1;
    const prevPage = page - 1 === 0 ? null : page - 1;

    res.json({
      current_page: page,
      next_page: nextPage,
      prev_page: prevPage,
      limit,
      total_records: users.count,
      total_page: Math.ceil(users.count / limit),
      data: users.rows,
    });
  } catch (error) {
    const message = error?.message
      ? error.message
      : "An error occurred on the server. Please try again later.";
    res.status(409);
    res.json({ message });
  }
});

app.get("/api/v1/users/:id", async (req, res) => {
  const params = req.params;
  const { id } = params;

  try {
    const user = await User.findOne({
      where: {
        id,
      },
    });
    if (!user) throw new Error("User does not exist");

    res.json(user);
  } catch (error) {
    const message = error?.message
      ? error.message
      : "An error occurred on the server. Please try again later.";
    res.status(409);
    res.json({ message });
  }
});

app.put("/api/v1/users/:id", async (req, res) => {
  const params = req.params;
  const { id } = params;
  const body = req.body;

  try {
    const { username, password, email } = body;
    verifyUsername(username);
    verifyMail(email);
    verifyPassword(password);

    const hashedPassword = await bcrypt.hashSync(password, 10);

    const [user] = await User.update(
      { username, password: hashedPassword, email },
      { where: { id } }
    );
    if (!user) {
      throw new Error("User does not exist.");
    }

    res.json(user);
  } catch (error) {
    const message = error?.message
      ? error.message
      : "An error occurred on the server. Please try again later.";
    res.status(409);
    res.json({ message });
  }
});

app.delete("/api/v1/users/:id", async (req, res) => {
  const params = req.params;
  const { id } = params;

  try {
    const deleted = await User.destroy({ where: { id } });
    if (!deleted) throw new Error("Registry deletion was not performed");
    res.json(deleted);
  } catch (error) {
    const message = error?.message
      ? error.message
      : "An error occurred on the server. Please try again later.";
    res.status(409);
    res.json({ message });
  }
});

app.listen(SERVER_PORT, () => {
  console.log("server running on port", SERVER_PORT);
});
