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
//import { InstitutionName } from "../interfaces/InstitutionName";

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
  @Field(() => [Institutions])
  institutions: Institutions[];
  @Field()
  hasMore: boolean;
}

@ObjectType()
class testType {
  @Field(() => [Institutions])
  name: String;
}

@Resolver(Institutions)
export class InstitutionResolver {
  @FieldResolver(() => String)
  textSnippet(@Root() Institution: Institutions) {
    return Institution.name.slice(0, 50);
  }

  // @FieldResolver(() => User)
  // creator(@Root() year: Year, @Ctx() { userLoader }: MyContext) {
  //   return userLoader.load(year.creatorId);
  // }

  @Query(() => PaginatedInstitutions)
  async getAllInstitutions() {
    const realLimit = Math.min(50, 10);
    const reaLimitPlusOne = realLimit + 1;

    const replacements: any[] = [reaLimitPlusOne];
    return await getConnection().query(
      `
      select i.*
      from institutions i
      limit $1
      `,
      replacements
    );
  }
  @Query(() => testType)
  test() {
    return getConnection().query(
      `
      select name
      from institutions
      where institution_id = 1
      `
    );
  }

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

  @Query(() => Institutions, { nullable: true })
  institution(@Arg("institution_id", () => Int) institution_id: number): Promise<Institutions | undefined> {
    return Institutions.findOne(institution_id);
  }

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

  @Mutation(() => Institutions, { nullable: true })
  @UseMiddleware(isAuth)
  async updateInstitution(
    @Arg("institution_id", () => Int) institution_id: number,
    @Arg("name") name: string,
    @Arg("public_key") public_key: string,
    @Arg("secret_key") secret_key: string,
    @Ctx() { req }: MyContext
  ): Promise<Institutions | null> {
    console.log(req)
    const result = await getConnection()
      .createQueryBuilder()
      .update(Institutions)
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

    await Institutions.delete({ institution_id /*, creatorId: req.session.userId*/ });
    return true;
  }
}
