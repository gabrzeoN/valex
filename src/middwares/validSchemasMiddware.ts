import { Request, Response, NextFunction } from "express";
import joi from "joi";

export default function validSchema(sch: joi.ObjectSchema){
    return (req: Request, res: Response, next: NextFunction) => {
        const {error} = sch.validate(req.body, {abortEarly: false});
        if(error){
            throw {type: "invalidInput", message: error.details.map(detail => detail.message)};
        }
        next();
    }
}