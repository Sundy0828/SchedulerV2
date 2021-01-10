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
    console.log(userTypeCapabilites)
    return;
    //return userTypeCapabilites.capability_id.slice(0, 50);
  }

  /**
   * This is the function you will hit to grab all Institutions
   * 
  */
  @Query(() => PaginatedUserTypeCapabilites)
  async getAllUserTypeCapabilites(
  ): Promise<PaginatedUserTypeCapabilites> {
    return  {
      userTypeCapabilites: await UserTypeCapabilites.find(),
      hasMore: false
    }
  }

  @Query(() => PaginatedUserTypeCapabilites)
  async getPaginatedUserTypeCapabilites(
    @Arg("limit", () => Int) limit: number,
  ): Promise<PaginatedUserTypeCapabilites> {
    const realLimit = Math.min(50, limit);
    const reaLimitPlusOne = realLimit + 1;

    const replacements: any[] = [reaLimitPlusOne];
    const query = "SELECT * FROM user_type_capabilites limit $1";

    const userTypeCapabilites = await getConnection().query(
      query,
      replacements
    );

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
    console.log(req)
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
    console.log(req)
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
    console.log(req)
    await UserTypeCapabilites.delete({ user_type_id /*, creatorId: req.session.userId*/ });
    return true;
  }
}
