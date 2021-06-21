
[User from email]
SELECT * FROM user WHERE email = ?

[Register User]
INSERT INTO user(email, password_hash) VALUES (?, ?)

[Change password]
UPDATE user SET password_hash = ? WHERE user_id = ?

