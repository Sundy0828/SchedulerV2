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
  import { Year } from "../entities/Year";
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
    @Field(() => [Year])
    years: Year[];
    @Field()
    hasMore: boolean;
  }
  
  @Resolver(Year)
  export class YearResolver {
    @FieldResolver(() => String)
    textSnippet(@Root() year: Year) {
      return year.name.slice(0, 50);
    }
  
    // @FieldResolver(() => User)
    // creator(@Root() year: Year, @Ctx() { userLoader }: MyContext) {
    //   return userLoader.load(year.creatorId);
    // }
  
    @Query(() => PaginatedYears)
    async years(
      @Arg("limit", () => Int) limit: number,
      @Arg("cursor", () => String, { nullable: true }) cursor: string | null
    ): Promise<PaginatedYears> {
      // 20 -> 21
      const realLimit = Math.min(50, limit);
      const reaLimitPlusOne = realLimit + 1;
  
      const replacements: any[] = [reaLimitPlusOne];
  
      if (cursor) {
        replacements.push(new Date(parseInt(cursor)));
      }
  
      const years = await getConnection().query(
        // `
        // select y.*
        // from years y
        // ${cursor ? `where y."createdAt" < $2` : ""}
        // order by p."createdAt" DESC
        // limit $1
        // `,
        `
        select y.*
        from years y
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
        years: years.slice(0, realLimit),
        hasMore: years.length === reaLimitPlusOne,
      };
    }
  
    @Query(() => Year, { nullable: true })
    post(@Arg("year_id", () => Int) year_id: number): Promise<Year | undefined> {
      return Year.findOne(year_id);
    }
  
    @Mutation(() => Year)
    @UseMiddleware(isAuth)
    async createYear(
      @Arg("input") input: YearInput,
      @Ctx() { req }: MyContext
    ): Promise<Year> {
      return Year.create({
        ...input
        // ,
        // creatorId: req.session.userId,
      }).save();
    }
  
    @Mutation(() => Year, { nullable: true })
    @UseMiddleware(isAuth)
    async updateYear(
      @Arg("year_id", () => Int) year_id: number,
      @Arg("name") name: string,
      @Arg("institutions_id") institution_id: number,
      @Ctx() { req }: MyContext
    ): Promise<Year | null> {
      const result = await getConnection()
        .createQueryBuilder()
        .update(Year)
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
  
      await Year.delete({ year_id /*, creatorId: req.session.userId*/ });
      return true;
    }
  }
  