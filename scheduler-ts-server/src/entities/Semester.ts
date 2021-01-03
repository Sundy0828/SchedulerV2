import { ObjectType, Field } from "type-graphql";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToMany,
} from "typeorm";
import {Institution} from './Institution';

@ObjectType()
@Entity()
export class Semester extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  semester_id!: number;

  @Field()
  @Column()
  name!: string;

  @Field()
  @Column()
  institution_id!: number;

  @OneToMany(() => Institution, (institution) => institution.name)
  institutions: Institution[];

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
