import joi from "joi";

export const cardCreationSchema = joi.object({
    employeeId: joi.number().integer().positive().required(),
    cardType: joi.string().valid('groceries', 'restaurants', 'transport', 'education', 'health').required()
});