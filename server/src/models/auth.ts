import { db } from "../config/db";

export const getPassword = async (sector: string) => {
    try {
        return new Promise(async (resolve, reject) => {
            const q = 'SELECT password FROM users WHERE sector = ?'
            await db.query(q, [sector], (err, data) => {

                if (err) {
                    console.log(err)
                    reject(err)
                }
                if (data && data.length > 0) {
                    console.log(data[0])
                    resolve({ status: true, message: data[0].password })
                } else {
                    resolve({ status: false, message: 'Este setor não existe!' })
                }
            })
        })
    } catch (error) {
        throw error
    }
}