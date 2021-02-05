import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Query = {
  __typename?: 'Query';
  me?: Maybe<Users>;
  getAllInstitutions: PaginatedInstitutions;
  getPaginatedInstitutions: PaginatedInstitutions;
  getInstitution?: Maybe<Institutions>;
  getAllDisciplineCourses: PaginatedDisciplineCourses;
  getPaginatedDisciplineCourses: PaginatedDisciplineCourses;
  post?: Maybe<Courses>;
  getAllCombinations: PaginatedCombinations;
  getPaginatedCombinations: PaginatedCombinations;
  getAllSemesters: PaginatedSemesters;
  getPaginatedSemesters: PaginatedSemesters;
  getAllUserInstitutionAccesses: PaginatedUserInstitutionAccesses;
  getPaginatedUserInstitutionAccesses: PaginatedUserInstitutionAccesses;
  getAllUserTypeCapabilites: PaginatedUserTypeCapabilites;
  getPaginatedUserTypeCapabilites: PaginatedUserTypeCapabilites;
  getAllYears: PaginatedYears;
  getPaginatedYears: PaginatedYears;
  getAllCapabilities: PaginatedCapabilities;
  getPaginatedCapabilities: PaginatedCapabilities;
  getAllCombinationCourses: PaginatedCombinationCourses;
  getPaginatedCombinationCourses: PaginatedCombinationCourses;
  getAllDisciplines: PaginatedDisciplines;
  getPaginatedDisciplines: PaginatedDisciplines;
  getAllUserTypes: PaginatedUserTypes;
  getPaginatedUserTypes: PaginatedUserTypes;
  getAllCourses: PaginatedCourses;
  getPaginatedCourses: PaginatedCourses;
};


export type QueryGetPaginatedInstitutionsArgs = {
  limit: Scalars['Int'];
};


export type QueryGetInstitutionArgs = {
  institution_id: Scalars['Int'];
};


export type QueryGetPaginatedDisciplineCoursesArgs = {
  limit: Scalars['Int'];
};


export type QueryPostArgs = {
  combination_id: Scalars['Int'];
};


export type QueryGetPaginatedCombinationsArgs = {
  limit: Scalars['Int'];
};


export type QueryGetPaginatedSemestersArgs = {
  limit: Scalars['Int'];
};


export type QueryGetPaginatedUserInstitutionAccessesArgs = {
  limit: Scalars['Int'];
};


export type QueryGetPaginatedUserTypeCapabilitesArgs = {
  limit: Scalars['Int'];
};


export type QueryGetPaginatedYearsArgs = {
  limit: Scalars['Int'];
};


export type QueryGetPaginatedCapabilitiesArgs = {
  limit: Scalars['Int'];
};


export type QueryGetPaginatedCombinationCoursesArgs = {
  limit: Scalars['Int'];
};


export type QueryGetPaginatedDisciplinesArgs = {
  limit: Scalars['Int'];
};


export type QueryGetPaginatedUserTypesArgs = {
  limit: Scalars['Int'];
};


export type QueryGetPaginatedCoursesArgs = {
  limit: Scalars['Int'];
};

export type Users = {
  __typename?: 'Users';
  user_id: Scalars['Float'];
  email: Scalars['String'];
};

export type PaginatedInstitutions = {
  __typename?: 'PaginatedInstitutions';
  institutions: Array<Institutions>;
  hasMore: Scalars['Boolean'];
};

export type Institutions = {
  __typename?: 'Institutions';
  institution_id: Scalars['Float'];
  name: Scalars['String'];
  public_key: Scalars['String'];
  secret_key: Scalars['String'];
  textSnippet: Scalars['String'];
};

export type PaginatedDisciplineCourses = {
  __typename?: 'PaginatedDisciplineCourses';
  disciplineCourses: Array<Discipline_Courses>;
  hasMore: Scalars['Boolean'];
};

export type Discipline_Courses = {
  __typename?: 'Discipline_Courses';
  discipline_id: Scalars['Float'];
  course_id: Scalars['Float'];
  textSnippet: Scalars['String'];
};

