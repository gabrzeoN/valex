import joi from "joi";

export const creation = joi.object({
    employeeId: joi.number().integer().positive().required(),
    cardType: joi.string().valid('groceries', 'restaurant', 'transport', 'education', 'health').required()
});

export const activation = joi.object({
    cardNewPassword: joi.string().trim().pattern(new RegExp('^[0-9]{4}$')).required(),
    cardCVV: joi.string().trim().pattern(new RegExp('^[0-9]{3}$')).required()
});

export const lockUnlock = joi.object({
    password: joi.string().trim().pattern(new RegExp('^[0-9]{4}$')).required()
});