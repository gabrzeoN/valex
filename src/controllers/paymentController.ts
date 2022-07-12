import { Request, Response } from "express";
import * as paymentService from "../services/paymentService.js";

export async function paymentCreation(req: Request, res: Response) {
    const  cardId: number = parseInt(req.params.cardId);
    const  establishmentId: number = parseInt(req.params.establishmentId);
    const { amount, password } : { amount: number, password: string } = req.body;

    if(!cardId || !establishmentId){
        throw {type: "badRequest", message: "Cards and establishment ID must be a number!"}; 
    }

    await paymentService.createPayment(cardId, establishmentId, amount, password);
    res.sendStatus(201);
}