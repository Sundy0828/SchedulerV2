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
  import { Combinations } from "../entities/Combinations";
  import { isAuth } from "../middleware/isAuth";
  import { MyContext } from "../types";
  
  /**
   * This is similar to a type/interface, this is just the graphql way. Use this instead of passing multiple values as arguments
   * 
  */
  @InputType()
  class CombinationInput {
    @Field()
    logical_operator: string;
  }
  
  /**
   * This is similar to a type/interface, this is just the graphql way. Use this instead of passing multiple values as arguments
   * 
  */
  @ObjectType()
  class PaginatedCombinations {
    @Field(() => [Combinations])
    combinations: Combinations[];
    @Field()
    hasMore: boolean;
  }
  
  /**
   * Main Resovler For Combinations
   * 
  */
  @Resolver(Combinations)
  export class CombinationResolver {
    @FieldResolver(() => String)
    textSnippet(@Root() capability: Combinations) {
      return capability.logical_operator.slice(0, 50);
    }
  
    /**
    * This is the function you will hit to grab all Institutions
    * 
    */
    @Query(() => PaginatedCombinations)
    async getAllCombinations(
    ): Promise<PaginatedCombinations> {
      return  {
        combinations: await Combinations.find(),
        hasMore: false
      }
    }
    
    /**
     * This is the function you will hit to grab a select amount of Combinations
     * @param {Number} limit The amount of records you want back if more than 50 are specified it will return 50
     * 
    */
    @Query(() => PaginatedCombinations)
    async getPaginatedCombinations(
      @Arg("limit", () => Int) limit: number,
    ): Promise<PaginatedCombinations> {
      const realLimit = Math.min(50, limit);
      const reaLimitPlusOne = realLimit + 1;

      const replacements: any[] = [reaLimitPlusOne];
      const query = "SELECT * FROM combinations limit $1";

      const combinations = await getConnection().query(
        query,
        replacements
      );

      return {
        combinations: combinations.slice(0, realLimit),
        hasMore: combinations.length === reaLimitPlusOne,
      };
    }
  
    /**
     * This function will return a single Combination based on the id that is passed
     * @param {Number} capability_id Apply a combination id to return a single record
     * 
    */
    @Query(() => Combinations, { nullable: true })
    post(@Arg("combination_id", () => Int) capability_id: number): Promise<Combinations | undefined> {
      return Combinations.findOne(capability_id);
    }
  
    /**
     * This function will create an Combination
     * @param {String} name Pass a Combination name to be created
     * 
    */
    @Mutation(() => Combinations)
    @UseMiddleware(isAuth)
    async createCombination(
      @Arg("input") input: CombinationInput,
      @Ctx() { req }: MyContext
    ): Promise<Combinations> {
      console.log(req)
      return Combinations.create({
        ...input
        // ,
        // creatorId: req.session.userId,
      }).save();
    }
  
    /**
     * This function will update an Combination
     * @param {Number} combination_id Pass an Combination Id
     * @param {String} logical_operator Pass an Combination logical operator to be update
     * 
    */
    @Mutation(() => Combinations, { nullable: true })
    @UseMiddleware(isAuth)
    async updateCombination(
      @Arg("combination_id", () => Int) combination_id: number,
      @Arg("logical_operator") logical_operator: string,
      @Ctx() { req }: MyContext
    ): Promise<Combinations | null> {
      console.log(req)
      const result = await getConnection()
        .createQueryBuilder()
        .update(Combinations)
        .set({ logical_operator })
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
     * This function will delete an Institution
     * @param {String} combination_id Pass an Combination id 
     * 
    */
    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async deleteCombination(
      @Arg("combination_id", () => Int) combination_id: number,
      @Ctx() { req }: MyContext
    ): Promise<boolean> {
      console.log(req)
      await Combinations.delete({ combination_id /*, creatorId: req.session.userId*/ });
      return true;
    }
  }
  