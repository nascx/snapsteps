import { db } from "../config/db";

export const searchQAFiles = (value: string) => {
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

}