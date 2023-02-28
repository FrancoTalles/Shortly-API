import { Router } from "express";
import { criarClientes, logarCliente } from "../Controllers/Auth_Controller.js";
import { loginValidation } from "../Middlewares/Auth_Middlewares.js";

import { validateSchema } from "../Middlewares/validateSchema.js";
import { signUp_schema, signIn_schema } from "../Schemas/Auth_Schema.js";

const AuthRouter = Router();

AuthRouter.post("/signup", validateSchema(signUp_schema), criarClientes);
AuthRouter.post(
  "/signin",
  validateSchema(signIn_schema),
  loginValidation,
  logarCliente
);

export default AuthRouter;
