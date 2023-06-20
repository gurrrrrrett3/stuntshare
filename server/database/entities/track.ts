import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import generateId from "../../utils/idGen";
import { Author } from "./author";

@Entity()
export class Track {

    @PrimaryKey()
    id: string = generateId()

    @Property()
    title!: string

    @Property()
    description!: string

    @ManyToOne(() => Author)
    author!: Author
}