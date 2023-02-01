use defaultdb;

create table defaultdb.partner(
    id int NOT NULL AUTO_INCREMENT,
    email text,
    _password text,
    avatar_Url text,
    img_cover_Url text,
    nome_entreprise varchar(20) NOT NULL,
    identificateur_entreprise text NOT NULL,
    representant_entreprise text NOT NULL,
    role_dans_entriprise text NOT NULL,
    numero_telephone varchar(10) NOT NULL,
    numero_telephone_fix varchar(10) NOT NULL,
    ville int,
    activity_entrprise int,
    offer text,
    contract_Url text,
    adrress text,
    note text,
    created_date DATETIME NOT NULL,
    _status ENUM ('Approved', 'Pending', 'Rejected'),
    PRIMARY KEY (id),
    FOREIGN KEY(ville) REFERENCES villes(id),
    FOREIGN KEY(activity_entrprise) REFERENCES entrprise_activities(id)
);



create table defaultdb.sub_partner(
    id int NOT NULL AUTO_INCREMENT,
    email text,
    _password text,
    partner_id int,
    sub_partner_Name varchar(20) NOT NULL,
    _status ENUM ('Unlocked', 'Blocked'),
    PRIMARY KEY (id),
    FOREIGN KEY(partner_id) REFERENCES partner(id)
);


create table defaultdb.villes(
    id int NOT NULL AUTO_INCREMENT,
    ville_name text,
    created_date date NOT NULL,
    PRIMARY KEY (id)
);

create table defaultdb.entrprise_activities(
    id int NOT NULL AUTO_INCREMENT,
    activity_name text,
    created_date date NOT NULL,
    PRIMARY KEY (id)
);

create table defaultdb.task_announcement(
    id int NOT NULL AUTO_INCREMENT,
    partner_name text,
    partner_full_name text,
    phone_number text,
    note text,
    task_status ENUM('Done', 'Pending'),
    ville int,
    adrress text,
    data_of_visite date NOT NULL,
    created_date date NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY(ville) REFERENCES villes(id)
);

create table defaultdb.task_done(
    id int NOT NULL AUTO_INCREMENT,
    partner_name text,
    partner_full_name text,
    phone_number text,
    note text,
    partner_status ENUM('not_intrested', 'intrested', 'thinking'),
    manager_id int,
    ville int,
    created_date date NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY(manager_id) REFERENCES _Admin(id),
    FOREIGN KEY(ville) REFERENCES villes(id)
);

create table defaultdb._Admin(
    id int NOT NULL AUTO_INCREMENT,
    email text NOT NULL,
    ville int,
    _name text,
    _password text NOT NULL,
    _role ENUM('Admin', 'Manager'),
    account_status ENUM('Banned', 'Active', 'Suspanded'),
    created_date date NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY(ville) REFERENCES villes(id)
);

drop table if EXISTS defaultdb.modify_history;

create table defaultdb.modify_history(
    id int NOT NULL AUTO_INCREMENT,
    partner_id int,
    admin_id int,
    edited_column text,
    created_date DATETIME NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY(partner_id) REFERENCES partner(id),
    FOREIGN KEY(admin_id) REFERENCES _Admin(id)
);


create table defaultdb.scan_hsitory(
    id int NOT NULL AUTO_INCREMENT,
    partner_id int,
	client_id int,
	product varchar(50),
	scan_time int,
    created_date DATETIME NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY(partner_id) REFERENCES partner(id),
    FOREIGN KEY(admin_id) REFERENCES _Admin(id)
);


ALTER TABLE
    defaultdb.partner
MODIFY
    defaultdb.partner.created_date DATETIME;

select
    *
from
    defaultdb.modify_history;

select
    NOW();

insert into
    defaultdb.modify_history(
        partner_id,
        admin_id,
        edited_column,
        created_date
    )
values
    (1, 1, '${applied_modife}', NOW());

-- 	
insert into
    defaultdb._Admin(
        email,
        ville,
        _name,
        _password,
        _role,
        account_status,
        created_date
    )
values
    (
        'reducte.cloud@gmail.com',
        1,
        'SUPER_ADMIN',
        '$2a$10$nPh0FRYpxalCb5UT9/Zim.CNw1SQhFiSv1uVoabbfbZDiK.OFxLeG',
        'Admin',
        'Active',
        CURDATE()
    );

create table defaultdb.Admins_partners(
    id int NOT NULL AUTO_INCREMENT,
    admin_id int,
    partner_id int,
    created_date date NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY(admin_id) REFERENCES defaultdb._Admin(id),
    FOREIGN KEY(partner_id) REFERENCES partner(id)
);

select
    _Admin.id,
    email,
    _password,
    _name,
    ville,
    _role,
    account_status
from
    defaultdb._Admin
    inner join defaultdb.villes on defaultdb._Admin.ville = defaultdb.villes.id
ORDER BY
    defaultdb._Admin.id DESC

