

const sqlStatements = {
    PW_FROM_EMAIL: 'SELECT password_hash FROM user WHERE email = ?',
    REGISTER_NEW_USER: 'INSERT INTO user(email, password_hash) VALUES (?, ?)',
    CHANGE_PASSWORD: 'UPDATE user SET password_hash = ? WHERE user_id = ?'
};


export {sqlStatements};