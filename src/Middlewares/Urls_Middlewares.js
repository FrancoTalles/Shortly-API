import { db } from "../Database/databaseConnection.js";

export async function tokenValidation(req, res, next) {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");
  console.log(token)
  const url = req.body;

  if (!token) {
    return res.status(401).send("Token não valido");
  }

  try {
    const sessao = await db.query(`SELECT * FROM sessions WHERE token = $1;`, [
      token,
    ]);

    if (sessao.rowCount === 0) {
      return res
        .status(401)
        .send("Você precisa estar logado para acessar essa funcionalidade");
    }

    const user_id = sessao.rows[0].userId;

    res.locals.url = url;
    res.locals.userId = user_id;
  } catch (error) {
    res.status(500).send(error.message);
  }

  next();
}
