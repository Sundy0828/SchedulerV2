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
    console.log(userInstitutionAccess)
    return UserInstitutionAccess.name.slice(0, 50);
  }

  /**
   * This is the function you will hit to grab all Institutions
   * 
  */
  @Query(() => PaginatedUserInstitutionAccesses)
  async getAllUserInstitutionAccesses(
  ): Promise<PaginatedUserInstitutionAccesses> {
    return  {
      userInstitutionAccesses: await UserInstitutionAccess.find(),
      hasMore: false
    }
  }

  @Query(() => PaginatedUserInstitutionAccesses)
  async getPaginatedUserInstitutionAccesses(
    @Arg("limit", () => Int) limit: number,
  ): Promise<PaginatedUserInstitutionAccesses> {
    const realLimit = Math.min(50, limit);
    const reaLimitPlusOne = realLimit + 1;

    const replacements: any[] = [reaLimitPlusOne];
    const query = "SELECT * FROM user_institution_access limit $1";

    const userInstitutionAccesses = await getConnection().query(
      query,
      replacements
    );

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
    console.log(req)
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
    console.log(req)
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
    console.log(req)
    await UserInstitutionAccess.delete({ user_id /*, creatorId: req.session.userId*/ });
    return true;
  }
}
