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
import { UserTypes } from "../entities/UserTypes";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types";

@InputType()
class UserTypeInput {
  @Field()
  name: string;
}

@ObjectType()
class PaginatedUserTypes {
  @Field(() => [UserTypes])
  userTypes: UserTypes[];
  @Field()
  hasMore: boolean;
}

@Resolver(UserTypes)
export class UserTypeResolver {
  @FieldResolver(() => String)
  textSnippet(@Root() userType: UserTypes) {
    return userType.name.slice(0, 50);
  }

  /**
   * This is the function you will hit to grab all Institutions
   * 
  */
  @Query(() => PaginatedUserTypes)
  async getAllUserTypes(
  ): Promise<PaginatedUserTypes> {
    return  {
      userTypes: await UserTypes.find(),
      hasMore: false
    }
  }

  @Query(() => PaginatedUserTypes)
  async getPaginatedUserTypes(
    @Arg("limit", () => Int) limit: number,
  ): Promise<PaginatedUserTypes> {
    const realLimit = Math.min(50, limit);
    const reaLimitPlusOne = realLimit + 1;

    const replacements: any[] = [reaLimitPlusOne];
    const query = "SELECT * FROM user_types limit $1";

    const userTypes = await getConnection().query(
      query,
      replacements
    );

    return {
      userTypes: userTypes.slice(0, realLimit),
      hasMore: userTypes.length === reaLimitPlusOne,
    };
  }

  @Query(() => UserTypes, { nullable: true })
  post(@Arg("user_type_id", () => Int) user_type_id: number): Promise<UserTypes | undefined> {
    return UserTypes.findOne(user_type_id);
  }

  @Mutation(() => UserTypes)
  @UseMiddleware(isAuth)
  async createUserType(
    @Arg("input") input: UserTypeInput,
    @Ctx() { req }: MyContext
  ): Promise<UserTypes> {
    console.log(req)
    return UserTypes.create({
      ...input
      // ,
      // creatorId: req.session.userId,
    }).save();
  }

  @Mutation(() => UserTypes, { nullable: true })
  @UseMiddleware(isAuth)
  async updateUserType(
    @Arg("user_type_id", () => Int) user_type_id: number,
    @Arg("name") name: string,
    @Ctx() { req }: MyContext
  ): Promise<UserTypes | null> {
    console.log(req)
    const result = await getConnection()
      .createQueryBuilder()
      .update(UserTypes)
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
    await UserTypes.delete({ user_type_id /*, creatorId: req.session.userId*/ });
    return true;
  }
}
