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
import { Discipline_Courses } from "../entities/Discipline_Courses";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types";

@InputType()
class DisciplineCourseInput {
  @Field()
  course_id: number;
}

@ObjectType()
class PaginatedDisciplineCourses {
  @Field(() => [Discipline_Courses])
  disciplineCourses: Discipline_Courses[];
  @Field()
  hasMore: boolean;
}

@Resolver(Discipline_Courses)
export class DisciplineCourseResolver {
  @FieldResolver(() => String)
  textSnippet(@Root() disciplineCourse: Discipline_Courses) {
    console.log(disciplineCourse)
    return;
    //return DisciplineCourse.cou.slice(0, 50);
  }

  /**
   * This is the function you will hit to grab all Institutions
   * 
  */
  @Query(() => PaginatedDisciplineCourses)
  async getAllDisciplineCourses(
  ): Promise<PaginatedDisciplineCourses> {
    return  {
      disciplineCourses: await Discipline_Courses.find(),
      hasMore: false
    }
  }

  @Query(() => PaginatedDisciplineCourses)
  async getPaginatedDisciplineCourses(
    @Arg("limit", () => Int) limit: number,
  ): Promise<PaginatedDisciplineCourses> {
    const realLimit = Math.min(50, limit);
    const reaLimitPlusOne = realLimit + 1;

    const replacements: any[] = [reaLimitPlusOne];
    const query = "SELECT * FROM discipline_courses limit $1";

    const disciplineCourses = await getConnection().query(
      query,
      replacements
    );

    return {
      disciplineCourses: disciplineCourses.slice(0, realLimit),
      hasMore: disciplineCourses.length === reaLimitPlusOne,
    };
  }

  @Query(() => Discipline_Courses, { nullable: true })
  post(@Arg("discipline_id", () => Int) discipline_id: number): Promise<Discipline_Courses | undefined> {
    return Discipline_Courses.findOne(discipline_id);
  }

  @Mutation(() => Discipline_Courses)
  @UseMiddleware(isAuth)
  async createCombination(
    @Arg("input") input: DisciplineCourseInput,
    @Ctx() { req }: MyContext
  ): Promise<Discipline_Courses> {
    console.log(req)
    return Discipline_Courses.create({
      ...input
      // ,
      // creatorId: req.session.userId,
    }).save();
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteDisciplineCourse(
    @Arg("discipline_id", () => Int) discipline_id: number,
    @Ctx() { req }: MyContext
  ): Promise<boolean> { 
    console.log(req)
    await Discipline_Courses.delete({ discipline_id /*, creatorId: req.session.userId*/ });
    return true;
  }
}
