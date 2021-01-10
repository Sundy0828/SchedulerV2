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
import { Institutions } from "../entities/Institutions";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types";

/**
 * This is similar to a type/interface, this is just the graphql way. Use this instead of passing multiple values as arguments
 * 
*/
@InputType()
class InstitutionInput {
  @Field()
  name: string;
}

/**
 * This is similar to a type/interface, this is just the graphql way. Use this as a return type
 * 
*/
@ObjectType()
class PaginatedInstitutions {
  @Field(() => [Institutions])
  institutions: Institutions[];
  @Field()
  hasMore: boolean;
}

/**
 * Main Resovler For Institution
 * 
*/
@Resolver(Institutions)
export class InstitutionResolver {
  @FieldResolver(() => String)
  textSnippet(@Root() Institution: Institutions) {
    return Institution.name.slice(0, 50);
  }

  /**
   * This is the function you will hit to grab all Institutions
   * 
  */ 
  @Query(() => PaginatedInstitutions)
  async getAllInstitutions(
  ): Promise<PaginatedInstitutions> {
    return  {
      institutions: await Institutions.find(),
      hasMore: false
    }
  }


  /**
   * This is the function you will hit to grab a select amount of Institutions
   * @param {Number} limit The amount of records you want back if more than 50 are specified it will return 50
   * 
  */
  @Query(() => PaginatedInstitutions)
  async getPaginatedInstitutions(
    @Arg("limit", () => Int) limit: number,
  ): Promise<PaginatedInstitutions> {
    const realLimit = Math.min(50, limit);
    const reaLimitPlusOne = realLimit + 1;

    const replacements: any[] = [reaLimitPlusOne];
    const query = "SELECT * FROM institutions limit $1";

    const institutions = await getConnection().query(
      query,
      replacements
    );

    return {
      institutions: institutions.slice(0, realLimit),
      hasMore: institutions.length === reaLimitPlusOne,
    };
  }

  /**
   * This function will return a single Insitution based on the id that is passed
   * @param {Number} institution_id Apply a instituition id to return a single record
   * 
  */
  @Query(() => Institutions, { nullable: true })
  getInstitution(@Arg("institution_id", () => Int) institution_id: number): Promise<Institutions | undefined> {
    return Institutions.findOne(institution_id);
  }

  /**
   * This function will create an Institution
   * @param {String} name Pass an Instituition name to be created
   * 
  */
  @Mutation(() => Institutions)
  @UseMiddleware(isAuth)
  async createInstitution(
    @Arg("input") input: InstitutionInput,
    @Ctx() { req }: MyContext
  ): Promise<Institutions> {
    console.log(req)
    return Institutions.create({
      ...input
      // ,
      // creatorId: req.session.userId,
    }).save();
  }

  /**
   * This function will update an Institution
   * @param {Number} institution_id Pass an Instituition Id
   * @param {String} name Pass an Instituition name to be update
   * 
  */
  @Mutation(() => Institutions, { nullable: true })
  @UseMiddleware(isAuth)
  async updateInstitution(
    @Arg("institution_id", () => Int) institution_id: number,
    @Arg("name") name: string,
    @Ctx() { req }: MyContext
  ): Promise<Institutions | null> {
    console.log(req)
    const result = await getConnection()
      .createQueryBuilder()
      .update(Institutions)
      .set({ name })
      .where('institution_id = :institution_id', {
        institution_id
      })
      .returning("*")
      .execute();

    return result.raw[0];
  }

  /**
   * This function will delete an Institution
   * @param {String} institution_id Pass an Instituition id 
   * 
  */
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteInstitution(
    @Arg("institution_id", () => Int) institution_id: number,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    console.log(req)
    await Institutions.delete({ institution_id /*, creatorId: req.session.userId*/ });
    return true;
  }
}
