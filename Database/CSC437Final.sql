

create table Person (
   id int auto_increment primary key,
   firstName varchar(30),
   lastName varchar(30) not null,
   email varchar(30) not null,
   password varchar(50),
   whenRegistered datetime not null,
   termsAccepted datetime,
   role int unsigned not null,  # 0 normal, 1 admin
   unique key(email)
);

create table MovieList (
   id int auto_increment primary key,
   ownerId int,
   publicFlag int,
   lastImage varchar(600),
   title varchar(80) not null,
   constraint FKMessage_ownerId foreign key (ownerId) references Person(id)
    on delete cascade,
   unique key(id)
);

create table Movie (
   id int auto_increment primary key,
   lstId int not null,
   prsId int not null,
   Title varchar(600),
   Year varchar(4),
   imdbID varchar(10),
   Genre varchar(600),
   imdbRating int,
   whenMade datetime not null,
   favoriteFlag int,
   constraint FKMessage_lstId foreign key (lstId) references MovieList(id)
    on delete cascade,
   constraint FKMessage_prsId foreign key (prsId) references Person(id)
    on delete cascade
);

insert into Person (firstName, lastName, email,       password,   whenRegistered, role)
            VALUES ("Joe",     "Admin", "adm@11.com", "password", NOW(), 1);
