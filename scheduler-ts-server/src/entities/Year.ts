import { ObjectType, Field } from "type-graphql";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity
} from "typeorm";

@ObjectType()
@Entity()
export class Year extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  year_id!: number;

  @Field()
  @Column()
  name!: string;

  @Field()
  @Column()
  institution_id!: number;

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
