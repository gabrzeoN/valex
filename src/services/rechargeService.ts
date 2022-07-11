import * as cardService from "./cardService.js";
import * as rechargeRepository from "../repositories/rechargeRepository.js";

async function saveRecharge(cardId: number, amount: number){
    const rechargeData : rechargeRepository.RechargeInsertData = {
        cardId,
        amount
    };
    await rechargeRepository.insert(rechargeData);
    return;
}

export async function createRecharge(x_api_key: string, cardId: number, amount: number) {
    const company = await cardService.keyBelongsToCompany(x_api_key);
    const card = await cardService.cardExists(cardId);
    const employee = await cardService.employeeIsRegister(card.employeeId);
    cardService.employeeWorksForCompany(company.id, employee.companyId);
    cardService.cardMustBeActivated(card.password);
    cardService.cardMustNotBeExpired(card.expirationDate);
    await saveRecharge(cardId, amount);
    return;
}