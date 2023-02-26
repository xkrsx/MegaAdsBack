import {createPool} from "mysql2/promise";

export const pool = createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'megak_ads',
    namedPlaceholders: true,
    decimalNumbers: true,
    socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock',
})

// import {createPool} from "mysql2/promise";
// import { config } from "../config/config";

// export const pool = createPool({
//     host: config.dbHost,
//     user: config.dbUser,
//     password: config.dbPassword,
//     database: config.dbDatabase,
//     namedPlaceholders: true,
//     decimalNumbers: true,
// });
