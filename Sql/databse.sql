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
    created_date date NOT NULL,
    _status ENUM ('Approved', 'Pending', 'Rejected'),
    PRIMARY KEY (id),
    FOREIGN KEY(ville) REFERENCES villes(id),
    FOREIGN KEY(activity_entrprise) REFERENCES entrprise_activities(id)
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
    task_status ENUM('Done','Pending'), 
    adrress text,
    created_date date NOT NULL,
    PRIMARY KEY (id)
);

create table defaultdb.task_done(
    id int NOT NULL AUTO_INCREMENT,
    partner_name text,
    partner_status ENUM('not_intrested','intrested','thinking'), 
    created_date date NOT NULL,
    PRIMARY KEY (id)
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

create table defaultdb.Admins_partners(
    id int NOT NULL AUTO_INCREMENT,
    admin_id int,
    partner_id int,
    created_date date NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY(admin_id) REFERENCES defaultdb._Admin(id),
    FOREIGN KEY(partner_id) REFERENCES partner(id)
);

