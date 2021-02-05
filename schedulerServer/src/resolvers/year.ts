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
  import { Years } from "../entities/Years";
  import { isAuth } from "../middleware/isAuth";
  import { MyContext } from "../types";
  
  @InputType()
  class YearInput {
    @Field()
    name: string;
    @Field()
    institution_id: number;
  }
  
  @ObjectType()
  class PaginatedYears {
    @Field(() => [Years])
    years: Years[];
    @Field()
    hasMore: boolean;
  }
  
  @Resolver(Years)
  export class YearResolver {
    @FieldResolver(() => String)
    textSnippet(@Root() year: Years) {
      return year.name.slice(0, 50);
    }
  
    /**
    * This is the function you will hit to grab all Institutions
    * 
    */
    @Query(() => PaginatedYears)
    async getAllYears(
    ): Promise<PaginatedYears> {
      return  {
        years: await Years.find(),
        hasMore: false
      }
    }
  
    @Query(() => PaginatedYears)
    async getPaginatedYears(
      @Arg("limit", () => Int) limit: number,
    ): Promise<PaginatedYears> {
      const realLimit = Math.min(50, limit);
      const reaLimitPlusOne = realLimit + 1;

      const replacements: any[] = [reaLimitPlusOne];
      const query = "SELECT * FROM years limit $1";

      const years = await getConnection().query(
        query,
        replacements
      );

      return {
        years: years.slice(0, realLimit),
        hasMore: years.length === reaLimitPlusOne,
      };
    }
  
    @Query(() => Years, { nullable: true })
    post(@Arg("year_id", () => Int) year_id: number): Promise<Years | undefined> {
      return Years.findOne(year_id);
    }
  
    @Mutation(() => Years)
    @UseMiddleware(isAuth)
    async createYear(
      @Arg("input") input: YearInput,
      @Ctx() { req }: MyContext
    ): Promise<Years> {
      console.log(req)
      return Years.create({
        ...input
        // ,
        // creatorId: req.session.userId,
      }).save();
    }
  
    @Mutation(() => Years, { nullable: true })
    @UseMiddleware(isAuth)
    async updateYear(
      @Arg("year_id", () => Int) year_id: number,
      @Arg("name") name: string,
      @Arg("institutions_id") institution_id: number,
      @Ctx() { req }: MyContext
    ): Promise<Years | null> {
      console.log(req)
      const result = await getConnection()
        .createQueryBuilder()
        .update(Years)
        .set({ name, institution_id })
        .where('year_id = :id'/*and "creatorId" = :creatorId'*/, {
          year_id
        //   ,
        //   creatorId: req.session.userId,
        })
        .returning("*")
        .execute();
  
      return result.raw[0];
    }
  
    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async deleteYear(
      @Arg("year_id", () => Int) year_id: number,
      @Ctx() { req }: MyContext
    ): Promise<boolean> {
      console.log(req)
      await Years.delete({ year_id /*, creatorId: req.session.userId*/ });
      return true;
    }
  }
  