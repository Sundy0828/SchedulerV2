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
  import { Capabilities } from "../entities/Capabilities";
  import { isAuth } from "../middleware/isAuth";
  import { MyContext } from "../types";
  
  @InputType()
  class CapabilityInput {
    @Field()
    name: string;
  }
  
  @ObjectType()
  class PaginatedCapabilities {
    @Field(() => [Capabilities])
    capabilities: Capabilities[];
    @Field()
    hasMore: boolean;
  }
  
  @Resolver(Capabilities)
  export class CapabilityResolver {
    @FieldResolver(() => String)
    textSnippet(@Root() capability: Capabilities) {
      return capability.name.slice(0, 50);
    }
  
    // @FieldResolver(() => User)
    // creator(@Root() year: Year, @Ctx() { userLoader }: MyContext) {
    //   return userLoader.load(year.creatorId);
    // }
  
    @Query(() => PaginatedCapabilities)
    async capabilities(
      @Arg("limit", () => Int) limit: number,
      @Arg("cursor", () => String, { nullable: true }) cursor: string | null
    ): Promise<PaginatedCapabilities> {
      // 20 -> 21
      const realLimit = Math.min(50, limit);
      const reaLimitPlusOne = realLimit + 1;
  
      const replacements: any[] = [reaLimitPlusOne];
  
      if (cursor) {
        replacements.push(new Date(parseInt(cursor)));
      }
  
      const capabilities = await getConnection().query(
        // `
        // select y.*
        // from years y
        // ${cursor ? `where y."createdAt" < $2` : ""}
        // order by p."createdAt" DESC
        // limit $1
        // `,
        `
        select c.*
        from capabilities c
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
        capabilities: capabilities.slice(0, realLimit),
        hasMore: capabilities.length === reaLimitPlusOne,
      };
    }
  
    @Query(() => Capabilities, { nullable: true })
    post(@Arg("capability_id", () => Int) capability_id: number): Promise<Capabilities | undefined> {
      return Capabilities.findOne(capability_id);
    }
  
    @Mutation(() => Capabilities)
    @UseMiddleware(isAuth)
    async createCapability(
      @Arg("input") input: CapabilityInput,
      @Ctx() { req }: MyContext
    ): Promise<Capabilities> {
      console.log(req)
      return Capabilities.create({
        ...input
        // ,
        // creatorId: req.session.userId,
      }).save();
    }
  
    @Mutation(() => Capabilities, { nullable: true })
    @UseMiddleware(isAuth)
    async updateCapability(
      @Arg("capability_id", () => Int) year_id: number,
      @Arg("name") name: string,
      @Ctx() { req }: MyContext
    ): Promise<Capabilities | null> {
      console.log(req)
      const result = await getConnection()
        .createQueryBuilder()
        .update(Capabilities)
        .set({ name })
        .where('capability_id = :id'/*and "creatorId" = :creatorId'*/, {
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
    async deleteCapability(
      @Arg("capability_id", () => Int) capability_id: number,
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
  
      await Capabilities.delete({ capability_id /*, creatorId: req.session.userId*/ });
      return true;
    }
  }
  