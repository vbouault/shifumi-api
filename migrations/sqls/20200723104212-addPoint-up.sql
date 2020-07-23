ALTER TABLE `shi-fu-mi-db`.`games` 
ADD COLUMN `point_user1` INT NULL DEFAULT 0 AFTER `id_user2`,
ADD COLUMN `point_user2` INT NULL DEFAULT 0 AFTER `point_user1`;