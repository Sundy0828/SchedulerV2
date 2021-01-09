import { ObjectType, Field } from "type-graphql";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
} from "typeorm";

import { User_Type_Capabilites  } from "./User_Type_Capabilites";

@ObjectType() 
@Entity()
export class Capabilities extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  capability_id!: number;

  @Field()
  @Column()
  name!: string;

  userTypeCapabilites:User_Type_Capabilites;

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
