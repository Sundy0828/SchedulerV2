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
  import { Combination_Courses } from "../entities/Combination_Courses";
  import { isAuth } from "../middleware/isAuth";
  import { MyContext } from "../types";
  
  @InputType()
  class CombinationCourseInput {
    @Field()
    course_id: number;
    @Field()
    sub_combination_id: number;
  }
  
  @ObjectType()
  class PaginatedCombinationCourses {
    @Field(() => [CombinationCourseInput])
    combinationCourses: CombinationCourseInput[];
    @Field()
    hasMore: boolean;
  }
  
  @Resolver(Combination_Courses)
  export class CombinationCourseResolver {
    @FieldResolver(() => String)
    textSnippet(@Root() combinationCourse: Combination_Courses) {
      console.log(combinationCourse)
      return;
      //return combinationCourse.course_id.slice(0, 50);
    }
  
    // @FieldResolver(() => User)
    // creator(@Root() year: Year, @Ctx() { userLoader }: MyContext) {
    //   return userLoader.load(year.creatorId);
    // }
  
    @Query(() => PaginatedCombinationCourses)
    async combinationCourses(
      @Arg("limit", () => Int) limit: number,
      @Arg("cursor", () => String, { nullable: true }) cursor: string | null
    ): Promise<PaginatedCombinationCourses> {
      // 20 -> 21
      const realLimit = Math.min(50, limit);
      const reaLimitPlusOne = realLimit + 1;
  
      const replacements: any[] = [reaLimitPlusOne];
  
      if (cursor) {
        replacements.push(new Date(parseInt(cursor)));
      }
  
      const combinationCourses = await getConnection().query(
        // `
        // select y.*
        // from years y
        // ${cursor ? `where y."createdAt" < $2` : ""}
        // order by p."createdAt" DESC
        // limit $1
        // `,
        `
        select cc.*
        from combination_courses cc
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
        combinationCourses: combinationCourses.slice(0, realLimit),
        hasMore: combinationCourses.length === reaLimitPlusOne,
      };
    }
  
    @Query(() => Combination_Courses, { nullable: true })
    post(@Arg("combination_id", () => Int) combination_id: number): Promise<Combination_Courses | undefined> {
      return Combination_Courses.findOne(combination_id);
    }
  
    @Mutation(() => Combination_Courses)
    @UseMiddleware(isAuth)
    async createCombinationCourse(
      @Arg("input") input: CombinationCourseInput,
      @Ctx() { req }: MyContext
    ): Promise<Combination_Courses> {
      console.log(req)
      return Combination_Courses.create({
        ...input
        // ,
        // creatorId: req.session.userId,
      }).save();
    }
  
    @Mutation(() => Combination_Courses, { nullable: true })
    @UseMiddleware(isAuth)
    async updateCombinationCourse(
      @Arg("combination_id", () => Int) combination_id: number,
      @Arg("course_id") course_id: number,
      @Arg("sub_combination_id") sub_combination_id: number,
      @Ctx() { req }: MyContext
    ): Promise<Combination_Courses | null> {
      console.log(req)
      const result = await getConnection()
        .createQueryBuilder()
        .update(Combination_Courses)
        .set({ course_id, sub_combination_id })
        .where('combination_id = :id'/*and "creatorId" = :creatorId'*/, {
          combination_id
        //   ,
        //   creatorId: req.session.userId,
        })
        .returning("*")
        .execute();
  
      return result.raw[0];
    }
  
    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async deleteCombinationCourse(
      @Arg("combination_id", () => Int) combination_id: number,
      @Ctx() { req }: MyContext
    ): Promise<boolean> {
      console.log(req)
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
  
      await Combination_Courses.delete({ combination_id /*, creatorId: req.session.userId*/ });
      return true;
    }
  }
  