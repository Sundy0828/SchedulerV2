import "reflect-metadata";
import "dotenv-safe/config";
import { __prod__/*, COOKIE_NAME */ } from "./constants";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/user";
//import Redis from "ioredis";
//import session from "express-session";
//import connectRedis from "connect-redis";
import cors from "cors";
import { createConnection } from "typeorm";
//import { Post } from "./entities/Post";
//import { User } from "./entities/User";
//import path from "path";
//import { Updoot } from "./entities/Updoot";
import { createUserLoader } from "./utils/createUserLoader";
import { Institutions } from "./entities/Institutions";
import { InstitutionResolver } from "./resolvers/institution";
import { Capabilities } from "./entities/Capabilities";
import { Combinations } from "./entities/Combinations";
import { Courses } from "./entities/Courses";
import { Semesters } from "./entities/Semesters";
import { Users } from "./entities/Users";
import { User_Institution_Access } from "./entities/User_Institution_Access";
import { User_Types } from "./entities/User_Types";
import { Years } from "./entities/Years";
import { Combination_Courses } from "./entities/Combination_Courses";
import { Discipline_Courses } from "./entities/Discipline_Courses";
import { User_Type_Capabilites } from "./entities/User_Type_Capabilites";
import { Disciplines } from "./entities/Disciplines";
import { DisciplineCourseResolver } from "./resolvers/disciplineCourse";
import { CombinationResolver } from "./resolvers/combination";
import { SemesterResolver } from "./resolvers/semester";
import { UserInstitutionAccessResolver } from "./resolvers/userInstitutionAccess";
import { UserTypeCapabilitesResolver } from "./resolvers/userTypeCapabilites";
import { YearResolver } from "./resolvers/year";
import { CapabilityResolver } from "./resolvers/capability";
import { CombinationCourseResolver } from "./resolvers/combinationCourse";
import { DisciplineResolver } from "./resolvers/discipline";
import { UserTypeResolver } from "./resolvers/userType";
import { CoursesResolver } from "./resolvers/course";
var dbConfig = require('./config/config');

const main = async () => {
  const conn = await createConnection({
    type: dbConfig.type,
    //url: process.env.DATABASE_URL,
    logging: true,
    // synchronize: true,
    //migrations: [path.join(__dirname, "./migrations/*")],
    entities: [
      Capabilities,
      Combinations,
      Combination_Courses,
      Courses,
      Disciplines,
      Discipline_Courses,
      Institutions,
      Semesters,
      Users, 
      User_Institution_Access,
      User_Types,
      User_Type_Capabilites,
      Years
    ], 
    host: dbConfig.host,  
    port: dbConfig.port,
    username: dbConfig.username,
    password: dbConfig.password,
    database: dbConfig.database,
  });
  console.log(conn)
  //await conn.runMigrations();
  //conn.connect();
  //await Post.delete({});

  const app = express();

  //const RedisStore = connectRedis(session);
  //const redis = new Redis(process.env.REDIS_URL);
  app.set("trust proxy", 1);
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    })
  );
  // app.use(
  //   session({
  //     name: COOKIE_NAME,
  //     store: new RedisStore({
  //       client: redis,
  //       disableTouch: true,
  //     }),
  //     cookie: {
  //       maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
  //       httpOnly: true,
  //       sameSite: "lax", // csrf
  //       secure: __prod__, // cookie only works in https
  //       domain: __prod__ ? ".codeponder.com" : undefined, // Need to change this 1st value
  //     },
  //     saveUninitialized: false,
  //     secret: 'test'/*process.env.SESSION_SECRET*/,
  //     resave: false,
  //   })
  // );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [
        CapabilityResolver,
        CombinationResolver,
        CombinationCourseResolver,
        CoursesResolver,
        DisciplineResolver,
        DisciplineCourseResolver,
        InstitutionResolver, 
        SemesterResolver,
        UserResolver,
        UserInstitutionAccessResolver,
        UserTypeResolver,
        UserTypeCapabilitesResolver,
        YearResolver
      ],
      validate: false,
    }),
    context: ({ req, res }) => ({
      req,
      res,
      //redis,
      userLoader: createUserLoader(),
    }),
  });

  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  app.listen(4000, () => { /*parseInt(process.env.PORT*/
    console.log(`server started on localhost:4000`)
  })
};

main().catch((err) => {
  console.error(err);
});
