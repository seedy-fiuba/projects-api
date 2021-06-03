CREATE DATABASE firsttest;

CREATE TABLE projects(
    id SERIAL PRIMARY KEY,
    name VARCHAR(256),
    description TEXT
);

INSERT INTO projects (name, description) VALUES
    ('linterna', 'linterna brillosa'),
    ('llavero', 'llavero con muchas llaves');