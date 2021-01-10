import { ObjectType, Field } from "type-graphql";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
} from "typeorm";

@ObjectType()
@Entity()
export class Courses extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  course_id!: number;

  @Field()
  @Column() 
  prequisite_combination_id!: number;

  @Field()
  @Column()
  name!: string;

  @Field()
  @Column()
  credits!: number;

  @Field()
  @Column()
  code!: number;

  @Field()
  @Column()
  semester_available!: number;

  @Field()
  @Column()
  years_available!: number;

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
