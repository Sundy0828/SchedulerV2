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

  /**
   * This is the function you will hit to grab all Institutions
   * 
  */
  @Query(() => PaginatedUserInstitutionAccesses)
  async getAllUserInstitutionAccesses(
  ): Promise<PaginatedUserInstitutionAccesses> {
    return  {
      userInstitutionAccesses: await User_Institution_Access.find(),
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

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteUserInstitutionAccess(
    @Arg("user_id", () => Int) user_id: number,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    console.log(req)
    await User_Institution_Access.delete({ user_id /*, creatorId: req.session.userId*/ });
    return true;
  }
}
