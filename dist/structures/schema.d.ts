import { EntitySchema } from "typeorm";
import { Giveaway } from "./Giveaway";
export type DriverKind = "sqlite" | "mysql" | "postgres" | "mongodb";
/**
 * Builds the TypeORM schema for a driver. Table names match the decorator
 * based entities of the original extension ("giveaway" and "mongo_giveaway"),
 * so existing databases are upgraded in place by TypeORM's synchronize.
 */
export declare function createGiveawaySchema(driver: DriverKind): EntitySchema<Giveaway>;
/**
 * The MongoDB indexes, created by `Database.init` after connecting. They are not in the schema
 * because TypeORM sends the index options it has no value for (`sparse`, `background`) as null,
 * which MongoDB 7 refuses ("not convertible to bool"), so the connection never succeeded.
 * Same names as before: creating an index that already exists does nothing.
 */
export declare const MONGO_INDEXES: readonly [{
    readonly name: "IDX_giveaway_message";
    readonly key: {
        readonly messageID: 1;
    };
}, {
    readonly name: "IDX_giveaway_guild_ended";
    readonly key: {
        readonly guildID: 1;
        readonly hasEnded: 1;
    };
}, {
    readonly name: "IDX_giveaway_id";
    readonly key: {
        readonly id: 1;
    };
    readonly unique: true;
}];
//# sourceMappingURL=schema.d.ts.map