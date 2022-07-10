import { faker } from '@faker-js/faker';
import Cryptr from "cryptr";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

import * as employeeRespository from "../repositories/employeeRepository.js";
import * as companyRespository from "../repositories/companyRepository.js";
import * as cardRespository from "../repositories/cardRepository.js";
import * as cryptrUtil from "../utils/cryptrUtil.js";

async function keyBelongsToCompany(x_api_key: string){
    const company = await companyRespository.findByApiKey(x_api_key);
    if(!company){
        throw {type: "unauthorized", message: "Company key doesn't exist!"}; 
    }
    return company;
}

async function employeeIsRegister(employeeId: number){
    const employee = await employeeRespository.findById(employeeId);
    if(!employee){
        throw {type: "unauthorized", message: "Company key doesn't exist!"}; 
    }
    return employee;
}

function employeeWorksForCompany(companyId: number, employeeCompanyId: number){
    if(companyId !== employeeCompanyId){
        throw {type: "forbidden", message: "Employee doesn't work for this company!"}; 
    }
    return;
}

async function employeeMustNotHaveThisCard(cardType: cardRespository.TransactionTypes, employeeId: number){
    const card = await cardRespository.findByTypeAndEmployeeId(cardType, employeeId);
    if(card){
        throw {type: "conflict", message: "Employee already has a card of this type!"};
    }
    return;
}

function generateExpirationDate(yearsValid: number = 5){
    const today = new Date();
    today.setFullYear(today.getFullYear() + yearsValid);
    let expirationDate: string = today.toLocaleDateString("pt-BR")
    let dayMouthYear = expirationDate.split("/");
    let expirationDateFormatted = `${dayMouthYear[1]}/${dayMouthYear[2][2]}${dayMouthYear[2][3]}`
    return expirationDateFormatted;
}

function generateCardHolderName(employeeName: string){
    const splitName = employeeName.split(" ");
    const filteredSplitName = splitName.filter((name) => {if(name.length > 2) return true});
    const shorterName = filteredSplitName.map((name, index) => {
        if(index === 0 || index === filteredSplitName.length - 1){
            return name;
        }else{
            return name[0];
        }
    });
    const holderNameFormatted = shorterName.join(" ").toUpperCase();
    return holderNameFormatted;
}

function generateCVV(){
    const cryptr = new Cryptr(cryptrUtil.salt);
    const decryptedCVV = faker.finance.creditCardCVV();
    const encryptedCVV = cryptr.encrypt(decryptedCVV);
    return [decryptedCVV, encryptedCVV];
}

async function generateCard(cardType: cardRespository.TransactionTypes, employeeId: number, employeeName: string, cvv: string){
    const cardData : cardRespository.CardInsertData = {
        employeeId,
        number: faker.finance.creditCardNumber("####-####-####-###L"),
        cardholderName: generateCardHolderName(employeeName),
        securityCode: cvv,
        expirationDate: generateExpirationDate(),
        password: null,
        isVirtual: false,
        originalCardId: null,
        isBlocked: true,
        type: cardType,
    };
    cardRespository.insert(cardData);
    return cardData;
}

async function cardExists(cardId: number){
    const card = await cardRespository.findById(cardId);
    if(!card){
        throw {type: "unauthorized", message: "Card not register or invalid security code!"}; 
    }
    return card;
}

function cardIsNotExpired(expirationDate: string){
    const expirationDateMMYY = expirationDate.split("/");
    const todayMMYY = generateExpirationDate(0).split("/");
    const yearsAhead = (todayMMYY[1] > expirationDateMMYY[1]);
    const sameYearButMonthsAhead = (expirationDateMMYY[1] === todayMMYY[1] && todayMMYY[0] > expirationDateMMYY[0]);
    if(yearsAhead || sameYearButMonthsAhead){
        throw {type: "notAcceptable", message: "This card has already expired!"}; 
    }
    return;
}

function compareCVV(inputCardCVV: string, dbCardCVV: string){
    const cryptr = new Cryptr(cryptrUtil.salt);
    const decryptedDbCardCVV = cryptr.decrypt(dbCardCVV);
    if(inputCardCVV !== decryptedDbCardCVV){
        throw {type: "unauthorized", message: "Card not register or invalid security code!"}; 
    }
    return;
}

function cardAlreadyActivated(password: string){
    if(password){
        throw {type: "conflict", message: "This card is already activated!"}; 
    }
    return;
}

async function saveNewPassword(cardId: number, cardNewPassword: string){
    const encryptedPassword = bcrypt.hashSync(cardNewPassword, cryptrUtil.bsalt);
    await cardRespository.update(cardId, {password: encryptedPassword});
    return;
}

export async function createCard(x_api_key: string, employeeId: number, cardType: cardRespository.TransactionTypes) {
    const company = await keyBelongsToCompany(x_api_key);
    const employee = await employeeIsRegister(employeeId);
    employeeWorksForCompany(company.id, employee.companyId);
    await employeeMustNotHaveThisCard(cardType, employeeId);
    const [decryptedCVV, encryptedCVV]: string[] = generateCVV();
    const card = await generateCard(cardType, employeeId, employee.fullName, encryptedCVV);
    return {...card, securityCode: decryptedCVV};
}

export async function activateCard(cardId: number, cardNewPassword: string, cardCVV: string) {
    const card = await cardExists(cardId);
    cardIsNotExpired(card.expirationDate);
    compareCVV(cardCVV, card.securityCode);
    cardAlreadyActivated(card.password);
    await saveNewPassword(card.id, cardNewPassword);
    return;
}