import jwt from "jsonwebtoken";
import { SECRET_KEY } from "./config.js";

export const verifyAuthentication = async (req, res, next) => {
  const token = req.headers?.authorization;

  if (!token) {
    return res.status(401).send("Access denied you need to be logged in");
  }
  const user = jwt.verify(token, SECRET_KEY);

  if (!user)
    return res.status(401).send("Access denied you need to be logged in");

  next();
};
