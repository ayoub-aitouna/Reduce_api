create database sql7598449;

use sql7598449;




create table sql7598449.villes(
    id int NOT NULL AUTO_INCREMENT,
    ville_name text,
    created_date date NOT NULL,
    PRIMARY KEY (id)
);

create table sql7598449.entrprise_activities(
    id int NOT NULL AUTO_INCREMENT,
    activity_name text,
    created_date date NOT NULL,
    PRIMARY KEY (id)
);

/*
 partner;
 *rating int (0 - 5)
 */
create table sql7598449.partner(
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

create table sql7598449.sub_partner(
    id int NOT NULL AUTO_INCREMENT,
    email text,
    _password text,
    partner_id int,
    sub_partner_Name varchar(20) NOT NULL,
    _status ENUM ('Unlocked', 'Blocked'),
    PRIMARY KEY (id),
    FOREIGN KEY(partner_id) REFERENCES partner(id)
);

create table sql7598449.task_announcement(
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

create table sql7598449._Admin(
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

create table sql7598449.task_done(
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

drop table if EXISTS sql7598449.modify_history;

create table sql7598449.modify_history(
    id int NOT NULL AUTO_INCREMENT,
    partner_id int,
    admin_id int,
    edited_column text,
    created_date DATETIME NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY(partner_id) REFERENCES partner(id),
    FOREIGN KEY(admin_id) REFERENCES _Admin(id)
);

drop table if EXISTS sql7598449.profession;

create table sql7598449.profession(
    id int NOT NULL AUTO_INCREMENT,
    profession text,
	PRIMARY KEY (id)
);

drop table if EXISTS sql7598449.client;

CREATE TABLE sql7598449.client (
    id INT NOT NULL AUTO_INCREMENT,
    full_name TEXT,
    birth_date DATETIME NOT NULL,
    sexe ENUM('M', 'F'),
    ville INT,
    adresse TEXT,
    profession INT,
    tel TEXT,
    email text NOT NULL,
    _password text NOT NULL,
    abonnement ENUM(
        'Abonne',
        'Telecharger',
        'Gratuit',
        'Routier',
        'investisseur'
    ),
    device_id TEXT,
    statut ENUM('Activé', 'Desactivé', 'Archivé'),
    date_inscription DATETIME NOT NULL,
    date_debut_abonnement DATETIME NOT NULL,
    date_fin_abonnement DATETIME NOT NULL,
    created_date DATETIME NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (profession) REFERENCES profession(id)
);

create table sql7598449.scan_hsitory(
    id int NOT NULL AUTO_INCREMENT,
    partner_id int,
    client_id int,
    product varchar(50),
    scan_time int,
    created_date DATETIME NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY(partner_id) REFERENCES partner(id),
    FOREIGN KEY(client_id) REFERENCES client(id)
);


create table sql7598449.Admins_partners(
    id int NOT NULL AUTO_INCREMENT,
    admin_id int,
    partner_id int,
    created_date date NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY(admin_id) REFERENCES sql7598449._Admin(id),
    FOREIGN KEY(partner_id) REFERENCES partner(id)
);

-- default passowrd ==  abcdef.123456@@