import { DataSource } from "typeorm";
import Like from "../model/Like";
import Post from "../model/Post";
import User from "../model/User";

const AppDataSource = new DataSource({
    type: "better-sqlite3",
    database: "./src/database/sonhos.db",
    synchronize: true,
    logging: true,
    entities: [User, Post, Like],
    migrations: []
});

AppDataSource.initialize()
    .then(() => {
        console.log("DataBase initialized");
    })
    .catch((error) => {
        console.error(error);

        process.exit(1);
    });

export default AppDataSource;