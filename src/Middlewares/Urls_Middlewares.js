import { db } from "../Database/databaseConnection.js";

export async function tokenValidation(req, res, next) {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");
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
};

export async function redirectValidation(req, res, next) {
  const { shortUrl } = req.params;

  try {
    const verifica_existencia = await db.query(
      `SELECT * FROM urls WHERE "shortUrl" = $1;`,
      [shortUrl]
    );

    if (!shortUrl || verifica_existencia.rowCount === 0) {
      return res.status(404).send("Url não encontrada");
    }

    res.locals.url = verifica_existencia.rows[0];
  } catch (error) {
    res.status(500).send(error.message);
  }
  next();
};

export async function deleteValidation(req, res, next) {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");
  const id_da_url = req.params.id;

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

    const userId = sessao.rows[0].id;

    const verifica_existencia = await db.query(
      `SELECT * FROM urls WHERE id = $1;`,
      [id_da_url]
    );

    if (verifica_existencia.rowCount === 0) {
      return res.status(404).send("Essa url encurtada não existe");
    }

    const verifica_se_pertence = await db.query(
      `SELECT * FROM urls WHERE "userId" = $1 AND id = $2;`,
      [userId, id_da_url]
    );

    if (verifica_se_pertence.rowCount === 0) {
      return res.status(401).send("Esse shortUrl não pertence a sua conta");
    }

    const objUrl = verifica_se_pertence.rows[0];

    res.locals.url = objUrl;
  } catch (error) {
    res.status(500).send(error.message);
  }
  next();
};

export async function userValidation(req, res, next) {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");

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

    res.locals.userSession = sessao.rows[0];
  } catch (error) {
    res.status(500).send(error.message);
  }
  next();
};
