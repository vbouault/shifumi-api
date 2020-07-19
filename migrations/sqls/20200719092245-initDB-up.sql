CREATE TABLE `users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `encrypted_password` VARCHAR(255) NULL,
  PRIMARY KEY (`id`));