export type Courses = {
  __typename?: 'Courses';
  course_id: Scalars['Float'];
  prerequisite_combination_id: Scalars['Float'];
  name: Scalars['String'];
  credits: Scalars['Float'];
  code: Scalars['Float'];
  semesters_available: Scalars['Float'];
  years_available: Scalars['Float'];
  textSnippet: Scalars['String'];
};

export type PaginatedCombinations = {
  __typename?: 'PaginatedCombinations';
  combinations: Array<Combinations>;
  hasMore: Scalars['Boolean'];
};

export type Combinations = {
  __typename?: 'Combinations';
  combination_id: Scalars['Float'];
  logical_operator: Scalars['String'];
  textSnippet: Scalars['String'];
};

export type PaginatedSemesters = {
  __typename?: 'PaginatedSemesters';
  semesters: Array<Semesters>;
  hasMore: Scalars['Boolean'];
};

export type Semesters = {
  __typename?: 'Semesters';
  semester_id: Scalars['Float'];
  name: Scalars['String'];
  institution_id: Scalars['Float'];
  textSnippet: Scalars['String'];
};

export type PaginatedUserInstitutionAccesses = {
  __typename?: 'PaginatedUserInstitutionAccesses';
  userInstitutionAccesses: Array<UserInstitutionAccess>;
  hasMore: Scalars['Boolean'];
};

export type UserInstitutionAccess = {
  __typename?: 'UserInstitutionAccess';
  user_id: Scalars['Float'];
  institution_id: Scalars['Float'];
  textSnippet: Scalars['String'];
};

export type PaginatedUserTypeCapabilites = {
  __typename?: 'PaginatedUserTypeCapabilites';
  userTypeCapabilites: Array<UserTypeCapabilites>;
  hasMore: Scalars['Boolean'];
};

export type UserTypeCapabilites = {
  __typename?: 'UserTypeCapabilites';
  user_type_id: Scalars['Float'];
  capability_id: Scalars['Float'];
  textSnippet: Scalars['String'];
};

export type PaginatedYears = {
  __typename?: 'PaginatedYears';
  years: Array<Years>;
  hasMore: Scalars['Boolean'];
};

export type Years = {
  __typename?: 'Years';
  year_id: Scalars['Float'];
  name: Scalars['String'];
  institution_id: Scalars['Float'];
  textSnippet: Scalars['String'];
};

export type PaginatedCapabilities = {
  __typename?: 'PaginatedCapabilities';
  capabilities: Array<Capabilities>;
  hasMore: Scalars['Boolean'];
};

export type Capabilities = {
  __typename?: 'Capabilities';
  capability_id: Scalars['Float'];
  name: Scalars['String'];
  textSnippet: Scalars['String'];
};

export type PaginatedCombinationCourses = {
  __typename?: 'PaginatedCombinationCourses';
  combinationCourses: Array<CombinationCourses>;
  hasMore: Scalars['Boolean'];
};

export type CombinationCourses = {
  __typename?: 'CombinationCourses';
  combination_id: Scalars['Float'];
  course_id: Scalars['Float'];
  sub_combination_id: Scalars['Float'];
  textSnippet: Scalars['String'];
};

export type PaginatedDisciplines = {
  __typename?: 'PaginatedDisciplines';
  disciplines: Array<Disciplines>;
  hasMore: Scalars['Boolean'];
};

export type Disciplines = {
  __typename?: 'Disciplines';
  discipline_id: Scalars['Float'];
  institution_id: Scalars['Float'];
  name: Scalars['String'];
  is_major: Scalars['Boolean'];
  textSnippet: Scalars['String'];
};

export type PaginatedUserTypes = {
  __typename?: 'PaginatedUserTypes';
  userTypes: Array<UserTypes>;
  hasMore: Scalars['Boolean'];
};

export type UserTypes = {
  __typename?: 'UserTypes';
  user_type_id: Scalars['Float'];
  name: Scalars['String'];
  textSnippet: Scalars['String'];
};

export type PaginatedCourses = {
  __typename?: 'PaginatedCourses';
  courses: Array<Courses>;
  hasMore: Scalars['Boolean'];
};

