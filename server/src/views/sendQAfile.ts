import { Request, Response } from "express";

import fs from 'node:fs'

export const sendQAFile = async (req: Request, res: Response) => {
    try {
        const { path } = req.query

        const bytes = fs.readFileSync(path as string)

        // Envia o novo documento PDF como resposta
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename=extracted_page.pdf');
        res.send(Buffer.from(bytes));
    } catch (error) {
        res.status(400).json(error)
    }
}