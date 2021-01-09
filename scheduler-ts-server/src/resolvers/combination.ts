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
  
  @InputType()
  class CombinationInput {
    @Field()
    logical_operator: string;
  }
  
  @ObjectType()
  class PaginatedCombinations {
    @Field(() => [Combinations])
    combinations: Combinations[];
    @Field()
    hasMore: boolean;
  }
  
  @Resolver(Combinations)
  export class CombinationResolver {
    @FieldResolver(() => String)
    textSnippet(@Root() capability: Combinations) {
      return capability.logical_operator.slice(0, 50);
    }
  
    // @FieldResolver(() => User)
    // creator(@Root() year: Year, @Ctx() { userLoader }: MyContext) {
    //   return userLoader.load(year.creatorId);
    // }
  
    @Query(() => PaginatedCombinations)
    async combinations(
      @Arg("limit", () => Int) limit: number,
      @Arg("cursor", () => String, { nullable: true }) cursor: string | null
    ): Promise<PaginatedCombinations> {
      // 20 -> 21
      const realLimit = Math.min(50, limit);
      const reaLimitPlusOne = realLimit + 1;
  
      const replacements: any[] = [reaLimitPlusOne];
  
      if (cursor) {
        replacements.push(new Date(parseInt(cursor)));
      }
  
      const combinations = await getConnection().query(
        // `
        // select y.*
        // from years y
        // ${cursor ? `where y."createdAt" < $2` : ""}
        // order by p."createdAt" DESC
        // limit $1
        // `,
        `
        select c.*
        from combinations c
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
        combinations: combinations.slice(0, realLimit),
        hasMore: combinations.length === reaLimitPlusOne,
      };
    }
  
    @Query(() => Combinations, { nullable: true })
    post(@Arg("combination_id", () => Int) capability_id: number): Promise<Combinations | undefined> {
      return Combinations.findOne(capability_id);
    }
  
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
  
    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async deleteCombination(
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
  
      await Combinations.delete({ combination_id /*, creatorId: req.session.userId*/ });
      return true;
    }
  }
  