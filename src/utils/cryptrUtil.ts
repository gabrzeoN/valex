export const salt = process.env.CRYPTR_SALT || "secretCVV";
export const bsalt = +process.env.BCRYPT_SALT || 10;