import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const {Pool} = pg;
const config = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: true
    }
};

if(process.env.MODE === "PROD"){
    config.ssl = {
        rejectUnauthorized: false
    }
}

export const connection = new Pool(config);