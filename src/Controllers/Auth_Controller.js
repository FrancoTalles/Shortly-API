import { db } from "../Database/databaseConnection.js";
import bcrypt from "bcrypt";
import { v4 as uuidV4 } from "uuid";

export async function criarClientes(req, res) {
  const { name, email, password } = req.body;

  try {
    const email_existente = await db.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );

    if (email_existente.rowCount >= 1) {
      return res.sendStatus(409);
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    console.log(passwordHash);

    const user = await db.query(
      `INSERT INTO users (name, email, password) VALUES ($1, $2, $3);`,
      [name, email, passwordHash]
    );

    res.sendStatus(201);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
