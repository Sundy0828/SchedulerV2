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
import { Course_Years } from "../entities/Course_Years";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types";

@InputType()
class UserYearsInput {
  @Field()
  course_id: number;
  @Field()
  year_id: number;
}

@ObjectType()
class PaginatedUserYears {
  @Field(() => [Course_Years])
  userYears: Course_Years[];
  @Field()
  hasMore: boolean;
}

@Resolver(Course_Years)
export class UserYearResolver {
  @FieldResolver(() => String)
  textSnippet(@Root() userYear: Course_Years) {
    console.log(userYear)
    return Course_Years.name.slice(0, 50);
  }

  /**
   * This is the function you will hit to grab all Institutions
   * 
  */
  @Query(() => PaginatedUserYears)
  async getAllUserYears(
  ): Promise<PaginatedUserYears> {
    return  {
      userYears: await Course_Years.find(),
      hasMore: false
    }
  }

  @Query(() => PaginatedUserYears)
  async getPaginatedUserYears(
    @Arg("limit", () => Int) limit: number,
  ): Promise<PaginatedUserYears> {
    const realLimit = Math.min(50, limit);
    const reaLimitPlusOne = realLimit + 1;

    const replacements: any[] = [reaLimitPlusOne];
    const query = "SELECT * FROM course_years limit $1";

    const userYears = await getConnection().query(
      query,
      replacements
    );

    return {
      userYears: userYears.slice(0, realLimit),
      hasMore: userYears.length === reaLimitPlusOne,
    };
  }

  @Query(() => Course_Years, { nullable: true })
  post(@Arg("user_id", () => Int) user_id: number): Promise<Course_Years | undefined> {
    return Course_Years.findOne(user_id);
  }

  @Mutation(() => Course_Years)
  @UseMiddleware(isAuth)
  async createUserYear(
    @Arg("input") input: UserYearsInput,
    @Ctx() { req }: MyContext
  ): Promise<Course_Years> {
    console.log(req)
    return Course_Years.create({
      ...input
      // ,
      // creatorId: req.session.userId,
    }).save();
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteUserYear(
    @Arg("course_id", () => Int) course_id: number,
    @Arg("year_id", () => Int) year_id: number,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    console.log(req)
    await Course_Years.delete({ course_id, year_id /*, creatorId: req.session.userId*/ });
    return true;
  }
}
