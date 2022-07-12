import { Request, Response } from "express";
import * as rechargeService from "../services/rechargeService.js";

export async function rechargeCreation(req: Request, res: Response) {
    const  cardId: number = parseInt(req.params.cardId);
    const { amount } : { amount: number } = req.body;
    const x_api_key: string = req.headers["x-api-key"]?.toString();

    if(!cardId){
        throw {type: "badRequest", message: "Card's ID must be a number!"}; 
    }

    if(!x_api_key){
        throw {type: "unauthorized", message: "Company key not found!"}; 
    }

    await rechargeService.createRecharge(x_api_key, cardId, amount);
    res.sendStatus(201);
}