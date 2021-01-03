import { ObjectType, Field } from "type-graphql";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToMany
} from "typeorm";
import {Institution} from './Institution';

@ObjectType()
@Entity()
export class Year extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  year_id!: number;

  @Field()
  @Column()
  name!: string;

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
