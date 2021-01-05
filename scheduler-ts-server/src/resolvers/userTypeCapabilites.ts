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
import { UserTypeCapabilites } from "../entities/UserTypeCapabilites";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types";

@InputType()
class UserTypeCapabilitesInput {
  @Field()
  capability_id: number;
}

@ObjectType()
class PaginatedUserTypeCapabilites {
  @Field(() => [UserTypeCapabilites])
  userTypeCapabilites: UserTypeCapabilites[];
  @Field()
  hasMore: boolean;
}

@Resolver(UserTypeCapabilites)
export class UserTypeCapabilitesResolver {
  @FieldResolver(() => String)
  textSnippet(@Root() userTypeCapabilites: UserTypeCapabilites) {
    return;
    //return userTypeCapabilites.capability_id.slice(0, 50);
  }

  // @FieldResolver(() => User)
  // creator(@Root() year: Year, @Ctx() { userLoader }: MyContext) {
  //   return userLoader.load(year.creatorId);
  // }

  @Query(() => PaginatedUserTypeCapabilites)
  async userTypeCapabilites(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null
  ): Promise<PaginatedUserTypeCapabilites> {
    // 20 -> 21
    const realLimit = Math.min(50, limit);
    const reaLimitPlusOne = realLimit + 1;

    const replacements: any[] = [reaLimitPlusOne];

    if (cursor) {
      replacements.push(new Date(parseInt(cursor)));
    }

    const userTypeCapabilites = await getConnection().query(
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
      userTypeCapabilites: userTypeCapabilites.slice(0, realLimit),
      hasMore: userTypeCapabilites.length === reaLimitPlusOne,
    };
  }

  @Query(() => UserTypeCapabilites, { nullable: true })
  post(@Arg("user_type_id", () => Int) user_type_id: number): Promise<UserTypeCapabilites | undefined> {
    return UserTypeCapabilites.findOne(user_type_id);
  }

  @Mutation(() => UserTypeCapabilites)
  @UseMiddleware(isAuth)
  async createUserTypeCapability(
    @Arg("input") input: UserTypeCapabilitesInput,
    @Ctx() { req }: MyContext
  ): Promise<UserTypeCapabilites> {
    return UserTypeCapabilites.create({
      ...input
      // ,
      // creatorId: req.session.userId,
    }).save();
  }

  @Mutation(() => UserTypeCapabilites, { nullable: true })
  @UseMiddleware(isAuth)
  async updateUserTypeCapability(
    @Arg("user_type_id", () => Int) user_type_id: number,
    @Arg("capability_id") capability_id: number,
    @Ctx() { req }: MyContext
  ): Promise<UserTypeCapabilites | null> {
    const result = await getConnection()
      .createQueryBuilder()
      .update(UserTypeCapabilites)
      .set({ capability_id })
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
  async deleteUserTypeCapability(
    @Arg("user_type_id", () => Int) user_type_id: number,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
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

    await UserTypeCapabilites.delete({ user_type_id /*, creatorId: req.session.userId*/ });
    return true;
  }
}
