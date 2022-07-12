import joi from "joi";

export const creation = joi.object({
    amount: joi.number().integer().positive().required(),
    password: joi.string().trim().pattern(new RegExp('^[0-9]{4}$')).required()
});