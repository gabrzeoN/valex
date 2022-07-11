import { Router } from "express";

import validSchema from "../middwares/validSchemasMiddware.js";
import * as rechargeSchema from "../schemas/rechargeSchemas.js";
import { rechargeCreation } from "../controllers/rechargeController.js";

const rechargeRouter = Router();

rechargeRouter.post("/recharge/:cardId", validSchema(rechargeSchema.creation), rechargeCreation);

export default rechargeRouter;