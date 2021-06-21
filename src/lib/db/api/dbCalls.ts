import { sqlStatements } from '../sql/statements';
import { Registration } from '../../register/registration';
import { transaction } from '../connect/db';



function registerNewUser(reg: Registration): Promise<Array<any>> {

    const bindVars = [reg.getEmail(), reg.getHashedPassword()];
    const newUserTrans = transaction(sqlStatements.REGISTER_NEW_USER, bindVars);

    return new Promise<Array<any>>((resolve, reject) => {
        // newUserTrans.then((r) => { resolve() })
        //     .catch((e) => { console.log(e.stack) });
        resolve(newUserTrans);
    });
}


export { registerNewUser };