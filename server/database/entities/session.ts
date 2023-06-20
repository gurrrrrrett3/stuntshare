import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { randomString } from "../../utils/idGen";
import { Author } from "./author";

@Entity()
export class Session {

    @PrimaryKey()
    id: string = randomString(16)
    
    @ManyToOne(() => Author)
    author!: Author

    @Property()
    expiresAt!: Date

}