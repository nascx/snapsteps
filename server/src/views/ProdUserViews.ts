import { ProdUser } from "@src/models/ProdUser";
import { Request, Response } from "express";

export class ProdUserViews {
    static getModelOptions = async (req: Request, res: Response) => {
        try {
            const models = await ProdUser.findModelsOptions()
            if (models) {
                res.status(200).json(models)
            } else {
                res.status(400).json({message: 'Error to find models options'})
            }
        } catch (error) {
            res.status(500).json(error)
        }
    }

    static getProductOptionsByModel = async (req: Request, res: Response) => {
        try {
            const {model} = req.query

            const models = await ProdUser.findProductsOptionsByModel(model as string)

            if (models) {
                res.status(200).json(models)
            } else {
                res.status(400).json({message: 'Error to find product options'})
            }
        } catch (error) {
            res.status(500).json(error)
        }
    }

    static getLinesOptionsByModelAndProduct = async (req: Request, res: Response) => {
        try {
            const {model, product} = req.query

            const lines = await ProdUser.findLinesOptionsByModelAndProduct(model as string, product as string)
            if (lines) {
                res.status(200).json(lines)
            } else {
                res.status(400).json({message: 'Error to find line options'})
            }
        } catch (error) {
            res.status(500).json(error)
        }
    }
}