-- Active: 1698447633017@@127.0.0.1@3306
PRAGMA foreign_keys = ON;
PRAGMA date_class = 'datetime';

-- CRIAÇÃO USER
CREATE TABLE users (
  id TEXT PRIMARY KEY NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL,
  created_at DATETIME DEFAULT (strftime('%Y-%m-%d %H:%M:%S', 'now', 'localtime'))
);

-- CRIAÇÃO POSTS
CREATE TABLE posts (
  id TEXT PRIMARY KEY NOT NULL UNIQUE,
  creator_id TEXT NOT NULL,
  content TEXT NOT NULL,
  likes INTEGER NOT NULL,
  dislikes INTEGER NOT NULL,
  created_at DATETIME DEFAULT (strftime('%Y-%m-%d %H:%M:%S', 'now', 'localtime')),
  updated_at DATETIME DEFAULT (strftime('%Y-%m-%d %H:%M:%S', 'now', 'localtime')),
   FOREIGN KEY (creator_id) REFERENCES users (id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

-- CRIAÇÃO LIKE DISLIKE
CREATE TABLE likes_dislikes (
  user_id TEXT NOT NULL,
  post_id TEXT NOT NULL,
  like INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users (id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  FOREIGN KEY (post_id) REFERENCES posts(id) 
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

-- INSERT INTO users, posts e likes_dislikes
INSERT INTO users (id, name, email, password, role)
VALUES
  ('user1', 'João', 'joao@example.com', 'senha123', 'admin'),
  ('user2', 'Maria', 'maria@example.com', 'senha456', 'user'),
  ('user3', 'Pedro', 'pedro@example.com', 'senha789', 'user'),
  ('user4', 'Ana', 'ana@example.com', 'senhaabc', 'user'),
  ('user5', 'Carlos', 'carlos@example.com', 'senhaxyz', 'user');

INSERT INTO posts (id, creator_id, content, likes, dislikes)
VALUES
  ('post1', 'user1', 'Primeiro post', 10, 2),
  ('post2', 'user2', 'Segundo post', 8, 3),
  ('post3', 'user3', 'Terceiro post', 12, 1),
  ('post4', 'user4', 'Quarto post', 15, 5),
  ('post5', 'user5', 'Quinto post', 20, 0);

INSERT INTO likes_dislikes (user_id, post_id, like)
VALUES
  ('user1', 'post1', 1),
  ('user2', 'post1', 0),
  ('user3', 'post2', 1),
  ('user4', 'post3', 1),
  ('user5', 'post4', 0);

-- UPDATE PARA LIKE
UPDATE likes_dislikes
SET like = 0
WHERE user_id = 'user1' AND post_id = 'post1';

-- UPDATE PARA DISLIKE
UPDATE likes_dislikes
SET like = 1
WHERE user_id = 'user2' AND post_id = 'post1';

-- SELECT PARA VERIFICAR OS RESULTADOS
SELECT * FROM likes_dislikes;
SELECT * FROM posts


DROP TABLE users;
DROP TABLE posts;
DROP TABLE likes_dislikes;