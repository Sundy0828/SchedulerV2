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
import { DisciplineCourse } from "../entities/DisciplineCourse";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types";

@InputType()
class DisciplineCourseInput {
  @Field()
  course_id: number;
}

@ObjectType()
class PaginatedDisciplineCourses {
  @Field(() => [DisciplineCourse])
  disciplineCourses: DisciplineCourse[];
  @Field()
  hasMore: boolean;
}

@Resolver(DisciplineCourse)
export class DisciplineCourseResolver {
  @FieldResolver(() => String)
  textSnippet(@Root() disciplineCourse: DisciplineCourse) {
    return;
    //return DisciplineCourse.cou.slice(0, 50);
  }

  // @FieldResolver(() => User)
  // creator(@Root() year: Year, @Ctx() { userLoader }: MyContext) {
  //   return userLoader.load(year.creatorId);
  // }

  @Query(() => PaginatedDisciplineCourses)
  async disciplineCourses(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null
  ): Promise<PaginatedDisciplineCourses> {
    // 20 -> 21
    const realLimit = Math.min(50, limit);
    const reaLimitPlusOne = realLimit + 1;

    const replacements: any[] = [reaLimitPlusOne];

    if (cursor) {
      replacements.push(new Date(parseInt(cursor)));
    }

    const disciplineCourses = await getConnection().query(
      // `
      // select y.*
      // from years y
      // ${cursor ? `where y."createdAt" < $2` : ""}
      // order by p."createdAt" DESC
      // limit $1
      // `,
      `
      select d.*
      from discipline_courses d
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
      disciplineCourses: disciplineCourses.slice(0, realLimit),
      hasMore: disciplineCourses.length === reaLimitPlusOne,
    };
  }

  @Query(() => DisciplineCourse, { nullable: true })
  post(@Arg("discipline_id", () => Int) discipline_id: number): Promise<DisciplineCourse | undefined> {
    return DisciplineCourse.findOne(discipline_id);
  }

  @Mutation(() => DisciplineCourse)
  @UseMiddleware(isAuth)
  async createCombination(
    @Arg("input") input: DisciplineCourseInput,
    @Ctx() { req }: MyContext
  ): Promise<DisciplineCourse> {
    return DisciplineCourse.create({
      ...input
      // ,
      // creatorId: req.session.userId,
    }).save();
  }

  @Mutation(() => DisciplineCourse, { nullable: true })
  @UseMiddleware(isAuth)
  async updateDisciplineCourse(
    @Arg("discipline_id", () => Int) discipline_id: number,
    @Arg("course_id") course_id: number,
    @Ctx() { req }: MyContext
  ): Promise<DisciplineCourse | null> {
    const result = await getConnection()
      .createQueryBuilder()
      .update(DisciplineCourse)
      .set({ course_id })
      .where('discipline_id = :id'/*and "creatorId" = :creatorId'*/, {
        discipline_id
      //   ,
      //   creatorId: req.session.userId,
      })
      .returning("*")
      .execute();

    return result.raw[0];
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteDisciplineCourse(
    @Arg("discipline_id", () => Int) discipline_id: number,
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

    await DisciplineCourse.delete({ discipline_id /*, creatorId: req.session.userId*/ });
    return true;
  }
}
