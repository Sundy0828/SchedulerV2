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
import { Course_Semesters } from "../entities/Course_Semesters";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types";

@InputType()
class UserSemestersInput {
  @Field()
  course_id: number;
  @Field()
  semester_id: number;
}

@ObjectType()
class PaginatedUserSemesters {
  @Field(() => [Course_Semesters])
  userSemesters: Course_Semesters[];
  @Field()
  hasMore: boolean;
}

@Resolver(Course_Semesters)
export class UserSemesterResolver {
  @FieldResolver(() => String)
  textSnippet(@Root() userSemester: Course_Semesters) {
    console.log(userSemester)
    return Course_Semesters.name.slice(0, 50);
  }

  /**
   * This is the function you will hit to grab all Institutions
   * 
  */
  @Query(() => PaginatedUserSemesters)
  async getAllUserSemesters(
  ): Promise<PaginatedUserSemesters> {
    return  {
      userSemesters: await Course_Semesters.find(),
      hasMore: false
    }
  }

  @Query(() => PaginatedUserSemesters)
  async getPaginatedUserSemesters(
    @Arg("limit", () => Int) limit: number,
  ): Promise<PaginatedUserSemesters> {
    const realLimit = Math.min(50, limit);
    const reaLimitPlusOne = realLimit + 1;

    const replacements: any[] = [reaLimitPlusOne];
    const query = "SELECT * FROM course_semesters limit $1";

    const userSemesters = await getConnection().query(
      query,
      replacements
    );

    return {
      userSemesters: userSemesters.slice(0, realLimit),
      hasMore: userSemesters.length === reaLimitPlusOne,
    };
  }

  @Query(() => Course_Semesters, { nullable: true })
  post(@Arg("user_id", () => Int) user_id: number): Promise<Course_Semesters | undefined> {
    return Course_Semesters.findOne(user_id);
  }

  @Mutation(() => Course_Semesters)
  @UseMiddleware(isAuth)
  async createUserSemester(
    @Arg("input") input: UserSemestersInput,
    @Ctx() { req }: MyContext
  ): Promise<Course_Semesters> {
    console.log(req)
    return Course_Semesters.create({
      ...input
      // ,
      // creatorId: req.session.userId,
    }).save();
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteUserSemester(
    @Arg("course_id", () => Int) course_id: number,
    @Arg("semester_id", () => Int) semester_id: number,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    console.log(req)
    await Course_Semesters.delete({ course_id, semester_id /*, creatorId: req.session.userId*/ });
    return true;
  }
}
