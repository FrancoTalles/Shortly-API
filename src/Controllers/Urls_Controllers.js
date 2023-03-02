import { db } from "../Database/databaseConnection.js";
import { nanoid } from "nanoid";

export async function encurtaLinks(req, res) {
  const { url } = res.locals.url;
  const user_id = res.locals.userId;
  const shortUrl = nanoid(8);

  try {
    const inserindo_short_url = await db.query(
      `INSERT INTO urls ("shortUrl", url, "userId") VALUES ($1, $2, $3);`,
      [shortUrl, url, user_id]
    );

    const resgatando_o_id = await db.query(
      `SELECT * FROM urls WHERE "shortUrl" = $1;`,
      [shortUrl]
    );
    const id_pego = resgatando_o_id.rows[0].id;

    const resBody = {
      id: id_pego,
      shortUrl: shortUrl,
    };

    res.status(201).send(resBody);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export async function pegaLinkPeloId(req, res) {
  const { id } = req.params;

  try {
    const procura_url = await db.query(`SELECT * FROM urls WHERE id = $1;`, [
      id,
    ]);

    if (procura_url.rowCount === 0) {
      return res.sendStatus(404);
    }

    const url = procura_url.rows[0];

    const resBody = {
      id: url.id,
      shortUrl: url.shortUrl,
      url: url.url,
    };

    res.status(200).send(resBody);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export async function redirecionaParaLink(req, res) {
  const objUrl = res.locals.url;

  try {
    const contador_novo = objUrl.visitCount + 1;

    const atualiza_contador = db.query(
      `UPDATE urls SET "visitCount" = $1 WHERE id = $2;`,
      [contador_novo, objUrl.id]
    );
    res.redirect(objUrl.url);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export async function deletaLink(req, res) {
  const objUrl = res.locals.url;

  try {
    const deleta_link = await db.query(`DELETE FROM urls WHERE id = $1;`, [
      objUrl.id,
    ]);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export async function pegaDadosDoUser(req, res) {
  const userSession = res.locals.userSession;

  try {
    const query = `SELECT users.id, users.name, CAST(COALESCE(SUM(urls."visitCount"), 0) AS INTEGER) as "visitCount",
    CASE
      WHEN COUNT(urls.id) = 0 THEN json_build_array()
      ELSE json_agg(
        json_build_object(
          'id', urls.id,
          'shortUrl', urls."shortUrl",
          'url', urls.url,
          'visitCount', urls."visitCount"
        )
      )
    END as "shortenedUrls"
    FROM users
    LEFT JOIN urls ON users.id = urls."userId"
    WHERE users.id = $1
    GROUP BY users.id;`;
    const obtendo_dados = await db.query(query, [userSession.userId]);

    res.send(obtendo_dados.rows[0]);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
