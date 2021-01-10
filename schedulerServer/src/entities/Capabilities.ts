import { ObjectType, Field } from "type-graphql";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
} from "typeorm";

import { UserTypeCapabilites  } from "./UserTypeCapabilites";

@ObjectType() 
@Entity()
export class Capabilities extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  capability_id!: number;

  @Field()
  @Column()
  name!: string;

  userTypeCapabilites:UserTypeCapabilites;

// Should add these
//   @Field()
//   @Column()
//   creatorId: number;

//   @Field(() => String)
//   @CreateDateColumn()
//   createdAt: Date;

//   @Field(() => String)
//   @UpdateDateColumn()
//   updatedAt: Date;
}
