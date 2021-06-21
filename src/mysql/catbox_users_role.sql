CREATE USER 'catbox_api'@'localhost' IDENTIFIED BY 'xxxxxx';
CREATE ROLE 'catbox_role_readonly';
CREATE ROLE 'catbox_role_write';

GRANT SELECT ON catbox.* TO 'catbox_role_readonly';
GRANT INSERT, UPDATE ON catbox.* TO 'catbox_role_write';

GRANT catbox_role_readonly, catbox_role_write TO 'catbox_api'@'localhost';
SET DEFAULT ROLE ALL TO 'catbox_api'@'localhost';


