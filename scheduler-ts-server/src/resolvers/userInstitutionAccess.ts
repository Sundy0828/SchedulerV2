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
import { UserInstitutionAccess } from "../entities/UserInstitutionAccess";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types";

@InputType()
class UserInstitutionAccessInput {
  @Field()
  institution_id: number;
}

@ObjectType()
class PaginatedUserInstitutionAccesses {
  @Field(() => [UserInstitutionAccess])
  userInstitutionAccesses: UserInstitutionAccess[];
  @Field()
  hasMore: boolean;
}

@Resolver(UserInstitutionAccess)
export class UserInstitutionAccessResolver {
  @FieldResolver(() => String)
  textSnippet(@Root() userInstitutionAccess: UserInstitutionAccess) {
    return UserInstitutionAccess.name.slice(0, 50);
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

  @Query(() => UserInstitutionAccess, { nullable: true })
  post(@Arg("user_id", () => Int) user_id: number): Promise<UserInstitutionAccess | undefined> {
    return UserInstitutionAccess.findOne(user_id);
  }

  @Mutation(() => UserInstitutionAccess)
  @UseMiddleware(isAuth)
  async createUserInstitutionAccess(
    @Arg("input") input: UserInstitutionAccessInput,
    @Ctx() { req }: MyContext
  ): Promise<UserInstitutionAccess> {
    return UserInstitutionAccess.create({
      ...input
      // ,
      // creatorId: req.session.userId,
    }).save();
  }

  @Mutation(() => UserInstitutionAccess, { nullable: true })
  @UseMiddleware(isAuth)
  async updateUserInstitutionAccess(
    @Arg("user_id", () => Int) user_id: number,
    @Arg("institution_id") institution_id: number,
    @Ctx() { req }: MyContext
  ): Promise<UserInstitutionAccess | null> {
    const result = await getConnection()
      .createQueryBuilder()
      .update(UserInstitutionAccess)
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

    await UserInstitutionAccess.delete({ user_id /*, creatorId: req.session.userId*/ });
    return true;
  }
}
