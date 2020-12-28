import {Entity, Column, PrimaryColumn, BeforeInsert, BaseEntity} from "typeorm";
//import uuidv4 from 'uuid/v4';
const uuidv4 = require('uuid/v4');

@Entity()
export class User extends BaseEntity {

    @PrimaryColumn("uuid") id: string;

    @Column("nvarchar", {length: 255}) email: string;

    @Column("text") password: string;

    @BeforeInsert()
    addId() {
        this.id  = uuidv4();
    }
}
