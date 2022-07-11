import joi from "joi";

export const creation = joi.object({
    amount: joi.number().integer().positive().required()
});