import * as cardService from "./cardService.js";
import * as rechargeRepository from "../repositories/rechargeRepository.js";
import * as businessesRepository from "../repositories/businessRepository.js";
import * as paymentRepository from "../repositories/paymentRepository.js";

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
    const allRecharges = await rechargeRepository.findByCardId(cardId);
    const allPayments = await paymentRepository.findByCardId(cardId);
    let allRechargesValue = 0;
    let allPaymentsValue = amount;
    allRecharges.forEach(recharge => allRechargesValue += recharge.amount);
    allPayments.forEach(payment => allPaymentsValue += payment.amount);
    if(allPaymentsValue > allRechargesValue){
        throw {type: "notAcceptable", message: "There is not enough credit for this transaction!"}; 
    }
    return;
}
// TODO: arrumar a func abaixo
export async function checkCardBalance(cardId: number){
    const allRecharges = await rechargeRepository.findByCardId(cardId);
    const allPayments = await paymentRepository.findByCardId(cardId);
    let allRechargesValue = 0;
    let allPaymentsValue = 0;
    allRecharges.forEach(recharge => allRechargesValue += recharge.amount);
    allPayments.forEach(payment => allPaymentsValue += payment.amount);
    if(allPaymentsValue > allRechargesValue){
        throw {type: "notAcceptable", message: "There is not enough credit for this transaction!"}; 
    }
    return;
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