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
import { Disciplines } from "../entities/Disciplines";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types";

@InputType()
class DisciplineInput {
  @Field()
  institution_id: number;
  @Field()
  name: string;
  @Field()
  is_major: boolean;
}

@ObjectType()
class PaginatedDisciplines {
  @Field(() => [Disciplines])
  disciplines: Disciplines[];
  @Field()
  hasMore: boolean;
}

@Resolver(Disciplines)
export class DisciplineResolver {
  @FieldResolver(() => String)
  textSnippet(@Root() discipline: Disciplines) {
    return discipline.name.slice(0, 50);
  }

  /**
   * This is the function you will hit to grab all Institutions
   * 
  */
 @Query(() => PaginatedDisciplines)
 async getAllDisciplines(
 ): Promise<PaginatedDisciplines> {
   return  {
     disciplines: await Disciplines.find(),
     hasMore: false
   }
 }

  @Query(() => PaginatedDisciplines)
  async getPaginatedDisciplines(
    @Arg("limit", () => Int) limit: number,
  ): Promise<PaginatedDisciplines> {
    const realLimit = Math.min(50, limit);
    const reaLimitPlusOne = realLimit + 1;

    const replacements: any[] = [reaLimitPlusOne];
    const query = "SELECT * FROM disciplines limit $1";

    const disciplines = await getConnection().query(
      query,
      replacements
    );

    return {
      disciplines: disciplines.slice(0, realLimit),
      hasMore: disciplines.length === reaLimitPlusOne,
    };
  }

  @Query(() => Disciplines, { nullable: true })
  post(@Arg("discipline_id", () => Int) capability_id: number): Promise<Disciplines | undefined> {
    return Disciplines.findOne(capability_id);
  }

  @Mutation(() => Disciplines)
  @UseMiddleware(isAuth)
  async createDiscipline(
    @Arg("input") input: DisciplineInput,
    @Ctx() { req }: MyContext
  ): Promise<Disciplines> {
    console.log(req)
    return Disciplines.create({
      ...input
      // ,
      // creatorId: req.session.userId,
    }).save();
  }

  @Mutation(() => Disciplines, { nullable: true })
  @UseMiddleware(isAuth)
  async updateDiscipline(
    @Arg("discipline_id", () => Int) discipline_id: number,
    @Arg("institution_id") institution_id: number,
    @Arg("name") name: string,
    @Arg("is_major") is_major: boolean,
    @Ctx() { req }: MyContext
  ): Promise<Disciplines | null> {
    console.log(req)
    const result = await getConnection()
      .createQueryBuilder()
      .update(Disciplines)
      .set({ institution_id,name,is_major })
      .where('discipline_id = :id'/*and "creatorId" = :creatorId'*/, {
        discipline_id
      //   ,
      //   creatorId: req.session.userId,
      })
      .returning("*")
      .execute();

    return result.raw[0];
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteDiscipline(
    @Arg("discipline_id", () => Int) discipline_id: number,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    console.log(req)
    await Disciplines.delete({ discipline_id /*, creatorId: req.session.userId*/ });
    return true;
  }
}
