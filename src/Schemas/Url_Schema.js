import joi from "joi";

export const url_schema = joi.object({
    url: joi.string().uri().required()
})