// import { Entity, BaseEntity, ManyToOne, PrimaryColumn, Column } from "typeorm";
// import { Users } from "./Users";
// import { Post } from "./Post";

// // m to n
// // many to many
// // user <-> posts
// // user -> join table <- posts
// // user -> updoot <- posts

// @Entity()
// export class Updoot extends BaseEntity {
//   @Column({ type: "int" })
//   value: number;

//   @PrimaryColumn()
//   userId: number;

//   @ManyToOne(() => Users, (user) => user.updoots)
//   user: Users;

//   @PrimaryColumn()
//   postId: number;

//   @ManyToOne(() => Post, (post) => post.updoots, {
//     onDelete: "CASCADE",
//   })
//   post: Post;
// }
