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
    res.status(201).send(card);
}

export async function cardActivation(req: Request, res: Response) {
    const  cardId: number = parseInt(req.params.cardId);
    const { cardNewPassword, cardCVV } : { cardNewPassword: string, cardCVV: string } = req.body;

    if(!cardId){
        throw {type: "badRequest", message: "Card's ID must be a number!"}; 
    }

    await cardService.activateCard(cardId, cardNewPassword, cardCVV);
    res.sendStatus(200);
}

export async function cardLockingUnlocking(req: Request, res: Response) {
    const  cardId: number = parseInt(req.params.cardId);
    const { password } : { password: string } = req.body;

    if(!cardId){
        throw {type: "badRequest", message: "Card's ID must be a number!"}; 
    }

    const newStatus = await cardService.lockUnlockCard(cardId, password);
    res.status(200).send(newStatus);
}

export async function transactionRechargesListing(req: Request, res: Response) {
    const  cardId: number = parseInt(req.params.cardId);

    if(!cardId){
        throw {type: "badRequest", message: "Card's ID must be a number!"}; 
    }

    const transactionsAndRecharges = await cardService.listTransactionRecharges(cardId);
    res.status(200).send(transactionsAndRecharges);
}