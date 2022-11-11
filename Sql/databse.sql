use defaultdb;

create table defaultdb.partner(
    id int NOT NULL AUTO_INCREMENT,
    email text,
    _password text,
    avatar_Url text,
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
    created_date date NOT NULL,
    _status ENUM ('Approved', 'Pending', 'Rejected'),
    PRIMARY KEY (id),
    FOREIGN KEY(ville) REFERENCES villes(id),
    FOREIGN KEY(activity_entrprise) REFERENCES entrprise_activities(id)
);

UPDATE
    defaultdb.partner
set
    email = "aitounaayoub05@gmail.com"
WHERE
    id = 34;

SELECT
    *
FROM
    defaultdb.partner
WHERE
    id = 34;

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
    FOREIGN KEY(manager_id) REFERENCES partner(id),
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

create table defaultdb.modify_history(
    id int NOT NULL AUTO_INCREMENT,
    partner_id int,
    admin_id int,
    created_date date NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY(partner_id) REFERENCES partner(id),
    FOREIGN KEY(admin_id) REFERENCES _Admin(id)
);

select
    *
from
    defaultdb.modify_history;

-- abcdef.123456@@
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