import { z } from "zod";

export const  idSchema = z.string().transform(val=>{
    const parsedId = parseInt(val, 10);
    if(isNaN(parsedId)){
        throw new Error(`ID: ${val} is not valid`);
    }
    return parsedId;
})