export type Mutation = {
  __typename?: 'Mutation';
  changePassword: UserResponse;
  forgotPassword: Scalars['Boolean'];
  register: UserResponse;
  login: UserResponse;
  logout: Scalars['Boolean'];
  createInstitution: Institutions;
  updateInstitution?: Maybe<Institutions>;
  deleteInstitution: Scalars['Boolean'];
  createCombination: Combinations;
  updateDisciplineCourse?: Maybe<Discipline_Courses>;
  deleteDisciplineCourse: Scalars['Boolean'];
  updateCombination?: Maybe<Combinations>;
  deleteCombination: Scalars['Boolean'];
  createSemester: Semesters;
  updateSemester?: Maybe<Semesters>;
  deleteSemester: Scalars['Boolean'];
  createUserInstitutionAccess: UserInstitutionAccess;
  updateUserInstitutionAccess?: Maybe<UserInstitutionAccess>;
  deleteUserInstitutionAccess: Scalars['Boolean'];
  createUserTypeCapability: UserTypeCapabilites;
  updateUserTypeCapability?: Maybe<UserTypeCapabilites>;
  deleteUserTypeCapability: Scalars['Boolean'];
  createYear: Years;
  updateYear?: Maybe<Years>;
  deleteYear: Scalars['Boolean'];
  createCapability: Capabilities;
  updateCapability?: Maybe<Capabilities>;
  deleteCapability: Scalars['Boolean'];
  createCombinationCourse: CombinationCourses;
  updateCombinationCourse?: Maybe<CombinationCourses>;
  deleteCombinationCourse: Scalars['Boolean'];
  createDiscipline: Disciplines;
  updateDiscipline?: Maybe<Disciplines>;
  deleteDiscipline: Scalars['Boolean'];
  createUserType: UserTypes;
  updateUserType?: Maybe<UserTypes>;
  deleteUserType: Scalars['Boolean'];
  createCourse: Courses;
  updateCourse?: Maybe<Courses>;
  deleteCourse: Scalars['Boolean'];
};


