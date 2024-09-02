import { db } from "../config/db";

/* export const searchQAFiles = (value: string) => {
    try {
        return new Promise(async (resolve, reject) => {
            const q = 'SELECT code, title, path FROM qa_files WHERE code LIKE ? OR title LIKE ?';
            await db.query(q, [`%${value}%`, `%${value}%`], (err, data) => {
                if (err) {
                    reject(err)
                }
                if (data && data.length > 0) {
                    resolve(data)
                } else {
                    resolve([])
                }
            })
        })
    } catch (error) {
        throw error
    }

} */

class qualityFile {
    code: string
    filePath: string

    constructor(code: string, filePath: string) {
        this.code = code
        this.filePath = filePath
    }
}

export class SGIUser {
    // para procurar por um arquivo na base de dados
    static findQualityFileByCode = async (code: string) => {
        try {
            return new Promise(async (resolve, reject) => {
                const q = 'SELECT 1 FROM quality_files WHERE code = ?'
                await db.query(q, [code], (err, data) => {
                    if (err) {
                        reject(err)
                        console.log(err)
                    }

                    if (data && data.length > 0) {
                        resolve(true)
                    } else {
                        resolve(false)
                    }
                })
            })
        } catch (error) {
            throw error
        }
    }
    // para inserir dados de um arquivo na base de dados
    static insertFileData = async (code: string, title: string, filePath: string) => {
        try {
            return new Promise(async(resolve, reject) => {
                const q = 'INSERT INTO quality_files (code, title, path) VALUES (?, ?, ?)'
                await db.query(q, [code, title, filePath], (err, data) => {                    
                    if (err) {
                        reject()
                    }
                    if (data && data.affectedRows > 0) {
                        resolve(true)
                    } else {
                        reject()
                    }
                })
            })
        } catch (error) {
            throw error
        }
    }

    static updateFileData = async (code: string, newTitle: string, newPath: string) => {
        try {
            return new Promise(async(resolve, reject) => {
                const q = 'UPDATE quality_files SET title = ?, path = ? WHERE code = ?'
                await db.query(q, [newTitle, newPath, code], (err, data) => {
                    if (err) {
                        reject()
                        console.log(err)
                    }
                    if (data && data.affectedRows > 0) {
                        resolve(true)
                    } else {
                        reject()
                    }
                })
            })
        } catch (error) {
            throw error
        }
    }

    static searchQulityFilesByTitleOrCode = (value: string) => {
        try {
            return new Promise (async(resolve, reject) => {
                const q = 'SELECT code, title, path FROM quality_files WHERE code LIKE ? OR title LIKE ?'
                await db.query( q, [`%${value}%`, `%${value}%`], (err, data) => {
                    if (err) {
                        reject()
                        console.log(err)
                    }
                    if (data && data.length > 0) {
                        resolve(data)
                    } else {
                        resolve([])
                    }
                })
            })
        } catch (error) {
            
        }
    }


}