-- Users
drop table users;

create table users (
    userId serial primary key,
    email text,
    userPassword text,
    userName text
);

-- Drinks
drop table drinks;
drop table drinkTypes;

create table drinkTypes (
    drinkTypeId serial primary key,
    drinkName text,

    createdAt timestamp,
    updatedAt timestamp
);

create table drinks (
    drinkId serial primary key,
    drinkTypeId int,
    userId int,

    createdAt timestamp,
    updatedAt timestamp,

    foreign key (drinkTypeId) references drinkTypes,
    foreign key (userId) references users
);

---------------------
------Testdata-------
---------------------
insert into users values (1, 'georg.windhaber@gmail.com', 'brogress', 'Georg Windhaber');
insert into users values (2, 'nico.kratky@me.com', 'securePassword9309', 'Nico Kratky');
insert into users values (3, 'christine.zeh@gmail.com', 'fishcakeTastesGood', 'Christine Zeh');

insert into drinkTypes values (1, 'beer', '2022-11-01T15:00:00', '2022-11-01T15:00:00');
insert into drinkTypes values (2, 'wine', '2022-11-01T15:00:00', '2022-11-01T15:00:00');
insert into drinkTypes values (3, 'water', '2022-11-01T15:00:00', '2022-11-01T15:00:00');

insert into drinks (drinkTypeId, userId, createdAt, updatedAt) values (1, 1, '2022-11-01T15:00:00', '2022-11-01T15:00:00');
insert into drinks (drinkTypeId, userId, createdAt, updatedAt) values (2, 1, '2022-11-01T15:00:00', '2022-11-01T15:00:00');
insert into drinks (drinkTypeId, userId, createdAt, updatedAt) values (1, 2, '2022-11-01T15:00:00', '2022-11-01T15:00:00');
insert into drinks (drinkTypeId, userId, createdAt, updatedAt) values (1, 3, '2022-11-01T15:00:00', '2022-11-01T15:00:00');