/*
	Populate with test data.
*/

DELETE FROM test.role_privilege;
DELETE FROM test.role;
DELETE FROM test.privilege;
DELETE FROM test.user;


INSERT INTO test.privilege(name, description) VALUES
('Login','Ability to log into their registered account.'),
('Post Message','Permits the posting of chat room messages.'),
('Join Room','Ability to join new room.'),
('Create Room','Ability to create a new room.'),
('Delete Message','Select and delete an already posted message.'),
('Delete Room','Select and delete a chat room.'),
('Ban User','Ability to suspend a user from the application.');
-- ('Usage', 'Has minimal privilege to view the application, and nothing else.');


INSERT INTO test.role(name, description) VALUES
('Active','Normal active user.'),
('Moderator','Able to moderate chat rooms.'),
('Admin','Super user, and has all known privileges.'),
('Suspended','A user no longer permitted to use the application, and cannot login.');


INSERT INTO test.role_privilege(role_id, privilege_id) 
SELECT 
    r.id, p.id
FROM
    test.role r,
    test.privilege p
WHERE
(
		r.name = 'Moderator'
	AND p.name IN ('Usage', 'Login' , 'Post Message', 'Delete Message', 'Ban User', 'Join Room')
)
OR
(
		r.name = 'Active'
	AND p.name IN ('Usage', 'Login' , 'Post Message', 'Join Room')
)
OR
(
		r.name = 'Admin'
	AND p.name LIKE '%'
)
OR
(
		r.name = 'Suspended'
);


INSERT INTO test.user(email, username, password_hash, birthdate, created_on, modified_on) VALUES 
('mdegaris@gmail.com', 'elvin72', 'qq11ww22ee33!', '1972-08-18', now(), null),
('warrenn@gmail.com', 'warren', 'qq11ww22ee33!', '1980-01-19', now(), null),
('ellie@gmail.com', 'ellie', 'qq11ww22ee33!', '1988-11-05', now(), null),
('ruth@gmail.com', 'ruth', 'qq11ww22ee33!', '1971-04-21', now(), null),
('toby@gmail.com', 'toby', 'qq11ww22ee33!', '1990-07-30', now(), null);
        
INSERT INTO test.user_role(role_id, user_id)
SELECT 
    r.id, u.id
FROM
    test.role r,
    test.user u
WHERE
	u.email like '%'
and r.name = 'Active';
