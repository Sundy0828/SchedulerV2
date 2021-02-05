// import { ObjectType, Field, Int } from "type-graphql";
// import {
//   Entity,
//   Column,
//   PrimaryGeneratedColumn,
//   CreateDateColumn,
//   UpdateDateColumn,
//   BaseEntity,
//   ManyToOne,
//   OneToMany,
// } from "typeorm";
// import { Users } from "./Users";
// import { Updoot } from "./Updoot";

// @ObjectType()
// @Entity()
// export class Post extends BaseEntity {
//   @Field()
//   @PrimaryGeneratedColumn()
//   id!: number;

//   @Field()
//   @Column()
//   title!: string;

//   @Field()
//   @Column()
//   text!: string;

//   @Field()
//   @Column({ type: "int", default: 0 })
//   points!: number;

//   @Field(() => Int, { nullable: true })
//   voteStatus: number | null; // 1 or -1 or null

//   @Field()
//   @Column()
//   creatorId: number;

//   @Field()
//   @ManyToOne(() => Users, (user) => user.posts)
//   creator: Users;

//   @OneToMany(() => Updoot, (updoot) => updoot.post)
//   updoots: Updoot[];

//   @Field(() => String)
//   @CreateDateColumn()
//   createdAt: Date;

//   @Field(() => String)
//   @UpdateDateColumn()
//   updatedAt: Date;
// }
