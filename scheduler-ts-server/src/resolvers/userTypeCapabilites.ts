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
      userTypeCapabilites: await User_Type_Capabilites.find(),
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
    console.log(req)
    return User_Type_Capabilites.create({
      ...input
      // ,
      // creatorId: req.session.userId,
    }).save();
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteUserTypeCapability(
    @Arg("user_type_id", () => Int) user_type_id: number,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    console.log(req)
    await User_Type_Capabilites.delete({ user_type_id /*, creatorId: req.session.userId*/ });
    return true;
  }
}
