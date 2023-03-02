import { Router } from "express";
import {
  deletaLink,
  encurtaLinks,
  formaRanking,
  pegaDadosDoUser,
  pegaLinkPeloId,
  redirecionaParaLink,
} from "../Controllers/Urls_Controllers.js";
import {
  deleteValidation,
  redirectValidation,
  tokenValidation,
  userValidation,
} from "../Middlewares/Urls_Middlewares.js";
import { validateSchema } from "../Middlewares/validateSchema.js";
import { url_schema } from "../Schemas/Url_Schema.js";

const UrlRouter = Router();

UrlRouter.post(
  "/urls/shorten",
  validateSchema(url_schema),
  tokenValidation,
  encurtaLinks
);
UrlRouter.get("/urls/:id", pegaLinkPeloId);
UrlRouter.get("/urls/open/:shortUrl", redirectValidation, redirecionaParaLink);
UrlRouter.delete("/urls/:id", deleteValidation, deletaLink);
UrlRouter.get("/users/me", userValidation, pegaDadosDoUser);
UrlRouter.get("/ranking", formaRanking);

export default UrlRouter;
