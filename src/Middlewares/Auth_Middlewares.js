import { db } from "../Database/databaseConnection.js";
import bcrypt from "bcrypt";

export async function loginValidation(req, res, next) {
  const { email, password } = req.body;

  try {
    const usuario_existe = await db.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );
    const user = usuario_existe.rows[0];

    if (
      usuario_existe.rowCount === 0 ||
      !bcrypt.compareSync(password, user.password)
    ) {
      return res.sendStatus(401);
    }

    res.locals.user = user;

    next();
  } catch (error) {
    res.status(500).send(error.message);
  }
}
