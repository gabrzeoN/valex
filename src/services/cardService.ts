import { faker } from '@faker-js/faker';
import Cryptr from "cryptr";
import * as employeeRespository from "../repositories/employeeRepository.js";
import * as companyRespository from "../repositories/companyRepository.js";
import * as cardRespository from "../repositories/cardRepository.js";

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

function generateExpirationDate(){
    const today = new Date();
    today.setFullYear(today.getFullYear() + 5);
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

function generateCVV(salt: string){
    const cryptr = new Cryptr("secretCVV" + salt);
    const encryptedString = cryptr.encrypt(faker.finance.creditCardCVV());
    return encryptedString;
}

async function generateCard(cardType: cardRespository.TransactionTypes, employeeId: number, employeeName: string){
    const cardData : cardRespository.CardInsertData = {
        employeeId,
        number: faker.finance.creditCardNumber("####-####-####-###L"),
        cardholderName: generateCardHolderName(employeeName),
        securityCode: generateCVV(employeeName),
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

export async function createCard(x_api_key: string, employeeId: number, cardType: cardRespository.TransactionTypes) {
    const company = await keyBelongsToCompany(x_api_key);
    const employee = await employeeIsRegister(employeeId);
    employeeWorksForCompany(company.id, employee.companyId);
    await employeeMustNotHaveThisCard(cardType, employeeId);
    const card = await generateCard(cardType, employeeId, employee.fullName);
    return card;
}