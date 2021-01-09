import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { getConnection } from "typeorm";
import { User_Types } from "../entities/User_Types";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types";

@InputType()
class UserTypeInput {
  @Field()
  name: string;
}

@ObjectType()
class PaginatedUserTypes {
  @Field(() => [User_Types])
  userTypes: User_Types[];
  @Field()
  hasMore: boolean;
}

@Resolver(User_Types)
export class UserTypeResolver {
  @FieldResolver(() => String)
  textSnippet(@Root() userType: User_Types) {
    return userType.name.slice(0, 50);
  }

  // @FieldResolver(() => User)
  // creator(@Root() year: Year, @Ctx() { userLoader }: MyContext) {
  //   return userLoader.load(year.creatorId);
  // }

  @Query(() => PaginatedUserTypes)
  async userTypes(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null
  ): Promise<PaginatedUserTypes> {
    // 20 -> 21
    const realLimit = Math.min(50, limit);
    const reaLimitPlusOne = realLimit + 1;

    const replacements: any[] = [reaLimitPlusOne];

    if (cursor) {
      replacements.push(new Date(parseInt(cursor)));
    }

    const userTypes = await getConnection().query(
      // `
      // select y.*
      // from years y
      // ${cursor ? `where y."createdAt" < $2` : ""}
      // order by p."createdAt" DESC
      // limit $1
      // `,
      `
      select c.*
      from combinations c
      limit $1
      `,
      replacements
    );

    // const qb = getConnection()
    //   .getRepository(Post)
    //   .createQueryBuilder("p")
    //   .innerJoinAndSelect("p.creator", "u", 'u.id = p."creatorId"')
    //   .orderBy('p."createdAt"', "DESC")
    //   .take(reaLimitPlusOne);

    // if (cursor) {
    //   qb.where('p."createdAt" < :cursor', {
    //     cursor: new Date(parseInt(cursor)),
    //   });
    // }

    // const posts = await qb.getMany();
    // console.log("posts: ", posts);

    return {
      userTypes: userTypes.slice(0, realLimit),
      hasMore: userTypes.length === reaLimitPlusOne,
    };
  }

  @Query(() => User_Types, { nullable: true })
  post(@Arg("user_type_id", () => Int) user_type_id: number): Promise<User_Types | undefined> {
    return User_Types.findOne(user_type_id);
  }

  @Mutation(() => User_Types)
  @UseMiddleware(isAuth)
  async createUserType(
    @Arg("input") input: UserTypeInput,
    @Ctx() { req }: MyContext
  ): Promise<User_Types> {
    console.log(req)
    return User_Types.create({
      ...input
      // ,
      // creatorId: req.session.userId,
    }).save();
  }

  @Mutation(() => User_Types, { nullable: true })
  @UseMiddleware(isAuth)
  async updateUserType(
    @Arg("user_type_id", () => Int) user_type_id: number,
    @Arg("name") name: string,
    @Ctx() { req }: MyContext
  ): Promise<User_Types | null> {
    console.log(req)
    const result = await getConnection()
      .createQueryBuilder()
      .update(User_Types)
      .set({ name })
      .where('user_type_id = :id'/*and "creatorId" = :creatorId'*/, {
        user_type_id
      //   ,
      //   creatorId: req.session.userId,
      })
      .returning("*")
      .execute();

    return result.raw[0];
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteUserType(
    @Arg("user_type_id", () => Int) user_type_id: number,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    console.log(req)
    // not cascade way
    // const post = await Post.findOne(id);
    // if (!post) {
    //   return false;
    // }
    // if (post.creatorId !== req.session.userId) {
    //   throw new Error("not authorized");
    // }

    // await Updoot.delete({ postId: id });
    // await Post.delete({ id });

    await User_Types.delete({ user_type_id /*, creatorId: req.session.userId*/ });
    return true;
  }
}
