drop table refresh_token;

create table refresh_token (
	user_id int,
	refresh_token text,
	foreign key (user_id) references users
);