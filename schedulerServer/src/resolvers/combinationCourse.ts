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
  import { CombinationCourses } from "../entities/CombinationCourses";
  import { isAuth } from "../middleware/isAuth";
  import { MyContext } from "../types";
  
  /**
   * This is similar to a type/interface, this is just the graphql way. Use this instead of passing multiple values as arguments
   * 
  */ 
  @InputType()
  class CombinationCourseInput {
    @Field()
    course_id: number;
    @Field()
    sub_combination_id: number;
  }
  
  /**
   * This is similar to a type/interface, this is just the graphql way. Use this instead of passing multiple values as arguments
   * 
  */
  @ObjectType()
  class PaginatedCombinationCourses {
    @Field(() => [CombinationCourses])
    combinationCourses: CombinationCourses[];
    @Field()
    hasMore: boolean;
  }
  
  /**
   * Main Resovler For Combination_Course
   * 
  */
  @Resolver(CombinationCourses)
  export class CombinationCourseResolver {
    @FieldResolver(() => String)
    textSnippet(@Root() combinationCourse: CombinationCourses) {
      console.log(combinationCourse)
      return;
      //return combinationCourse.course_id.slice(0, 50);
    }
  
    /**
     * This is the function you will hit to grab all Institutions
     * 
    */
    @Query(() => PaginatedCombinationCourses)
    async getAllCombinationCourses(
    ): Promise<PaginatedCombinationCourses> {
      return  {
        combinationCourses: await CombinationCourses.find(),
        hasMore: false
      }
    }
  
    /**
     * This is the function you will hit to grab a select amount of Combination_Courses
     * @param {Number} limit The amount of records you want back if more than 50 are specified it will return 50
     * 
    */
    @Query(() => PaginatedCombinationCourses)
    async getPaginatedCombinationCourses(
      @Arg("limit", () => Int) limit: number,
    ): Promise<PaginatedCombinationCourses> {
      const realLimit = Math.min(50, limit);
      const reaLimitPlusOne = realLimit + 1;
  
      const replacements: any[] = [reaLimitPlusOne];
      const query = "SELECT * FROM combination_courses limit $1";
  
      const combinationCourses = await getConnection().query(
        query,
        replacements
      );
  
      return {
        combinationCourses: combinationCourses.slice(0, realLimit),
        hasMore: combinationCourses.length === reaLimitPlusOne,
      };
    }
  
    /**
     * This function will return a single combination_course based on the id that is passed
     * @param {Number} combination_id Apply a combination_ id to return a single record
     * 
    */
    @Query(() => CombinationCourses, { nullable: true })
    post(@Arg("combination_id", () => Int) combination_id: number): Promise<CombinationCourses | undefined> {
      return CombinationCourses.findOne(combination_id);
    }
  
    /**
     * This function will create an Combination_Courses
     * @param {String} name Pass an Combination_Courses name to be created
     * 
    */
    @Mutation(() => CombinationCourses)
    @UseMiddleware(isAuth)
    async createCombinationCourse(
      @Arg("input") input: CombinationCourseInput,
      @Ctx() { req }: MyContext
    ): Promise<CombinationCourses> {
      console.log(req)
      return CombinationCourses.create({
        ...input
        // ,
        // creatorId: req.session.userId,
      }).save();
    }
    
    /**
     * This function will update an Institution
     * @param {Number} combination_id Pass an combination Id
     * @param {Number} course_id Pass an course id to be update
     * @param {Number} sub_combination_id Pass an sub combination id to be update
     * 
    */
    @Mutation(() => CombinationCourses, { nullable: true })
    @UseMiddleware(isAuth)
    async updateCombinationCourse(
      @Arg("combination_id", () => Int) combination_id: number,
      @Arg("course_id") course_id: number,
      @Arg("sub_combination_id") sub_combination_id: number,
      @Ctx() { req }: MyContext
    ): Promise<CombinationCourses | null> {
      console.log(req)
      const result = await getConnection()
        .createQueryBuilder()
        .update(CombinationCourses)
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
  
    /**
     * This function will delete an CombinationCourse
     * @param {String} combination_id Pass an CombinationCourse id 
     * 
    */
    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async deleteCombinationCourse(
      @Arg("combination_id", () => Int) combination_id: number,
      @Ctx() { req }: MyContext
    ): Promise<boolean> {
      console.log(req)
      await CombinationCourses.delete({ combination_id /*, creatorId: req.session.userId*/ });
      return true;
    }
  }
  