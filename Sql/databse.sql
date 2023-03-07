create database sql7603674;

use sql7603674;

drop table if EXISTS sql7603674.villes;

create table sql7603674.villes(
    id int NOT NULL AUTO_INCREMENT,
    ville_name text,
    created_date date NOT NULL,
    PRIMARY KEY (id)
);

drop table if EXISTS sql7603674.entrprise_activities;

create table sql7603674.entrprise_activities(
    id int NOT NULL AUTO_INCREMENT,
    activity_name text,
    created_date date NOT NULL,
    PRIMARY KEY (id)
);

drop table if EXISTS sql7603674.partner;

CREATE TABLE sql7603674.partner(
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
    rating FLOAT(8, 2),
    lat FLOAT(8, 5),
    longitude FLOAT(8, 5),
    note text,
    created_date DATETIME NOT NULL,
    _status ENUM ('Approved', 'Pending', 'Rejected'),
    PRIMARY KEY (id),
    FOREIGN KEY(ville) REFERENCES sql7603674.villes(id),
    FOREIGN KEY(activity_entrprise) REFERENCES sql7603674.entrprise_activities(id)
);

drop table if EXISTS sql7603674.sub_partner;

create table sql7603674.sub_partner(
    id int NOT NULL AUTO_INCREMENT,
    email text,
    _password text,
    partner_id int,
    sub_partner_Name varchar(20) NOT NULL,
    _status ENUM ('Unlocked', 'Blocked'),
    PRIMARY KEY (id),
    FOREIGN KEY(partner_id) REFERENCES sql7603674.partner(id)
);

drop table if EXISTS sql7603674.task_announcement;

create table sql7603674.task_announcement(
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
    FOREIGN KEY(ville) REFERENCES sql7603674.villes(id)
);

drop table if EXISTS sql7603674._Admin;

create table sql7603674._Admin(
    id int NOT NULL AUTO_INCREMENT,
    email text NOT NULL,
    ville int,
    _name text,
    _password text NOT NULL,
    _role ENUM('Admin', 'Manager'),
    account_status ENUM('Banned', 'Active', 'Suspanded'),
    created_date date NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY(ville) REFERENCES sql7603674.villes(id)
);

drop table if EXISTS sql7603674.task_done;

create table sql7603674.task_done(
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
    FOREIGN KEY(manager_id) REFERENCES sql7603674._Admin(id),
    FOREIGN KEY(ville) REFERENCES sql7603674.villes(id)
);

drop table if EXISTS sql7603674.modify_history;

create table sql7603674.modify_history(
    id int NOT NULL AUTO_INCREMENT,
    partner_id int,
    admin_id int,
    edited_column text,
    created_date DATETIME NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY(partner_id) REFERENCES sql7603674.partner(id),
    FOREIGN KEY(admin_id) REFERENCES sql7603674._Admin(id)
);

drop table if EXISTS sql7603674.profession;

create table sql7603674.profession(
    id int NOT NULL AUTO_INCREMENT,
    profession text,
    PRIMARY KEY (id)
);

drop table if EXISTS sql7603674.client;

CREATE TABLE sql7603674.client (
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
    FOREIGN KEY (profession) REFERENCES sql7603674.profession(id)
);

drop table if EXISTS sql7603674.scan_hsitory;

create table sql7603674.scan_hsitory(
    id int NOT NULL AUTO_INCREMENT,
    partner_id int,
    sub_partner_id int,
    statut ENUM('active', 'deleted'),
    client_id int,
    product varchar(50),
    scan_time int,
    created_date DATETIME NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY(partner_id) REFERENCES sql7603674.partner(id),
    FOREIGN KEY(sub_partner_id) REFERENCES sql7603674.sub_partner(id),
    FOREIGN KEY(client_id) REFERENCES sql7603674.client(id)
);

create table sql7603674.Admins_partners(
    id int NOT NULL AUTO_INCREMENT,
    admin_id int,
    partner_id int,
    created_date date NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY(admin_id) REFERENCES sql7603674._Admin(id),
    FOREIGN KEY(partner_id) REFERENCES sql7603674.partner(id)
);

drop table if EXISTS sql7603674.banners;

create table sql7603674.banners(
    id int NOT NULL AUTO_INCREMENT,
    Baniere_ordre int,
    Logo text,
    Couverture text,
    Offer text,
    Adresse text,
    Tel text,
    statut ENUM ('activer', 'Desactiver'),
    created_date DATETIME NOT NULL,
    PRIMARY KEY (id)
);

drop table if EXISTS sql7603674.ratings;

create table sql7603674.ratings(
    id int NOT NULL AUTO_INCREMENT,
    partner_id int,
    client_id int,
    email text,
    _subject text,
    serviceRating int,
    communicationRating int,
    recommendationRating int,
    PRIMARY KEY (id),
    FOREIGN KEY(partner_id) REFERENCES sql7603674.partner(id),
    FOREIGN KEY(client_id) REFERENCES sql7603674.client(id)
);

-- default passowrd ==  abcdef.123456@@
select * from sql7603674.partner;