export type MutationChangePasswordArgs = {
  newPassword: Scalars['String'];
  token: Scalars['String'];
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationRegisterArgs = {
  options: UsernamePasswordInput;
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  usernameOrEmail: Scalars['String'];
};


export type MutationCreateInstitutionArgs = {
  input: InstitutionInput;
};


export type MutationUpdateInstitutionArgs = {
  name: Scalars['String'];
  institution_id: Scalars['Int'];
};


export type MutationDeleteInstitutionArgs = {
  institution_id: Scalars['Int'];
};


export type MutationCreateCombinationArgs = {
  input: CombinationInput;
};


export type MutationUpdateDisciplineCourseArgs = {
  course_id: Scalars['Float'];
  discipline_id: Scalars['Int'];
};


export type MutationDeleteDisciplineCourseArgs = {
  discipline_id: Scalars['Int'];
};


export type MutationUpdateCombinationArgs = {
  logical_operator: Scalars['String'];
  combination_id: Scalars['Int'];
};


export type MutationDeleteCombinationArgs = {
  combination_id: Scalars['Int'];
};


export type MutationCreateSemesterArgs = {
  input: SemesterInput;
};


export type MutationUpdateSemesterArgs = {
  institution_id: Scalars['String'];
  name: Scalars['String'];
  semester_id: Scalars['Int'];
};


export type MutationDeleteSemesterArgs = {
  semester_id: Scalars['Int'];
};


export type MutationCreateUserInstitutionAccessArgs = {
  input: UserInstitutionAccessInput;
};


export type MutationUpdateUserInstitutionAccessArgs = {
  institution_id: Scalars['Float'];
  user_id: Scalars['Int'];
};


export type MutationDeleteUserInstitutionAccessArgs = {
  user_id: Scalars['Int'];
};


export type MutationCreateUserTypeCapabilityArgs = {
  input: UserTypeCapabilitesInput;
};


export type MutationUpdateUserTypeCapabilityArgs = {
  capability_id: Scalars['Float'];
  user_type_id: Scalars['Int'];
};


export type MutationDeleteUserTypeCapabilityArgs = {
  user_type_id: Scalars['Int'];
};


export type MutationCreateYearArgs = {
  input: YearInput;
};


export type MutationUpdateYearArgs = {
  institutions_id: Scalars['Float'];
  name: Scalars['String'];
  year_id: Scalars['Int'];
};


export type MutationDeleteYearArgs = {
  year_id: Scalars['Int'];
};


export type MutationCreateCapabilityArgs = {
  input: CapabilityInput;
};


export type MutationUpdateCapabilityArgs = {
  name: Scalars['String'];
  capability_id: Scalars['Int'];
};


export type MutationDeleteCapabilityArgs = {
  capability_id: Scalars['Int'];
};


export type MutationCreateCombinationCourseArgs = {
  input: CombinationCourseInput;
};


export type MutationUpdateCombinationCourseArgs = {
  sub_combination_id: Scalars['Float'];
  course_id: Scalars['Float'];
  combination_id: Scalars['Int'];
};


export type MutationDeleteCombinationCourseArgs = {
  combination_id: Scalars['Int'];
};


export type MutationCreateDisciplineArgs = {
  input: DisciplineInput;
};


export type MutationUpdateDisciplineArgs = {
  is_major: Scalars['Boolean'];
  name: Scalars['String'];
  institution_id: Scalars['Float'];
  discipline_id: Scalars['Int'];
};


export type MutationDeleteDisciplineArgs = {
  discipline_id: Scalars['Int'];
};


export type MutationCreateUserTypeArgs = {
  input: UserTypeInput;
};


export type MutationUpdateUserTypeArgs = {
  name: Scalars['String'];
  user_type_id: Scalars['Int'];
};


export type MutationDeleteUserTypeArgs = {
  user_type_id: Scalars['Int'];
};


export type MutationCreateCourseArgs = {
  input: CourseInput;
};


export type MutationUpdateCourseArgs = {
  years_available: Scalars['Float'];
  semesters_available: Scalars['Float'];
  code: Scalars['Float'];
  credits: Scalars['Float'];
  name: Scalars['String'];
  prerequisite_combination_id: Scalars['Float'];
  course_id: Scalars['Int'];
};


export type MutationDeleteCourseArgs = {
  course_id: Scalars['Int'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<Users>;
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type UsernamePasswordInput = {
  email: Scalars['String'];
  password: Scalars['String'];
  name: Scalars['String'];
};

export type InstitutionInput = {
  name: Scalars['String'];
};

export type CombinationInput = {
  logical_operator: Scalars['String'];
};

export type SemesterInput = {
  name: Scalars['String'];
  institution_id: Scalars['Float'];
};

export type UserInstitutionAccessInput = {
  institution_id: Scalars['Float'];
};

export type UserTypeCapabilitesInput = {
  capability_id: Scalars['Float'];
};

export type YearInput = {
  name: Scalars['String'];
  institution_id: Scalars['Float'];
};

export type CapabilityInput = {
  name: Scalars['String'];
};

export type CombinationCourseInput = {
  course_id: Scalars['Float'];
  sub_combination_id: Scalars['Float'];
};

export type DisciplineInput = {
  institution_id: Scalars['Float'];
  name: Scalars['String'];
  is_major: Scalars['Boolean'];
};

export type UserTypeInput = {
  name: Scalars['String'];
};

export type CourseInput = {
  prerequisite_combination_id: Scalars['Float'];
};

export type CreateInstitutionMutationVariables = Exact<{
  name: Scalars['String'];
}>;


export type CreateInstitutionMutation = (
  { __typename?: 'Mutation' }
  & { createInstitution: (
    { __typename?: 'Institutions' }
    & Pick<Institutions, 'name'>
  ) }
);

export type LoginMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'UserResponse' }
    & { errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & Pick<FieldError, 'field' | 'message'>
    )>>, user?: Maybe<(
      { __typename?: 'Users' }
      & Pick<Users, 'user_id' | 'email'>
    )> }
  ) }
);


export const CreateInstitutionDocument = gql`
    mutation CreateInstitution($name: String!) {
  createInstitution(input: {name: $name}) {
    name
  }
}
    `;

export function useCreateInstitutionMutation() {
  return Urql.useMutation<CreateInstitutionMutation, CreateInstitutionMutationVariables>(CreateInstitutionDocument);
};
export const LoginDocument = gql`
    mutation Login($username: String!, $password: String!) {
  login(usernameOrEmail: $username, password: $password) {
    errors {
      field
      message
    }
    user {
      user_id
      email
    }
  }
}
    `;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};