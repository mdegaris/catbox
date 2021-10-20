-- MySQL Workbench Synchronization
-- Generated: 2021-10-20 20:44
-- Model: New Model
-- Version: 1.0
-- Project: Name of the project
-- Author: Marc

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

CREATE TABLE IF NOT EXISTS `test`.`user` (
  `id` INT(11) NOT NULL AUTO_INCREMENT COMMENT 'Surrogate PK.',
  `email` VARCHAR(320) NOT NULL COMMENT 'User\'s valid email address.',
  `username` VARCHAR(20) NOT NULL COMMENT 'Custom username used during chat.',
  `password_hash` VARCHAR(255) NOT NULL COMMENT 'Hashed password string.',
  `birthdate` DATE NOT NULL COMMENT 'Date of birth.',
  `created_on` DATETIME NOT NULL COMMENT 'Date and time the user account was created.',
  `modified_on` DATETIME NULL DEFAULT NULL COMMENT 'Date and time user profile was modified.',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COMMENT = 'All registered user accounts, and associated the profile information.';

CREATE TABLE IF NOT EXISTS `test`.`role` (
  `id` INT(11) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `description` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `test`.`privilege` (
  `id` INT(11) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `description` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `test`.`role_privilege` (
  `role_id` INT(11) NOT NULL,
  `privilege_id` INT(11) NOT NULL,
  PRIMARY KEY (`role_id`, `privilege_id`),
  INDEX `fk_role_priv_role_idx` (`role_id` ASC) VISIBLE,
  INDEX `fk_role_priv_privilege_idx` (`privilege_id` ASC) VISIBLE,
  CONSTRAINT `fk_role_perm_role`
    FOREIGN KEY (`role_id`)
    REFERENCES `test`.`role` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_role_perm_permission`
    FOREIGN KEY (`privilege_id`)
    REFERENCES `test`.`privilege` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `test`.`room` (
  `id` INT(11) NOT NULL COMMENT 'Surrogate PK.',
  `created_on` DATETIME NOT NULL COMMENT 'Date and time the room was created.',
  `created_by` INT(11) NOT NULL COMMENT 'The user id who created the room.',
  PRIMARY KEY (`id`),
  INDEX `fk_room_user_idx` (`created_by` ASC) VISIBLE,
  CONSTRAINT `fk_room_user`
    FOREIGN KEY (`created_by`)
    REFERENCES `test`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COMMENT = 'All chat rooms, including all active and deleted rooms.'
PACK_KEYS = DEFAULT
ROW_FORMAT = DEFAULT
KEY_BLOCK_SIZE = 16;

CREATE TABLE IF NOT EXISTS `test`.`attend` (
  `user_id` INT(11) NOT NULL,
  `room_id` INT(11) NOT NULL,
  `joined_on` DATETIME NOT NULL,
  INDEX `fk_attend_user_idx` (`user_id` ASC) VISIBLE,
  INDEX `fk_attend_room_idx` (`room_id` ASC) VISIBLE,
  PRIMARY KEY (`user_id`, `room_id`),
  CONSTRAINT `fk_attend_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `test`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_attend_room`
    FOREIGN KEY (`room_id`)
    REFERENCES `test`.`room` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `test`.`chat` (
  `id` INT(11) NOT NULL AUTO_INCREMENT COMMENT 'Surrogate PK',
  `user_id` INT(11) NOT NULL COMMENT 'The user ID of the user who posted all the chat\'s messages.',
  `room_id` INT(11) NOT NULL COMMENT 'The room ID where all the chat\'s messages were posted.',
  PRIMARY KEY (`id`),
  INDEX `fk_chat_user_idx` (`user_id` ASC) VISIBLE,
  INDEX `fk_chat_room_idx` (`room_id` ASC) VISIBLE,
  CONSTRAINT `fk_chat_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `test`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_chat_room`
    FOREIGN KEY (`room_id`)
    REFERENCES `test`.`room` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COMMENT = 'Stores all the collections of messages that are associated with users and rooms.';

CREATE TABLE IF NOT EXISTS `test`.`message` (
  `id` BIGINT(1) NOT NULL AUTO_INCREMENT,
  `chat_id` INT(11) NOT NULL,
  `content` VARCHAR(2000) NOT NULL,
  `posted_on` DATETIME NOT NULL,
  `state` CHAR(1) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_message_chat_idx` (`chat_id` ASC) VISIBLE,
  CONSTRAINT `fk_message_chat`
    FOREIGN KEY (`chat_id`)
    REFERENCES `test`.`chat` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `test`.`user_role` (
  `role_id` INT(11) NOT NULL,
  `user_id` INT(11) NOT NULL,
  PRIMARY KEY (`role_id`, `user_id`),
  INDEX `fk_user_role_user_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `fk_user_role_role`
    FOREIGN KEY (`role_id`)
    REFERENCES `test`.`role` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_user_role_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `test`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `test`.`active_room` (
  `room_id` INT(11) NOT NULL,
  `name` VARCHAR(30) NOT NULL,
  PRIMARY KEY (`room_id`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC) VISIBLE,
  INDEX `fk_active_room_idx` (`room_id` ASC) VISIBLE,
  CONSTRAINT `fk_active_room`
    FOREIGN KEY (`room_id`)
    REFERENCES `test`.`room` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COMMENT = 'All currently active char rooms.';

CREATE TABLE IF NOT EXISTS `test`.`deleted_room` (
  `room_id` INT(11) NOT NULL,
  `name` VARCHAR(30) NOT NULL,
  PRIMARY KEY (`room_id`),
  INDEX `fk_deleted_room_idx` (`room_id` ASC) VISIBLE,
  CONSTRAINT `fk_deleted_room`
    FOREIGN KEY (`room_id`)
    REFERENCES `test`.`room` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COMMENT = 'All deleted chat rooms.';

CREATE TABLE IF NOT EXISTS `test`.`room_state` (
  `room_id` INT(11) NOT NULL,
  `is_active` INT(11) NOT NULL,
  `is_deleted` INT(11) NOT NULL,
  INDEX `fk_active_room_idx` (`room_id` ASC) VISIBLE,
  PRIMARY KEY (`room_id`),
  INDEX `fk_room_state_is_active.idx` (`is_active` ASC) VISIBLE,
  INDEX `fk_room_state_is_active.idx` (`is_deleted` ASC) VISIBLE,
  CONSTRAINT `fk_active_room0`
    FOREIGN KEY (`room_id`)
    REFERENCES `test`.`room` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_room_state_active_room1`
    FOREIGN KEY (`is_active`)
    REFERENCES `test`.`active_room` (`room_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_room_state_deleted_room1`
    FOREIGN KEY (`is_deleted`)
    REFERENCES `test`.`deleted_room` (`room_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COMMENT = 'All currently active char rooms.';

ALTER TABLE test.room_state ADD CONSTRAINT CHECK
(
	(is_active IS NOT NULL AND is_active = room_id AND is_deleted IS NULL)
    OR
    (is_deleted IS NOT NULL AND is_deleted = room_id AND is_active IS NULL)
);

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;


