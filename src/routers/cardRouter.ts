import { Router } from "express";

import validSchema from "../middwares/validSchemasMiddware.js";
import * as cardSchema from "../schemas/cardSchemas.js";
import { cardCreation, cardActivation, cardLockingUnlocking, transactionListing } from "../controllers/cardController.js";
const cardRouter = Router();

cardRouter.post("/card/create/:employeeId", validSchema(cardSchema.creation), cardCreation);
cardRouter.patch("/card/activate/:cardId", validSchema(cardSchema.activation), cardActivation);
cardRouter.patch("/card/lock-unlock/:cardId", validSchema(cardSchema.lockUnlock), cardLockingUnlocking);
cardRouter.get("/card/:cardId/transactions", transactionListing);

export default cardRouter;