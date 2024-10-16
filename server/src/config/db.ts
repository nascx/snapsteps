import mysql from 'mysql'

import { config } from 'dotenv'

config()

export const db = mysql.createPool({
    host: process.env.DB_HOST || '10.12.100.156',
    user: process.env.DB_USER || 'root',
    database: process.env.DB_DATABASE || "snapsteps",
    password: process.env.DB_PASSWORD || "Helpdesk4202"
})
