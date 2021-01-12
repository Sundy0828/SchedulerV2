-- Create DB --
CREATE DATABASE scheduler
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    CONNECTION LIMIT = -1;


-- Create Tables --

-- institutions --
CREATE TABLE institutions
(
    institution_id SERIAL NOT NULL,
    name character varying(255) NOT NULL,
    public_key uuid NOT NULL DEFAULT uuid_generate_v4(),
    secret_key uuid NOT NULL DEFAULT uuid_generate_v4(),
    PRIMARY KEY (institution_id)
);

ALTER TABLE institutions
    OWNER to postgres;

-- disciplines --
CREATE TABLE disciplines
(
    discipline_id SERIAL NOT NULL,
    institution_id integer NOT NULL,
    name character varying(255) NOT NULL,
    is_major boolean NOT NULL,
    PRIMARY KEY (discipline_id),
    CONSTRAINT "FK_discipline_institution" FOREIGN KEY (institution_id)
        REFERENCES institutions (institution_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

ALTER TABLE disciplines
    OWNER to postgres;

-- semesters --
CREATE TABLE semesters
(
    semester_id SERIAL NOT NULL,
    name character varying(255) NOT NULL,
    CONSTRAINT semesters_pkey PRIMARY KEY (semester_id),
    CONSTRAINT "FK_semesters_institutions" FOREIGN KEY (institution_id)
        REFERENCES public.institutions (institution_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

ALTER TABLE semesters
    OWNER to postgres;

-- years --
CREATE TABLE years
(
    year_id SERIAL NOT NULL,
    name character varying(255) NOT NULL,
    institution_id integer NOT NULL,
    CONSTRAINT years_pkey PRIMARY KEY (year_id),
    CONSTRAINT "FK_years_institution" FOREIGN KEY (institution_id)
        REFERENCES public.institutions (institution_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

ALTER TABLE years
    OWNER to postgres;

-- capabilities --
CREATE TABLE capabilities
(
    capability_id SERIAL NOT NULL,
    name character varying(255) NOT NULL,
    PRIMARY KEY (capability_id)
);

ALTER TABLE capabilities
    OWNER to postgres;

-- user types --
CREATE TABLE user_types
(
    user_type_id SERIAL NOT NULL,
    name character varying(255) NOT NULL,
    PRIMARY KEY (user_type_id)
);

ALTER TABLE user_types
    OWNER to postgres;

-- user type capabilities --
CREATE TABLE user_type_capabilites
(
    user_type_id integer NOT NULL,
    capability_id integer NOT NULL,
    CONSTRAINT user_type_capabilites_pkey PRIMARY KEY (user_type_id, capability_id),
    CONSTRAINT "FK_user_type_capability_capability" FOREIGN KEY (capability_id)
        REFERENCES capabilities (capability_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT "FK_user_type_capability_user_type" FOREIGN KEY (user_type_id)
        REFERENCES user_types (user_type_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

ALTER TABLE user_type_capabilites
    OWNER to postgres;

-- users --
CREATE TABLE users
(
    user_id SERIAL NOT NULL,
    name jsonb NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    salt character varying(255) NOT NULL,
    user_meta jsonb NOT NULL,
    first_failed_login date,
    login_attempts integer NOT NULL,
    timeout_start date,
    user_type_id integer NOT NULL,
    user_key uuid NOT NULL DEFAULT uuid_generate_v4(),
    PRIMARY KEY (user_id),
    CONSTRAINT "FK_user_type_user" FOREIGN KEY (user_type_id)
        REFERENCES user_types (user_type_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

ALTER TABLE users
    OWNER to postgres;

-- user institution access --
CREATE TABLE user_institution_access
(
    user_id integer NOT NULL,
    institution_id integer NOT NULL,
    CONSTRAINT user_institution_access_pkey PRIMARY KEY (user_id, institution_id),
    CONSTRAINT "FK_user_institution_access_institution" FOREIGN KEY (institution_id)
        REFERENCES institutions (institution_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT "FK_user_institution_access_user" FOREIGN KEY (user_id)
        REFERENCES users (user_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

ALTER TABLE user_institution_access
    OWNER to postgres;

-- combinations --
CREATE TABLE combinations
(
    combination_id SERIAL NOT NULL,
    logical_operator character varying(255) NOT NULL,
    PRIMARY KEY (combination_id)
);

ALTER TABLE combinations
    OWNER to postgres;

-- courses --
CREATE TABLE courses
(
    course_id SERIAL NOT NULL,
    prerequisite_combination_id integer,
    name character varying(255) NOT NULL,
    credits integer NOT NULL,
    code jsonb NOT NULL,
    semesters_available integer[] NOT NULL,
    years_available integer[] NOT NULL,
    PRIMARY KEY (course_id),
    CONSTRAINT "FK_courses_combinations" FOREIGN KEY (prerequisite_combination_id)
        REFERENCES combinations (combination_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

ALTER TABLE courses
    OWNER to postgres;

-- combination courses --
CREATE TABLE combination_courses
(
    combination_id integer NOT NULL,
    course_id integer,
    sub_combination_id integer,
    CONSTRAINT "FK_combination_courses_courses" FOREIGN KEY (course_id)
        REFERENCES courses (course_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT "FK_combination_courses_combinations" FOREIGN KEY (combination_id)
        REFERENCES combinations (combination_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

ALTER TABLE combination_courses
    OWNER to postgres;

-- dicipline courses --
CREATE TABLE discipline_courses
(
    discipline_id integer NOT NULL,
    course_id integer NOT NULL,
    PRIMARY KEY (discipline_id, course_id)
);

ALTER TABLE discipline_courses
    OWNER to postgres;

-- course years --
CREATE TABLE course_years
(
    course_id integer NOT NULL,
    year_id integer NOT NULL,
    CONSTRAINT course_years_pkey PRIMARY KEY (course_id, year_id),
    CONSTRAINT "FK_course_years_course" FOREIGN KEY (course_id)
        REFERENCES courses (course_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT "FK_course_years_year" FOREIGN KEY (year_id)
        REFERENCES years (year_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

ALTER TABLE course_years
    OWNER to postgres;

-- course semesters --
CREATE TABLE course_semesters
(
    course_id integer NOT NULL,
    semester_id integer NOT NULL,
    CONSTRAINT course_semesters_pkey PRIMARY KEY (course_id, semester_id),
    CONSTRAINT "FK_course_semesters_course" FOREIGN KEY (course_id)
        REFERENCES courses (course_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT "FK_course_semesters_semester" FOREIGN KEY (semester_id)
        REFERENCES semesters (semester_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

ALTER TABLE course_semesters
    OWNER to postgres;