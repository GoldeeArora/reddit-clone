import path from "path";
import { Post } from "../entities/Post";
import { Updoot } from "../entities/Updoot";
import { User } from "../entities/User";
import { DataSource } from "typeorm";

export const conn = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "Goldee@123",
    database: "lireddit2",
    synchronize: true,
    logging: true,
    entities: [Post, User,Updoot],
    subscribers: [],
    migrations: [path.join(__dirname, "./migrations/*")],
  })