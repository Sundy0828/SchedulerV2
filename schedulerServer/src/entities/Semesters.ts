import { ObjectType, Field } from "type-graphql";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity
} from "typeorm";
//import {Institutions} from './Institutions';

@ObjectType()
@Entity()
export class Semesters extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  semester_id!: number;

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
