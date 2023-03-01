import { Router } from "express";
import {
  encurtaLinks,
  pegaLinkPeloId,
  redirecionaParaLink,
} from "../Controllers/Urls_Controllers.js";
import {
  redirectValidation,
  tokenValidation,
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

export default UrlRouter;
