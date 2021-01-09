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
import { User_Type_Capabilites } from "../entities/User_Type_Capabilites";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types";

@InputType()
class UserTypeCapabilitesInput {
  @Field()
  capability_id: number;
}

@ObjectType()
class PaginatedUserTypeCapabilites {
  @Field(() => [User_Type_Capabilites])
  userTypeCapabilites: User_Type_Capabilites[];
  @Field()
  hasMore: boolean;
}

@Resolver(User_Type_Capabilites)
export class UserTypeCapabilitesResolver {
  @FieldResolver(() => String)
  textSnippet(@Root() userTypeCapabilites: User_Type_Capabilites) {
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

  @Query(() => User_Type_Capabilites, { nullable: true })
  post(@Arg("user_type_id", () => Int) user_type_id: number): Promise<User_Type_Capabilites | undefined> {
    return User_Type_Capabilites.findOne(user_type_id);
  }

  @Mutation(() => User_Type_Capabilites)
  @UseMiddleware(isAuth)
  async createUserTypeCapability(
    @Arg("input") input: UserTypeCapabilitesInput,
    @Ctx() { req }: MyContext
  ): Promise<User_Type_Capabilites> {
    return User_Type_Capabilites.create({
      ...input
      // ,
      // creatorId: req.session.userId,
    }).save();
  }

  @Mutation(() => User_Type_Capabilites, { nullable: true })
  @UseMiddleware(isAuth)
  async updateUserTypeCapability(
    @Arg("user_type_id", () => Int) user_type_id: number,
    @Arg("capability_id") capability_id: number,
    @Ctx() { req }: MyContext
  ): Promise<User_Type_Capabilites | null> {
    const result = await getConnection()
      .createQueryBuilder()
      .update(User_Type_Capabilites)
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

    await User_Type_Capabilites.delete({ user_type_id /*, creatorId: req.session.userId*/ });
    return true;
  }
}
