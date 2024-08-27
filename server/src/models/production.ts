import { db } from "../config/db";

export const getContentFromProductionList = async (model: string, product: string, line: string) => {
    try {
        return new Promise(async (resolve, reject) => {
            const q = 'SELECT name, content FROM production_lists WHERE model = ? AND product = ? AND line = ?'
            await db.query(q, [model, product, line], (err, data) => {
                if (err) {
                    console.log('Erro ao buscar por lista na tabela de listas de produção: ', err)
                    reject(err)
                }
                if (data && data.length > 0) {
                    console.log('Dados obtidos com sucesso!')
                    const content = JSON.parse(data[0].content)
                    resolve({ status: true, content: content, name: data[0].name })
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

                // para filtrar apenas os modelos
                const filteredModels = data.map((a: { model: string }) => {
                    return { model: a.model.toUpperCase() }
                })

                const sortedModels = filteredModels.sort((a: { model: string }, b: { model: string }) => {
                    return a.model.localeCompare(b.model)
                })

                // para filtrar os produtos
                const filteredProducts = data.map((a: { product: string }) => {
                    return { product: a.product.toUpperCase() }
                })

                const sortedProducts = filteredProducts.sort((a: { product: string }, b: { product: string }) => {
                    return a.product.localeCompare(b.product)
                })

                // para colocar as linhas em ordem descrecente
                const filteredLines = data.map((a: { line: string }) => {
                    return { line: Number(a.line) }
                })


                const sortedLines = filteredLines.sort((a: { line: number }, b: { line: number }) => {
                    if (a.line > b.line) {
                        return -1
                    } else if (a.line < b.line) {
                        return 1
                    } else {
                        return 0
                    }
                })


                if (data && data.length > 0) {
                    // para opções de modelos
                    sortedModels.map((row: { model: string }) => {
                        if (!models[row.model]) {
                            models[row.model] = { value: row.model, label: row.model }
                        }
                        return { label: row.model, value: row.model }
                    })
                    // para opções de produtos
                    const products: { [key: string]: { value: string, label: string } } = {}

                    sortedProducts.map((row: { product: string }) => {
                        if (!products[row.product]) {
                            products[row.product] = { label: row.product, value: row.product }
                        }
                        return { label: row.product, value: row.product }
                    })

                    const lines: { [key: string]: { value: string, label: string } } = {}
                    sortedLines.map((row: { line: string }) => {
                        if (!lines[row.line]) {
                            lines[row.line] = { label: row.line, value: row.line }
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
export const exsitsThisListInProductionListsByName = (name: string) => {
    try {
        return new Promise(async (resolve, reject) => {
            const q = 'SELECT content FROM production_lists WHERE name = ?'
            const values = [name]
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

// para checar por linha modelo e produto
export const exsitsThisListInProductionListsByModelLineAndProduct = (model: string, product: string, line: string) => {
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
export const saveNewListInProductionLists = async (name: string, model: string, product: string, line: string, content: string) => {
    try {
        return new Promise(async (resolve, reject) => {
            const q = 'INSERT INTO production_lists (name, model, product, line, content) VALUES (?, ?, ?, ?, ?)'
            await db.query(q, [name, model, product, line, content], (err, data) => {
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
export const updateListInProductionLists = (name: string, model: string, product: string, line: string, content: string) => {
    try {
        return new Promise(async (resolve, reject) => {
            const q = 'UPDATE production_lists SET content = ?, model = ?, product = ?, line = ? WHERE name = ?'
            const values = [content, model, product, line, name]
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


