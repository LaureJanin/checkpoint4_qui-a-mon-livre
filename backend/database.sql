DROP TABLE IF EXISTS admin;
DROP TABLE IF EXISTS borrower;
DROP TABLE IF EXISTS book;
DROP TABLE IF EXISTS admin_book;

CREATE TABLE admin (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(80) NOT NULL,
  password VARCHAR(250) NOT NULL
);

CREATE TABLE borrower (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  firstname VARCHAR(100) NULL,
  lastname VARCHAR(150) NULL,
  email VARCHAR(80) NULL,
  phone_number VARCHAR(20) NULL
);

CREATE TABLE book (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(80) NOT NULL,
  author VARCHAR(80) NOT NULL,
  year VARCHAR(25) NULL,
  resume TEXT NULL,
  isBorrowed BOOLEAN NOT NULL DEFAULT FALSE,
  loan_date DATE NULL,
  borrower_id INT NULL,
  admin_id INT NOT NULL,
  FOREIGN KEY (borrower_id) REFERENCES borrower(id),
  FOREIGN KEY (admin_id) REFERENCES admin(id)
);

CREATE TABLE admin_book (
  admin_id INT NOT NULL,
  book_id INT NOT NULL,
  PRIMARY KEY (admin_id, book_id),
  FOREIGN KEY (admin_id) REFERENCES admin(id),
  FOREIGN KEY (book_id) REFERENCES book(id)
);

INSERT INTO admin (username, password) 
VALUES ("Laure", "$argon2id$v=19$m=65536,t=5,p=1$IuFnMLPYW2+3n5eWxdcEBw$qQRs51SNs3W4JIV/reBWMn0L83QZUqMeR9FqMVqXNwA"),
("Petit Piou", "$argon2id$v=19$m=65536,t=5,p=1$EqR8NWlbj57BVjbHhZYX3w$Ab/5UXs8t0mwKg5XC0b40gNENqi7y6LhPR3WZqHnIOc");

INSERT INTO borrower (firstname, lastname, email, phone_number)
VALUES ("John", "Doe", "john.doe@mail.com", "0000000000"),
("Alexandra", "Desbat", "alexandra.desbat@mail.com", "0102030405"),
("Anais", "Biat", "anais.biat@mail.com", "0612345678"),
("Quentin", "Roche", "quentin.roche@mail.com", "0102030405"),
("Marine", "Janin", "marine.janin@mail.com", "0102030405"),
("Romain", "Grare", "romain.grare@mail.com", "0102030405");

INSERT INTO book (title, author, year, resume, isBorrowed, loan_date, borrower_id, admin_id)
VALUES ("La Métamorphose", "Kafka", "1915", "Cette longue nouvelle décrit la métamorphose et les mésaventures de Gregor Samsa, un représentant de commerce qui se réveille un matin transformé en un « monstrueux insecte ». À partir de cette situation absurde, Kafka présente une critique sociale, en mêlant thématiques économiques et sociétales et questionnements sur l'individu, la solitude et la mort.", true, "2022-02-09", 3, 1),
("La ferme des animaux", "George Orwell", "1945", "L’histoire se situe dans la ferme des Jones où le mécontentement gronde parmi les animaux qui considèrent l’homme comme un véritable tyran. Les cochons prennent alors la tête d'un mouvement révolutionnaire qui va déclencher la chute des hommes.", true, "2022-06-12", 2, 2),
("Au bonheur des ogres", "Daniel Pennac", "1985", "Dans la tribu des Malaussène, il y a quelque chose de curieux, malgré tout c'est le bonheur qui règne. Pour Benjamin Malaussène, bouc émissaire professionnel et frère aîné responsable de cette marmaille, la vie n'est jamais ennuyeuse...", true, "2022-04-07", 3, 1),
("Molloy", "Samuel Beckett", "1951", "De même que Dante chemine de cercle en cercle pour atteindre son Enfer ou son Paradis, Samuel Beckett situe dans un cercle bien distinct chacun des trois principaux protagonistes des romans de sa trilogie, Molloy, Malone meurt et L'Innommable, afin qu'ils atteignent, peut-être, le néant auquel ils aspirent.", true, "2023-01-02", 4, 1),
("Les mangeurs d'étoiles", "Romain Gary", "1966", "Le récit commence par l'arrivée dans un pays d'Amérique du Sud d'un célèbre pasteur américain ainsi que d'une troupe de saltimbanques. Une révolte éclate alors dans la jeune république récemment renversée par un coup d'État.", true, "2022-07-12", 5, 2),
("Le château des Carpathes", "Jules Verne", "1892", "Dans le village de Werst, Frick, un berger, remarque un jour qu'une fumée semble sortir du château en ruine de Rodolphe de Gortz : l'édifice serait donc à nouveau habité. Cette nouvelle terrifie les villageois, persuadés que le château est hanté.", true, "2023-01-02", 4, 2),
("Le Mythe de Cthulhu", "H.P. Lovecraft", "Années 1920", "Le mythe de Cthulhu est un univers de fiction collectif, développé par de multiples auteurs à partir de l'œuvre de l'écrivain américain Howard Phillips Lovecraft. Le monde du mythe de Cthulhu est un reflet du monde réel, mais où des entités extraterrestres cherchent à rétablir leur ancienne domination.", true, "2022-04-17", 2, 1),
("La horde du contrevent", "Alain Damasio", "2004", "Ils sont vingt-trois, forment la trente-quatrième Horde du Contrevent. Dans un monde balayé par les vents, ils ont été formés depuis l'enfance dans un seul but : parcourir le monde, de l'Aval vers l'Amont, face au vent, à travers la plaine, l'eau et les pics glacés, pour atteindre le mythique Extrême-Amont.", true, "2022-05-18", 3, 2),
("Carrie", "Stephen King", "1974", "Une mère puritaine, obsédée par le diable et le péché ; des camarades de classe dont elle est le souffre-douleur : Carrie est profondément malheureuse. À seize ans, resurgit en elle le souvenir d'un « don » étrange qui avait marqué son enfance : elle pouvait déplacer des objets à distance. Ce pouvoir réapparaît aujourd'hui, plus impérieux...", true, "2022-09-04", 2, 1),
("Notre Dame de Paris", "Victor Hugo", "1831", "L'intrigue se déroule à Paris en 1482. Les deux premiers livres du roman suivent Pierre Gringoire, poète sans le sou et auteur d'un mystère qui doit être représenté le 6 janvier 1482 au Palais de justice. Malheureusement, l'attention de la foule est vite distraite par l'élection du Pape des fous.", true, "2022-08-25", 3, 2);

ALTER TABLE book
ADD CONSTRAINT book_adminId FOREIGN KEY (admin_id)
REFERENCES admin(id)
ON DELETE CASCADE;