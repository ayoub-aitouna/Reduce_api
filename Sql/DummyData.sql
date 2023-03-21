INSERT INTO
    sql7607447._Admin (
        email,
        ville,
        _name,
        _password,
        _role,
        account_status,
        created_date
    )
VALUES
    (
        'admin@example.com',
        1,
        'John Doe',
        '$2a$10$FJYH6mydZ5NUvS4MRuajm.5L8EC4OMR0baPROi8RgIiglgDgTvD3O',
        'Admin',
        'Active',
        NOW()
    );



INSERT into sql7607447.profession(profession) VALUES ('Employee');

INSERT into sql7607447.villes( 
    ville_name,
    created_date,
    status
    )
    VALUES
    (
        'Marakech',
        NOW(),
        1
    );

INSERT into sql7607447.entrprise_activities(activity_name) VALUES ('Ecommers');


-- Selects 
select
    *
from
    sql7607447.partner;


SELECT
    *
FROM
    banners
WHERE
    statut == 'activer'
ORDER BY
    Baniere_ordre;
