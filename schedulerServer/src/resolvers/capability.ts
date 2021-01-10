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
  
  /**
   * This is similar to a type/interface, this is just the graphql way. Use this instead of passing multiple values as arguments
   * 
  */
  @InputType()
  class CapabilityInput {
    @Field()
    name: string;
  }
  
  /**
   * This is similar to a type/interface, this is just the graphql way. Use this instead of passing multiple values as arguments
   * 
  */
  @ObjectType()
  class PaginatedCapabilities {
    @Field(() => [Capabilities])
    capabilities: Capabilities[];
    @Field()
    hasMore: boolean;
  }
  
  /**
   * Main Resovler For Capabilities
   * 
  */
  @Resolver(Capabilities)
  export class CapabilityResolver {
    @FieldResolver(() => String)
    textSnippet(@Root() capability: Capabilities) {
      return capability.name.slice(0, 50);
    }
  
    /**
     * This is the function you will hit to grab all Institutions
     * 
    */
    @Query(() => PaginatedCapabilities)
    async getAllCapabilities(
    ): Promise<PaginatedCapabilities> {
      return  {
        capabilities: await Capabilities.find(),
        hasMore: false
      }
    }
    
    /**
     * This is the function you will hit to grab a select amount of Capabilities
     * @param {Number} limit The amount of records you want back if more than 50 are specified it will return 50
     * 
    */
    @Query(() => PaginatedCapabilities)
    async getPaginatedCapabilities(
      @Arg("limit", () => Int) limit: number,
    ): Promise<PaginatedCapabilities> {
      const realLimit = Math.min(50, limit);
      const reaLimitPlusOne = realLimit + 1;

      const replacements: any[] = [reaLimitPlusOne];
      const query = "SELECT * FROM capabilities limit $1";

      const capabilities = await getConnection().query(
        query,
        replacements
      );

      return {
        capabilities: capabilities.slice(0, realLimit),
        hasMore: capabilities.length === reaLimitPlusOne,
      };
    }

    /**
     * This function will return a single Capability based on the id that is passed
     * @param {Number} capability_id Apply a Capability id to return a single record
     * 
    */
    @Query(() => Capabilities, { nullable: true })
    post(@Arg("capability_id", () => Int) capability_id: number): Promise<Capabilities | undefined> {
      return Capabilities.findOne(capability_id);
    }
    
    /**
     * This function will create an Capability
     * @param {String} name Pass an Capability name to be created
     * 
    */
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
    
    /**
     * This function will update an Capability
     * @param {Number} capability_id Pass an Capability Id
     * @param {String} name Pass an Capability name to be update
     * 
    */
    @Mutation(() => Capabilities, { nullable: true })
    @UseMiddleware(isAuth)
    async updateCapability(
      @Arg("capability_id", () => Int) capability_id: number,
      @Arg("name") name: string,
      @Ctx() { req }: MyContext
    ): Promise<Capabilities | null> {
      console.log(req)
      const result = await getConnection()
        .createQueryBuilder()
        .update(Capabilities)
        .set({ name })
        .where('capability_id = :capability_id'/*and "creatorId" = :creatorId'*/, {
          capability_id
        //   ,
        //   creatorId: req.session.userId,
        })
        .returning("*")
        .execute();
  
      return result.raw[0];
    }
  
    /**
     * This function will delete an Capability
     * @param {String} capability_id Pass an Capability id 
     * 
    */
    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async deleteCapability(
      @Arg("capability_id", () => Int) capability_id: number,
      @Ctx() { req }: MyContext
    ): Promise<boolean> {
      console.log(req)
      await Capabilities.delete({ capability_id /*, creatorId: req.session.userId*/ });
      return true;
    }
  }
  