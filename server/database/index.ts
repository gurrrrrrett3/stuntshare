import { MikroORM, PostgreSqlDriver, EntityManager } from "@mikro-orm/postgresql";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";
import Logger from "../utils/logger";

export default class Database {

    private _orm!: MikroORM
    private _em!: EntityManager<PostgreSqlDriver>

    constructor(callback?: () => void) {
        this.init(callback)
    }

    public async init(callback?: () => void): Promise<void> {
        const orm = await MikroORM.init<PostgreSqlDriver>({
            entities: ["dist/server/database/entities/*.js"],
            type: "postgresql",
            tsNode: true,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            dbName: process.env.DB_NAME,
            host: process.env.DB_HOST,
            port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
            metadataProvider: TsMorphMetadataProvider,
            debug: process.env.DEBUG === "true",
        }).catch((err) => {
            Logger.error("Database", "Failed to initialize database")
            Logger.error("Database", err)
            console.error(err)
            process.exit(1)
        })

        this._orm = orm
        this._em = orm.em

        Logger.info("Database", "Database initialized")

        if (callback) {
            callback()
        }
    }

    public async close(): Promise<void> {
        await this.orm.close(true)
    }

    public get em(): EntityManager<PostgreSqlDriver> {
        return this.em.fork()
    }

    public get orm(): MikroORM {
        return this.orm
    }
}