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
import { Courses } from "../entities/Courses";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types";

@InputType()
class CourseInput {
  @Field()
  prerequisite_combination_id: number;
  name: string;
  credits: number;
  code: number;
  semesters_available: number;
  years_available: number;
}

@ObjectType()
class PaginatedCourses {
  @Field(() => [Courses])
  courses: Courses[];
  @Field()
  hasMore: boolean;
}

@Resolver(Courses)
export class CoursesResolver {
  @FieldResolver(() => String)
  textSnippet(@Root() course: Courses) {
    return course.name.slice(0, 50);
  }

  /**
   * This is the function you will hit to grab all Institutions
   * 
  */
  @Query(() => PaginatedCourses)
  async getAllCourses(
  ): Promise<PaginatedCourses> {
    return  {
      courses: await Courses.find(),
      hasMore: false
    }
  }

  @Query(() => PaginatedCourses)
  async getPaginatedCourses(
    @Arg("limit", () => Int) limit: number,
  ): Promise<PaginatedCourses> {
    const realLimit = Math.min(50, limit);
    const reaLimitPlusOne = realLimit + 1;

    const replacements: any[] = [reaLimitPlusOne];
    const query = "SELECT * FROM courses limit $1";

    const courses = await getConnection().query(
      query,
      replacements
    );

    return {
      courses: courses.slice(0, realLimit),
      hasMore: courses.length === reaLimitPlusOne,
    };
  }

  @Query(() => Courses, { nullable: true })
  post(@Arg("combination_id", () => Int) capability_id: number): Promise<Courses | undefined> {
    return Courses.findOne(capability_id);
  }

  @Mutation(() => Courses)
  @UseMiddleware(isAuth)
  async createCourse(
    @Arg("input") input: CourseInput,
    @Ctx() { req }: MyContext
  ): Promise<Courses> {
    console.log(req)
    return Courses.create({
      ...input
      // ,
      // creatorId: req.session.userId,
    }).save();
  }

  @Mutation(() => Courses, { nullable: true })
  @UseMiddleware(isAuth)
  async updateCourse(
    @Arg("course_id", () => Int) course_id: number,
    @Arg("prerequisite_combination_id") prerequisite_combination_id: number,
    @Arg("name") name: string,
    @Arg("credits") credits: number,
    @Arg("code") code: number,
    @Arg("semesters_available") semesters_available: number,
    @Arg("years_available") years_available: number,
    @Ctx() { req }: MyContext
  ): Promise<Courses | null> {
    console.log(req)
    const result = await getConnection()
      .createQueryBuilder()
      .update(Courses)
      .set({   prerequisite_combination_id,name,credits,code,semesters_available,years_available })
      .where('course_id = :id'/*and "creatorId" = :creatorId'*/, {
        course_id
      //   ,
      //   creatorId: req.session.userId,
      })
      .returning("*")
      .execute();

    return result.raw[0];
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteCourse(
    @Arg("course_id", () => Int) course_id: number,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    console.log(req)
    await Courses.delete({ course_id /*, creatorId: req.session.userId*/ });
    return true;
  }
}
