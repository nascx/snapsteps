import { db } from "../config/db";

export const existsThisIT = (path: string) => {
   try {
    return new Promise(async(resolve, reject) => {
        const q = 'SELECT name FROM its WHERE path = ?'
        await db.query(q, [path], (err, data) => {
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

export const insertIT = (path: string, name: string) => {
    try {
        return new Promise(async(resolve, reject) => {
            const q = 'INSERT INTO its (path, name) VALUES (?, ?)'
            await db.query(q, [path, name], (err, data) => {
                if (err) {
                    reject(err)
                }
                if (data.affectedRows > 0) {
                    console.log('Arquivos inserido com sucesso na tabela its', data)
                    resolve(true)
                } else {
                    console.log('Por algum motivo os dados não foram inseridos na tabela de its!')
                    reject('Nenhum dado inserido na tabela de its!')
                }
            })
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