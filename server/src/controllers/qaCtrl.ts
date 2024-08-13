import { Request, Response } from "express";

import { searchQAFiles } from "../models/quality";

export const sendQAFilesOptions = async (req: Request, res: Response) => {
    try {
        const { value } = req.query
        console.log(value)
        const data = await searchQAFiles(value as string)
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json(error)
        console.log(error)
    }
}

