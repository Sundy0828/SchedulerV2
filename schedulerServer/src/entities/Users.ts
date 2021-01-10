import { ObjectType, Field } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
} from "typeorm";

@ObjectType()
@Entity()
export class Users extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  user_id!: number;

  @Field()
  @Column()
  name!: string;

  @Field()
  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column()
  user_meta!: string;

  @Column()
  first_failed_login: Date;

  @Column()
  login_attemps!: number;

  @Column()
  timeout_start: Date;

  @Column()
  user_type_id!: number;

  @Column()
  salt!: string;

  @Column()
  user_key: string;

}
