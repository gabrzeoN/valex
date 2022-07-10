import { Router } from "express";

import validSchema from "../middwares/validSchemasMiddware.js";
import { cardCreationSchema, cardActivationSchema } from "../schemas/cardSchemas.js";
import { cardCreation, cardActivation } from "../controllers/cardController.js";

const cardRouter = Router();

cardRouter.post("/card/create", validSchema(cardCreationSchema), cardCreation);
cardRouter.patch("/card/activate/:cardId", validSchema(cardActivationSchema), cardActivation);
// cardRouter.get("/card/vizualize");
// cardRouter.patch("/card/lock");
// cardRouter.patch("/card/unlock");

export default cardRouter;