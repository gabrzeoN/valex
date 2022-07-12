import { Router } from "express";

import validSchema from "../middwares/validSchemasMiddware.js";
import * as cardSchema from "../schemas/cardSchemas.js";
import { cardCreation, cardActivation, cardLockingUnlocking, transactionRechargesListing } from "../controllers/cardController.js";
const cardRouter = Router();

cardRouter.post("/card/create", validSchema(cardSchema.creation), cardCreation);
cardRouter.patch("/card/activate/:cardId", validSchema(cardSchema.activation), cardActivation);
cardRouter.patch("/card/lock-unlock/:cardId", validSchema(cardSchema.lockUnlock), cardLockingUnlocking);
cardRouter.get("/card/:cardId/transactions", transactionRechargesListing);

export default cardRouter;