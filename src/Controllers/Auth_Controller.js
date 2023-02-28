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

    const user = await db.query(
      `INSERT INTO users (name, email, password) VALUES ($1, $2, $3);`,
      [name, email, passwordHash]
    );

    res.sendStatus(201);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function logarCliente(req, res) {
  const user = res.locals.user;
  const token = uuidV4();
  const sendBody = { token: token };

  try {
    const sessao = await db.query(
      `INSERT INTO sessions ("userId", token) VALUES ($1, $2);`,
      [user.id, token]
    );

    res.status(200).send(sendBody);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
