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
  import { Combination } from "../entities/Combination";
  import { isAuth } from "../middleware/isAuth";
  import { MyContext } from "../types";
  
  @InputType()
  class CombinationInput {
    @Field()
    logical_operator: string;
  }
  
  @ObjectType()
  class PaginatedCombinations {
    @Field(() => [Combination])
    combinations: Combination[];
    @Field()
    hasMore: boolean;
  }
  
  @Resolver(Combination)
  export class CombinationResolver {
    @FieldResolver(() => String)
    textSnippet(@Root() capability: Combination) {
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
  
    @Query(() => Combination, { nullable: true })
    post(@Arg("combination_id", () => Int) capability_id: number): Promise<Combination | undefined> {
      return Combination.findOne(capability_id);
    }
  
    @Mutation(() => Combination)
    @UseMiddleware(isAuth)
    async createCombination(
      @Arg("input") input: CombinationInput,
      @Ctx() { req }: MyContext
    ): Promise<Combination> {
      return Combination.create({
        ...input
        // ,
        // creatorId: req.session.userId,
      }).save();
    }
  
    @Mutation(() => Combination, { nullable: true })
    @UseMiddleware(isAuth)
    async updateCombination(
      @Arg("combination_id", () => Int) combination_id: number,
      @Arg("logical_operator") logical_operator: string,
      @Ctx() { req }: MyContext
    ): Promise<Combination | null> {
      const result = await getConnection()
        .createQueryBuilder()
        .update(Combination)
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
  
      await Combination.delete({ combination_id /*, creatorId: req.session.userId*/ });
      return true;
    }
  }
  