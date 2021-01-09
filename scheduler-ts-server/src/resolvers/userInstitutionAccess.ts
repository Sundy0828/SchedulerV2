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
import { User_Institution_Access } from "../entities/User_Institution_Access";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types";

@InputType()
class UserInstitutionAccessInput {
  @Field()
  institution_id: number;
}

@ObjectType()
class PaginatedUserInstitutionAccesses {
  @Field(() => [User_Institution_Access])
  userInstitutionAccesses: User_Institution_Access[];
  @Field()
  hasMore: boolean;
}

@Resolver(User_Institution_Access)
export class UserInstitutionAccessResolver {
  @FieldResolver(() => String)
  textSnippet(@Root() userInstitutionAccess: User_Institution_Access) {
    console.log(userInstitutionAccess)
    return User_Institution_Access.name.slice(0, 50);
  }

  // @FieldResolver(() => User)
  // creator(@Root() year: Year, @Ctx() { userLoader }: MyContext) {
  //   return userLoader.load(year.creatorId);
  // }

  @Query(() => PaginatedUserInstitutionAccesses)
  async userInstitutionAccesses(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null
  ): Promise<PaginatedUserInstitutionAccesses> {
    // 20 -> 21
    const realLimit = Math.min(50, limit);
    const reaLimitPlusOne = realLimit + 1;

    const replacements: any[] = [reaLimitPlusOne];

    if (cursor) {
      replacements.push(new Date(parseInt(cursor)));
    }

    const userInstitutionAccesses = await getConnection().query(
      // `
      // select y.*
      // from years y
      // ${cursor ? `where y."createdAt" < $2` : ""}
      // order by p."createdAt" DESC
      // limit $1
      // `,
      `
      select u.*
      from user_institution_accesses u
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
      userInstitutionAccesses: userInstitutionAccesses.slice(0, realLimit),
      hasMore: userInstitutionAccesses.length === reaLimitPlusOne,
    };
  }

  @Query(() => User_Institution_Access, { nullable: true })
  post(@Arg("user_id", () => Int) user_id: number): Promise<User_Institution_Access | undefined> {
    return User_Institution_Access.findOne(user_id);
  }

  @Mutation(() => User_Institution_Access)
  @UseMiddleware(isAuth)
  async createUserInstitutionAccess(
    @Arg("input") input: UserInstitutionAccessInput,
    @Ctx() { req }: MyContext
  ): Promise<User_Institution_Access> {
    console.log(req)
    return User_Institution_Access.create({
      ...input
      // ,
      // creatorId: req.session.userId,
    }).save();
  }

  @Mutation(() => User_Institution_Access, { nullable: true })
  @UseMiddleware(isAuth)
  async updateUserInstitutionAccess(
    @Arg("user_id", () => Int) user_id: number,
    @Arg("institution_id") institution_id: number,
    @Ctx() { req }: MyContext
  ): Promise<User_Institution_Access | null> {
    console.log(req)
    const result = await getConnection()
      .createQueryBuilder()
      .update(User_Institution_Access)
      .set({ institution_id })
      .where('user_id = :id'/*and "creatorId" = :creatorId'*/, {
        user_id
      //   ,
      //   creatorId: req.session.userId,
      })
      .returning("*")
      .execute();

    return result.raw[0];
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteUserInstitutionAccess(
    @Arg("user_id", () => Int) user_id: number,
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

    await User_Institution_Access.delete({ user_id /*, creatorId: req.session.userId*/ });
    return true;
  }
}
