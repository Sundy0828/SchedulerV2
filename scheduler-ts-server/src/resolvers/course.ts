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
import { Course } from "../entities/Course";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types";

@InputType()
class CourseInput {
  @Field()
  prequisite_combination_id: number;
  name: string;
  credits: number;
  code: number;
  semester_available: number;
  years_available: number;
}

@ObjectType()
class PaginatedCourses {
  @Field(() => [Course])
  courses: Course[];
  @Field()
  hasMore: boolean;
}

@Resolver(Course)
export class PaginatedCourseResolver {
  @FieldResolver(() => String)
  textSnippet(@Root() course: Course) {
    return course.name.slice(0, 50);
  }

  // @FieldResolver(() => User)
  // creator(@Root() year: Year, @Ctx() { userLoader }: MyContext) {
  //   return userLoader.load(year.creatorId);
  // }

  @Query(() => PaginatedCourses)
  async courses(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null
  ): Promise<PaginatedCourses> {
    // 20 -> 21
    const realLimit = Math.min(50, limit);
    const reaLimitPlusOne = realLimit + 1;

    const replacements: any[] = [reaLimitPlusOne];

    if (cursor) {
      replacements.push(new Date(parseInt(cursor)));
    }

    const courses = await getConnection().query(
      // `
      // select y.*
      // from years y
      // ${cursor ? `where y."createdAt" < $2` : ""}
      // order by p."createdAt" DESC
      // limit $1
      // `,
      `
      select c.*
      from courses c
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
      courses: courses.slice(0, realLimit),
      hasMore: courses.length === reaLimitPlusOne,
    };
  }

  @Query(() => Course, { nullable: true })
  post(@Arg("combination_id", () => Int) capability_id: number): Promise<Course | undefined> {
    return Course.findOne(capability_id);
  }

  @Mutation(() => Course)
  @UseMiddleware(isAuth)
  async createCourse(
    @Arg("input") input: CourseInput,
    @Ctx() { req }: MyContext
  ): Promise<Course> {
    return Course.create({
      ...input
      // ,
      // creatorId: req.session.userId,
    }).save();
  }

  @Mutation(() => Course, { nullable: true })
  @UseMiddleware(isAuth)
  async updateCourse(
    @Arg("course_id", () => Int) course_id: number,
    @Arg("prequisite_combination_id") prequisite_combination_id: number,
    @Arg("name") name: string,
    @Arg("credits") credits: number,
    @Arg("code") code: number,
    @Arg("semester_available") semester_available: number,
    @Arg("years_available") years_available: number,
    @Ctx() { req }: MyContext
  ): Promise<Course | null> {
    const result = await getConnection()
      .createQueryBuilder()
      .update(Course)
      .set({ prequisite_combination_id,name,credits,code,semester_available,years_available })
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

    await Course.delete({ course_id /*, creatorId: req.session.userId*/ });
    return true;
  }
}
