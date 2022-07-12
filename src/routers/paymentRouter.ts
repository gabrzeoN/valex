import { Router } from "express";

import validSchema from "../middwares/validSchemasMiddware.js";
import * as paymentSchema from "../schemas/paymentSchemas.js";
import { paymentCreation } from "../controllers/paymentController.js";

const paymentRouter = Router();

paymentRouter.post("/payment/:cardId/establishment/:establishmentId", validSchema(paymentSchema.creation), paymentCreation);

export default paymentRouter;