import { ObjectType, Field } from "type-graphql";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
} from "typeorm";

@ObjectType() 
@Entity()
export class Disciplines extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  discipline_id!: number;

  @Field()
  @Column()
  institution_id!: number;

  @Field()
  @Column()
  name!: string;

  @Field()
  @Column()
  is_major!: boolean;


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
