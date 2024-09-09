// importação de tipos de resposta e requisição do express
import { Request, Response } from "express";

// importação do model (requisição ao banco) aonde se obtém a senha do usuário
import { getPassword } from "../models/auth";

export class Auth {
    // função para validar a credencial
    static credentialCheck = async (req: Request, res: Response) => {
        try {
            // obtendo as informações que vem da requisição do cliente (setor e a senha)
            const { sector, password } = req.query

            // pegando a senha do setor que foi escolhido
            const crendials = await getPassword(sector as string) as { status: boolean, message: string }
            if (crendials.status) {
                // caso a senha do setor seja igual a senha que o cliente forneceu ele é enviado uma mensagem de credencial válidas
                if (crendials.message === password) {
                    res.status(200).json({ message: 'Credenciais válidas' })
                    // caso a senha enviada pelo cliente e a do setor não sejam iguais devolve uma mensagem de senha incorreta
                } else {
                    res.status(400).json({ message: 'Senha incorreta' })
                    return
                }
            } else {
                // caso exista erro é por que o setor não existe
                res.status(404).json({ message: 'Este setor não existe' })
            }
        } catch (error) {
            // caso ocorra algum erro no serividor deve enviar uma mensagem com esse erro.
            res.status(500).json(error)
        }
    }
}