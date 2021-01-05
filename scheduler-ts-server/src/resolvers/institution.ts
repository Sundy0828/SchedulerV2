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
import { Institution } from "../entities/Institution";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types";

@InputType()
class InstitutionInput {
  @Field()
  name: string;
  @Field()
  public_key: string;
  @Field()
  secret_key: string;
}

@ObjectType()
class PaginatedInstitutions {
  @Field(() => [Institution])
  institutions: Institution[];
  @Field()
  hasMore: boolean;
}

@Resolver(Institution)
export class InstitutionResolver {
  @FieldResolver(() => String)
  textSnippet(@Root() Institution: Institution) {
    return Institution.name.slice(0, 50);
  }

  // @FieldResolver(() => User)
  // creator(@Root() year: Year, @Ctx() { userLoader }: MyContext) {
  //   return userLoader.load(year.creatorId);
  // }

  @Query(() => PaginatedInstitutions)
  async institutions(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null
  ): Promise<PaginatedInstitutions> {
    // 20 -> 21
    const realLimit = Math.min(50, limit);
    const reaLimitPlusOne = realLimit + 1;

    const replacements: any[] = [reaLimitPlusOne];

    if (cursor) {
      replacements.push(new Date(parseInt(cursor)));
    }

    const institutions = await getConnection().query(
      // `
      // select y.*
      // from years y
      // ${cursor ? `where y."createdAt" < $2` : ""}
      // order by p."createdAt" DESC
      // limit $1
      // `,
      `
      select i.*
      from institutions i
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
      institutions: institutions.slice(0, realLimit),
      hasMore: institutions.length === reaLimitPlusOne,
    };
  }

  @Query(() => Institution, { nullable: true })
  post(@Arg("institution_id", () => Int) institution_id: number): Promise<Institution | undefined> {
    return Institution.findOne(institution_id);
  }

  @Mutation(() => Institution)
  @UseMiddleware(isAuth)
  async createCombination(
    @Arg("input") input: InstitutionInput,
    @Ctx() { req }: MyContext
  ): Promise<Institution> {
    return Institution.create({
      ...input
      // ,
      // creatorId: req.session.userId,
    }).save();
  }

  @Mutation(() => Institution, { nullable: true })
  @UseMiddleware(isAuth)
  async updateInstitution(
    @Arg("institution_id", () => Int) institution_id: number,
    @Arg("name") name: string,
    @Arg("public_key") public_key: string,
    @Arg("secret_key") secret_key: string,
    @Ctx() { req }: MyContext
  ): Promise<Institution | null> {
    const result = await getConnection()
      .createQueryBuilder()
      .update(Institution)
      .set({ name,public_key,secret_key })
      .where('institution_id = :id'/*and "creatorId" = :creatorId'*/, {
        institution_id
      //   ,
      //   creatorId: req.session.userId,
      })
      .returning("*")
      .execute();

    return result.raw[0];
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteInstitution(
    @Arg("institution_id", () => Int) institution_id: number,
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

    await Institution.delete({ institution_id /*, creatorId: req.session.userId*/ });
    return true;
  }
}
