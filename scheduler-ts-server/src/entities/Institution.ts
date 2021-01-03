import { ObjectType, Field } from "type-graphql";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
} from "typeorm";

@ObjectType()
@Entity()
export class Institution extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  institution_id!: number;

  @Field()
  @Column()
  name!: string;

  @Field()
  @Column()
  public_key!: string;

  @Field()
  @Column({ type: "int", default: 0 })
  secret_key!: string;

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
