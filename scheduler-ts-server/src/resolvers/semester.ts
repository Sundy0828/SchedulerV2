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
import { Semester } from "../entities/Semester";
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
  @Field(() => [Semester])
  semesters: Semester[];
  @Field()
  hasMore: boolean;
}

@Resolver(Semester)
export class SemesterResolver {
  @FieldResolver(() => String)
  textSnippet(@Root() semester: Semester) {
    return semester.name.slice(0, 50);
  }

  // @FieldResolver(() => User)
  // creator(@Root() year: Year, @Ctx() { userLoader }: MyContext) {
  //   return userLoader.load(year.creatorId);
  // }

  @Query(() => PaginatedSemesters)
  async years(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null
  ): Promise<PaginatedSemesters> {
    // 20 -> 21
    const realLimit = Math.min(50, limit);
    const reaLimitPlusOne = realLimit + 1;

    const replacements: any[] = [reaLimitPlusOne];

    if (cursor) {
      replacements.push(new Date(parseInt(cursor)));
    }

    const semesters = await getConnection().query(
      // `
      // select y.*
      // from years y
      // ${cursor ? `where y."createdAt" < $2` : ""}
      // order by p."createdAt" DESC
      // limit $1
      // `,
      `
      select s.*
      from semester s
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
      semesters: semesters.slice(0, realLimit),
      hasMore: semesters.length === reaLimitPlusOne,
    };
  }

  @Query(() => Semester, { nullable: true })
  post(@Arg("semester_id", () => Int) semester_id: number): Promise<Semester | undefined> {
    return Semester.findOne(semester_id);
  }

  @Mutation(() => Semester)
  @UseMiddleware(isAuth)
  async createSemester(
    @Arg("input") input: SemesterInput,
    @Ctx() { req }: MyContext
  ): Promise<Semester> {
    return Semester.create({
      ...input
      // ,
      // creatorId: req.session.userId,
    }).save();
  }

  @Mutation(() => Semester, { nullable: true })
  @UseMiddleware(isAuth)
  async updateSemester(
    @Arg("semester_id", () => Int) semester_id: number,
    @Arg("name") name: string,
    @Arg("institution_id") institution_id: string,
    @Ctx() { req }: MyContext
  ): Promise<Semester | null> {
    const result = await getConnection()
      .createQueryBuilder()
      .update(Semester)
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

    await Semester.delete({ semester_id /*, creatorId: req.session.userId*/ });
    return true;
  }
}
