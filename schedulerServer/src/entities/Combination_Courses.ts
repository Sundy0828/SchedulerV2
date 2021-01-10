import { ObjectType, Field } from "type-graphql";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
} from "typeorm";

@ObjectType()
@Entity()
export class Combination_Courses extends BaseEntity {
  @Field() 
  @PrimaryGeneratedColumn()
  combination_id!: number;

  @Field()
  @Column()
  course_id: number;

  @Field()
  @Column()
  sub_combination_id: number;


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
