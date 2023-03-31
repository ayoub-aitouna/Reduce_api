create table sql7610156.villes();

INSERT into
    sql7610156.villes(ville_name, created_date)
VALUES
    ('Marrakech', NOW());

INSERT INTO
    sql7610156._Admin (
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

INSERT into
    sql7610156.profession(profession)
VALUES
    ('Employee');

INSERT into
    sql7610156.entrprise_activities(activity_name)
VALUES
    ('Ecommers');

-- Selects 
select
    *
from
    sql7610156._Admin;i

SELECT
    *
FROM
    sql7610156.partner
WHERE
    statut == 'activer'
ORDER BY
    Baniere_ordre;

select
    *
from
    sql7610156.villes
SELECT
    c.id,
    c.ville_name,
    IF(b.activity_id IS NULL, TRUE, FALSE) AS status
FROM
    sql7610156.villes c
    LEFT JOIN sql7610156.blocked_activities b ON c.id = b.city_id
    AND b.activity_id = 1;

select
    *
from
    sql7610156.banners;