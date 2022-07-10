import joi from "joi";

export const cardCreationSchema = joi.object({
    employeeId: joi.number().integer().positive().required(),
    cardType: joi.string().valid('groceries', 'restaurant', 'transport', 'education', 'health').required()
});

export const cardActivationSchema = joi.object({
    cardNewPassword: joi.string().trim().pattern(new RegExp('^[0-9]{4}$')).required(),
    cardCVV: joi.string().trim().pattern(new RegExp('^[0-9]{3}$')).required()
});