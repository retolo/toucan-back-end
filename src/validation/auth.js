import Joi from "joi";


export const registrationSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
})

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
})


export const checkSessionSchema = Joi.object({
    refreshToken: Joi.string().required(),
})
