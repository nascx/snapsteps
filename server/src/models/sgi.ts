import { db } from "../config/db";

export const existsThisIT = async (name: string) => {
   try {
    return new Promise(async(resolve, reject) => {
        console.log('inicio da busca')
        const q = 'SELECT path FROM its WHERE name = ?'
        await db.query(q, [name], (err, data) => {
            if (err) {
                reject(err)
            }
            if (data && data.length > 0 ) {
                console.log(`it ${name} encontrada`)
                resolve({status: true})
            } else {
                console.log(`it ${name} não encontrada`)
                resolve({status: false})
            }
        })
        console.log('fim da busca')
    })
   } catch (error) {
    throw error
   } 
}

export const insertIT = async (path: string, name: string) => {
    try {
        return new Promise(async(resolve, reject) => {
            console.log('inicio da inserção dos dados da it no banco')
            const q = 'INSERT INTO its (path, name) VALUES (?, ?)'
            await db.query(q, [path, name], (err, data) => {
                if (err) {
                    reject(err)
                    console.log(err)
                }
                if (data) {
                    console.log(data)
                    console.log('Arquivos inserido com sucesso na tabela its', data)
                    resolve(true)
                } else {
                    console.log('Por algum motivo os dados não foram inseridos na tabela de its!')
                    reject('Nenhum dado inserido na tabela de its!')
                }
            })
            console.log('fim da inserção dos dados da it no banco')
        })
    } catch (error) {
        throw error
    }
}

export const existsThisQAFile = (code: string) => {
    try {
     return new Promise(async(resolve, reject) => {
         const q = 'SELECT title FROM qa_files WHERE code = ?'
         await db.query(q, [code], (err, data) => {
             if (err) {
                 reject(err)
             }
             if (data && data.length > 0 ) {
                 resolve({status: true})
             } else {
                 resolve({status: false})
             }
         })
     })
    } catch (error) {
     throw error
    } 
}

export const insertQAFile = (code: string, title: string, path: string) => {
    try {
        return new Promise(async(resolve, reject) => {
            const q = 'INSERT INTO qa_files (code, title, path) VALUES (?, ?, ?)'
            await db.query(q, [code, title, path], (err, data) => {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                if (data.affectedRows > 0) {
                    console.log('Arquivos inserido com sucesso na tabela arquivos do qa', data)
                    resolve(true)
                } else {
                    console.log('Por algum motivo os dados não foram inseridos na tabela de arquivos do qa!')
                    reject('Nenhum dado inserido na tabela de its!')
                }
            })
        })
    } catch (error) {
        throw error
    }
}