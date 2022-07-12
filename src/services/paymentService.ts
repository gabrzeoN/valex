import * as cardService from "./cardService.js";
import * as rechargeRepository from "../repositories/rechargeRepository.js";
import * as businessesRepository from "../repositories/businessRepository.js";
import * as paymentRepository from "../repositories/paymentRepository.js";

export interface Transaction {
    recharges: rechargeRepository.Recharge[];
    payments: paymentRepository.Payment[];
}

export async function establishmentIsRegister(establishmentId: number){
    const establishment = await businessesRepository.findById(establishmentId);
    if(!establishment){
        throw {type: "badRequest", message: "Establishment is not register!"}; 
    }
    return establishment;
}

export function compareCardEstabTypes(cardType: string, establishmentType: string){
    if(cardType !== establishmentType){
        throw {type: "unauthorized", message: `This card can only be used for '${cardType}' purposes! Using for '${establishmentType}'.`}; 
    }
    return;
}

export async function checkNewCardBalance(cardId: number, amount: number){
    const transactions = await getAllTransactions(cardId);
    const balance = checkCardBalance(transactions);
    const newBalance = balance - amount;
    if(newBalance < 0){
        throw {type: "notAcceptable", message: "There is not enough credit for this transaction!"}; 
    }
    return;
}

export async function getAllTransactions(cardId: number){
    const recharges = await rechargeRepository.findByCardId(cardId);
    const payments = await paymentRepository.findByCardId(cardId);
    const transactions = {payments, recharges};
    return transactions;
}

export function checkCardBalance(transactions: Transaction){
    let allRechargesValue = 0;
    let allPaymentsValue = 0;
    transactions.recharges.forEach(recharge => allRechargesValue += recharge.amount);
    transactions.payments.forEach(payment => allPaymentsValue += payment.amount);
    const balance = allRechargesValue - allPaymentsValue;
    return balance;
}

async function savePayment(cardId: number, establishmentId: number, amount: number){
    const paymentData : paymentRepository.PaymentInsertData = {
        cardId,
        amount,
        businessId: establishmentId
    };
    await paymentRepository.insert(paymentData);
    return;
}

export async function createPayment(cardId: number, establishmentId: number, amount: number, password: string) {
    const card = await cardService.cardExists(cardId);
    cardService.cardMustBeActivated(card.password);
    cardService.cardMustNotBeExpired(card.expirationDate);
    cardService.cardMustNotBeLocked(card.isBlocked);
    await cardService.comparePassword(password, card.password);
    const establishment = await establishmentIsRegister(establishmentId);
    compareCardEstabTypes(card.type, establishment.type);
    await checkNewCardBalance(card.id, amount);
    await savePayment(cardId, establishmentId, amount);
    return;
}