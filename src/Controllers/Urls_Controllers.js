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

    const resgatando_o_id = await db.query(`SELECT * FROM urls WHERE "shortUrl" = $1;`, [shortUrl]);
    console.log(resgatando_o_id);
    const id_pego = resgatando_o_id.rows[0].id;

    const resBody = {
      id: id_pego,
      shortUrl: shortUrl
    };

    res.status(201).send(resBody);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
