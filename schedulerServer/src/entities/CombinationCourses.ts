import { ObjectType, Field } from "type-graphql";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity
} from "typeorm"; 
// import { Courses } from "./Courses";

@ObjectType()
@Entity()
export class CombinationCourses extends BaseEntity {
  @Field() 
  @PrimaryGeneratedColumn()
  combination_id!: number;

  @Field()
  @Column()
  course_id: number;

  @Field()
  @Column()
  sub_combination_id: number;

  // @OneToMany(() => Courses, (courses) => courses.name)
  // courses: Courses[];


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
