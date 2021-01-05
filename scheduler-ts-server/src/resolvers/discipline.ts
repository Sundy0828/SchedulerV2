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
import { Discipline } from "../entities/Discipline";
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
  @Field(() => [Discipline])
  disciplines: Discipline[];
  @Field()
  hasMore: boolean;
}

@Resolver(Discipline)
export class DisciplineResolver {
  @FieldResolver(() => String)
  textSnippet(@Root() discipline: Discipline) {
    return discipline.name.slice(0, 50);
  }

  // @FieldResolver(() => User)
  // creator(@Root() year: Year, @Ctx() { userLoader }: MyContext) {
  //   return userLoader.load(year.creatorId);
  // }

  @Query(() => PaginatedDisciplines)
  async disciplines(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null
  ): Promise<PaginatedDisciplines> {
    // 20 -> 21
    const realLimit = Math.min(50, limit);
    const reaLimitPlusOne = realLimit + 1;

    const replacements: any[] = [reaLimitPlusOne];

    if (cursor) {
      replacements.push(new Date(parseInt(cursor)));
    }

    const disciplines = await getConnection().query(
      // `
      // select y.*
      // from years y
      // ${cursor ? `where y."createdAt" < $2` : ""}
      // order by p."createdAt" DESC
      // limit $1
      // `,
      `
      select d.*
      from disciplines d
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
      disciplines: disciplines.slice(0, realLimit),
      hasMore: disciplines.length === reaLimitPlusOne,
    };
  }

  @Query(() => Discipline, { nullable: true })
  post(@Arg("discipline_id", () => Int) capability_id: number): Promise<Discipline | undefined> {
    return Discipline.findOne(capability_id);
  }

  @Mutation(() => Discipline)
  @UseMiddleware(isAuth)
  async createDiscipline(
    @Arg("input") input: DisciplineInput,
    @Ctx() { req }: MyContext
  ): Promise<Discipline> {
    return Discipline.create({
      ...input
      // ,
      // creatorId: req.session.userId,
    }).save();
  }

  @Mutation(() => Discipline, { nullable: true })
  @UseMiddleware(isAuth)
  async updateDiscipline(
    @Arg("discipline_id", () => Int) discipline_id: number,
    @Arg("institution_id") institution_id: number,
    @Arg("name") name: string,
    @Arg("is_major") is_major: boolean,
    @Ctx() { req }: MyContext
  ): Promise<Discipline | null> {
    const result = await getConnection()
      .createQueryBuilder()
      .update(Discipline)
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

    await Discipline.delete({ discipline_id /*, creatorId: req.session.userId*/ });
    return true;
  }
}
