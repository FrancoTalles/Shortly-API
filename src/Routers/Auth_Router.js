import { Router } from "express";
import { criarClientes } from "../Controllers/Auth_Controller.js";

import { validateSchema } from "../Middlewares/validateSchema.js";
import { signUp_schema } from "../Schemas/Auth_Schema.js";

const AuthRouter = Router();

AuthRouter.post("/signup", validateSchema(signUp_schema), criarClientes);

export default AuthRouter;

