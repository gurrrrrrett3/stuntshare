import { Collection, Entity, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { Track } from "./track";
import { Session } from "./session";

@Entity()
export class Author {

    @PrimaryKey()
    id!: string; // discord id

    @Property()
    name!: string
    
    @Property()
    avatar!: string

    @OneToMany(() => Track, track => track.author)
    tracks = new Collection<Track>(this);

    @OneToMany(() => Session, session => session.author)
    sessions = new Collection<Session>(this);

    @Property()
    createdAt = new Date()
}