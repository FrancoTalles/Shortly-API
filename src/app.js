// Importações

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Configurações

dotenv.config();
const server = express();
server.use(cors());
server.use(express.json());

// Rotas

// Porta

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`Server rodando na porta: ${port}`));
