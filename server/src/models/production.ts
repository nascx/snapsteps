import { db } from "../config/db";

export const getContentFromProductionList = async (model: string, product: string, line: string) => {
    try {
        return new Promise(async (resolve, reject) => {
            const q = 'SELECT content FROM production_lists WHERE model = ? AND product = ? AND line = ?'
            await db.query(q, [model, product, line], (err, data) => {
                if (err) {
                    console.log('Erro ao buscar por lista na tabela de listas de produção: ', err)
                    reject(err)
                }
                if (data && data.length > 0) {
                    console.log('Dados obtidos com sucesso!')
                    const content = JSON.parse(data[0].content)
                    resolve({ status: true, content: content })
                } else {
                    console.log('Não existe uma lista na tabela de listas de produção que satizfaça essa condição.')
                    resolve({ status: false, content: [] })
                }
            })
        })
    } catch (error) {
        throw error
    }
}

export const getContentFromEngineeringList = async (model: string, product: string) => {
    try {
        return new Promise(async (resolve, reject) => {
            const q = 'SELECT content FROM engineering_lists WHERE model = ? AND product = ?'
            await db.query(q, [model, product], (err, data) => {
                if (err) {
                    console.log('Erro ao buscar por lista na tabela de listas de engenharia: ', err)
                    reject(err)
                }
                if (data && data.length > 0) {
                    console.log('Dados obtidos com sucesso!')
                    const content = JSON.parse(data[0].content)
                    resolve({ status: true, content: content })
                } else {
                    console.log('Não existe uma lista na tabela de listas de engenharia que satizfaça essa condição.')
                    resolve({ status: false, content: [] })
                }
            })
        })
    } catch (error) {
        throw error
    }
}

export const searchByModelAndProductOptions = async () => {
    try {
        const q = 'SELECT model, product FROM production_lists'
        return new Promise(async (resolve, reject) => {
            await db.query(q, (err, data) => {
                if (err) {
                    console.log('Erro ao buscar por opções de Modelos e produtos')
                    reject(err)
                }
                if (data && data.length > 0) {
                    const models = data.map((row: { model: string }) => {
                        return { label: row.model, value: row.model }
                    })
                    const products = data.map((row: { product: string }) => {
                        return { label: row.product, value: row.product }
                    })
                    resolve({ models, products })
                }
            })
        })
    } catch (error) {
        throw error
    }
}

export const searchByModelAndProductOptionsAndLine = async () => {
    try {
        const q = 'SELECT model, product, line FROM production_lists'
        return new Promise(async (resolve, reject) => {
            await db.query(q, (err, data) => {
                if (err) {
                    console.log('Erro ao buscar por opções de Modelos e produtos')
                    reject(err)
                }
                const models: { [key: string]: { value: string, label: string } } = {}

                if (data && data.length > 0) {
                    // para opções de modelos
                    data.map((row: { model: string }) => {
                        if (!models[row.model.toUpperCase()]) {
                            models[row.model.toUpperCase()] = { value: row.model.toUpperCase(), label: row.model.toUpperCase() }
                        }
                        return { label: row.model, value: row.model }
                    })
                    // para opções de produtos
                    const products: { [key: string]: { value: string, label: string } } = {}
                    data.map((row: { product: string }) => {
                        if (!products[row.product.toUpperCase()]) {
                            products[row.product.toUpperCase()] = { label: row.product.toUpperCase(), value: row.product.toUpperCase() }
                        }
                        return { label: row.product, value: row.product }
                    })
                    const lines: { [key: string]: { value: string, label: string } } = {}
                    data.map((row: { line: string }) => {
                        if (!lines[row.line.toUpperCase()]) {
                            lines[row.line.toUpperCase()] = { label: row.line.toUpperCase(), value: row.line.toUpperCase() }
                        }
                        return { label: row.line, value: row.line }
                    })

                    resolve(
                        {
                            models: Object.keys(models).map(key => models[key]),
                            products: Object.keys(products).map(key => products[key]),
                            lines: Object.keys(lines).map(key => lines[key])
                        }
                    )
                }
            })
        })
    } catch (error) {
        throw error
    }
}

// para procurar se existe uma lista com model e produto e linha iguai na tabela de listas de produção
export const exsitsThisListInProductionLists = (model: string, product: string, line: string) => {
    try {
        return new Promise(async (resolve, reject) => {
            const q = 'SELECT content FROM production_lists WHERE model = ? AND product = ? AND line = ?'
            const values = [model, product, line]
            await db.query(q, values, (err, data) => {
                if (err) {
                    console.log('Erro ao buscar por lista bna tabela de lista de produção!')
                    reject(err)
                }
                if (data && data.length > 0) {
                    console.log('Existe listas na tabela de listas de engenharia que usam esse modelo e produto')
                    resolve({ status: true, content: data[0].content })
                } else {
                    resolve({ status: false, content: [] })
                }
            })
        })
    } catch (error) {
        throw error
    }
}

// para criar uma nova lista
export const saveNewListInProductionLists = async (model: string, product: string, line: string, content: string) => {
    try {
        return new Promise(async (resolve, reject) => {
            const q = 'INSERT INTO production_lists (model, product, line, content) VALUES (?, ?, ?, ?)'
            await db.query(q, [model, product, line, content], (err, data) => {
                if (err) {
                    reject(err)
                }
                if (data && data.affectedRows > 0) {
                    resolve('Dados inseridos com sucesso na tabela de lista de produção!')
                } else {
                    reject('Erro ao inserir os dados na tabela de lista de produção')
                }
            })
        })
    } catch (error) {
        throw error
    }
}

// para atualizar os dados na lista de produção
export const updateListInProductionLists = (model: string, product: string, line: string, content: string) => {
    try {
        return new Promise(async (resolve, reject) => {
            const q = 'UPDATE production_lists SET content = ? WHERE model = ? AND product = ? AND line = ?'
            const values = [content, model, product, line]
            await db.query(q, values, (err, data) => {
                if (err) {
                    console.log('Erro ao atualizar uma lista na tabela de listas de produção!', err)
                    reject(err)
                }
                if (data.affectedRows > 0) {
                    console.log('Arquivos atualizados com sucesso na tabela de lista de produção', data)
                    resolve(true)
                } else {
                    console.log('Por algum motivo os dados não foram atualizados na tabela de lista de produção!')
                    reject('Nenhum dado atualizado na tabela de lista de produção!')
                }
            })
        })
    } catch (error) {
        throw error
    }
}


