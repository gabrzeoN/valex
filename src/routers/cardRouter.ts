import { Router } from "express";

import validSchema from "../middwares/validSchemasMiddware.js";
import { cardCreationSchema } from "../schemas/cardSchemas.js";
import { cardCreation } from "../controllers/cardController.js";

const cardRouter = Router();

cardRouter.post("/card/create", validSchema(cardCreationSchema), cardCreation);
// cardRouter.patch("/card/activate");
// cardRouter.get("/card/vizualize");
// cardRouter.patch("/card/lock");
// cardRouter.patch("/card/unlock");

export default cardRouter;