-- Users
drop table users cascade;

create table users (
    user_id serial primary key,
    email text unique,
    password_text text,
    password_salt text,
    username text
);

-- Drinks
drop table drinks;
drop table drink_types;

create table drink_types (
    drink_type_id serial primary key,
    drinkName text,

    created_at timestamp,
    updated_at timestamp
);

create table drinks (
    drink_id serial primary key,
    drink_type_id int,
    user_id int,

    created_at timestamp,
    updated_at timestamp,

    foreign key (drink_type_id) references drink_types,
    foreign key (user_id) references users
);

---------------------
------Testdata-------
---------------------
-- insert into users values (1, 'georg.windhaber@gmail.com', '', '', 'Georg Windhaber');
-- insert into users values (2, 'nico.kratky@me.com', '', '', 'Nico Kratky');
-- insert into users values (3, 'christine.zeh@gmail.com', '', '', 'Christine Zeh');

-- insert into drink_types values (1, 'beer', '2022-11-01T15:00:00', '2022-11-01T15:00:00');
-- insert into drink_types values (2, 'wine', '2022-11-01T15:00:00', '2022-11-01T15:00:00');
-- insert into drink_types values (3, 'water', '2022-11-01T15:00:00', '2022-11-01T15:00:00');

-- insert into drinks (drink_type_id, user_id, created_at, updated_at) values (1, 1, '2022-11-01T15:00:00', '2022-11-01T15:00:00');
-- insert into drinks (drink_type_id, user_id, created_at, updated_at) values (2, 1, '2022-11-01T15:00:00', '2022-11-01T15:00:00');
-- insert into drinks (drink_type_id, user_id, created_at, updated_at) values (1, 2, '2022-11-01T15:00:00', '2022-11-01T15:00:00');
-- insert into drinks (drink_type_id, user_id, created_at, updated_at) values (1, 3, '2022-11-01T15:00:00', '2022-11-01T15:00:00');