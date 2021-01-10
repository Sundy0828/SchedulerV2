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
import { Semesters } from "../entities/Semesters";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types";

@InputType()
class SemesterInput {
  @Field()
  name: string;
  @Field()
  institution_id: number;
}

@ObjectType()
class PaginatedSemesters {
  @Field(() => [Semesters])
  semesters: Semesters[];
  @Field()
  hasMore: boolean;
}

@Resolver(Semesters)
export class SemesterResolver {
  @FieldResolver(() => String)
  textSnippet(@Root() semester: Semesters) {
    return semester.name.slice(0, 50);
  }

  /**
   * This is the function you will hit to grab all Institutions
   * 
  */
  @Query(() => PaginatedSemesters)
  async getAllSemesters(
  ): Promise<PaginatedSemesters> {
    return  {
      semesters: await Semesters.find(),
      hasMore: false
    }
  }

  @Query(() => PaginatedSemesters)
  async getPaginatedSemesters(
    @Arg("limit", () => Int) limit: number,
  ): Promise<PaginatedSemesters> {
    const realLimit = Math.min(50, limit);
    const reaLimitPlusOne = realLimit + 1;

    const replacements: any[] = [reaLimitPlusOne];
    const query = "SELECT * FROM semesters limit $1";

    const semesters = await getConnection().query(
      query,
      replacements
    );

    return {
      semesters: semesters.slice(0, realLimit),
      hasMore: semesters.length === reaLimitPlusOne,
    };
  }

  @Query(() => Semesters, { nullable: true })
  post(@Arg("semester_id", () => Int) semester_id: number): Promise<Semesters | undefined> {
    return Semesters.findOne(semester_id);
  }

  @Mutation(() => Semesters)
  @UseMiddleware(isAuth)
  async createSemester(
    @Arg("input") input: SemesterInput,
    @Ctx() { req }: MyContext
  ): Promise<Semesters> {
    console.log(req)
    return Semesters.create({
      ...input
      // ,
      // creatorId: req.session.userId,
    }).save();
  }

  @Mutation(() => Semesters, { nullable: true })
  @UseMiddleware(isAuth)
  async updateSemester(
    @Arg("semester_id", () => Int) semester_id: number,
    @Arg("name") name: string,
    @Arg("institution_id") institution_id: string,
    @Ctx() { req }: MyContext
  ): Promise<Semesters | null> {
    console.log(req,institution_id)
    const result = await getConnection()
      .createQueryBuilder()
      .update(Semesters)
      .set({ name })
      .where('semester_id = :id'/*and "creatorId" = :creatorId'*/, {
        semester_id
      //   ,
      //   creatorId: req.session.userId,
      })
      .returning("*")
      .execute();

    return result.raw[0];
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteSemester(
    @Arg("semester_id", () => Int) semester_id: number,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    console.log(req)
    await Semesters.delete({ semester_id /*, creatorId: req.session.userId*/ });
    return true;
  }
}
