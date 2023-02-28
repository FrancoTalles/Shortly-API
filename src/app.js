// Importações

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import AuthRouter from "./Routers/Auth_Router.js";
import UrlRouter from "./Routers/Urls_Router.js";

// Configurações

dotenv.config();
const server = express();
server.use(cors());
server.use(express.json());

// Rotas
server.use([AuthRouter, UrlRouter]);
// Porta

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`Server rodando na porta: ${port}`));
