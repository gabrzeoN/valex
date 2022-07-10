import { Request, Response } from "express";
import * as cardService from "./../services/cardService.js";
import { TransactionTypes } from "../repositories/cardRepository.js";

export async function cardCreation(req: Request, res: Response) {
    const { employeeId, cardType } : { employeeId: number, cardType: TransactionTypes } = req.body;
    const x_api_key: string = req.headers["x-api-key"]?.toString();

    if(!x_api_key){
        throw {type: "unauthorized", message: "Company key not found!"}; 
    }

    const card = await cardService.createCard(x_api_key, employeeId, cardType);
    res.status(200).send(card);
}