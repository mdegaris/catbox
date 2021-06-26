import { expect } from 'chai';
import { hashPassword, hashCompare } from "../../../lib/auth/password";


const  TEST_PASSWORDS : Record<string, string> =
                {
                    TEST_PW1: 'password1234',
                    TEST_PW2: 'password4321',
                    TEST_PW4: 'nd{u{R:D6W|<(DI#',
                    TEST_PW3: '3f0LTH8o',
                    TEST_PW5: 'l4QwbAu8ShCMYiOc'
                };


describe('password', () => {

    describe('hashPassword', () => {
        it('Must return a string.', async () => {
            for (let key in TEST_PASSWORDS) {
                let pw: string = TEST_PASSWORDS[key];
                let hash = await hashPassword(pw);
                expect(hash).to.be.a('string');
            }
        })
    });

    describe('hashPassword', () => {
        it('Hash is 96 bytes in length.', async () => {
            for (let key in TEST_PASSWORDS) {
                let pw: string = TEST_PASSWORDS[key];
                let hash = await hashPassword(pw);
                expect(hash).to.have.lengthOf(96);
            }
        })
    });

    describe('hashCompare', () => {
        it('Hashes must match with identical plain passwords.', async () => {
            for (let key in TEST_PASSWORDS) {
                let pw: string = TEST_PASSWORDS[key];
                let hash = await hashPassword(pw);
                let pass = await hashCompare(pw, hash);
                expect(pass).to.equal(true);
            }
        })
    });

    describe('hashCompare', () => {
        it('Hashes must NOT match with different plain passwords.', async () => {
            let hash = await hashPassword(TEST_PASSWORDS.TEST_PW1);
            let pass = await hashCompare(TEST_PASSWORDS.TEST_PW2, hash);
            expect(pass).to.equal(false);
        })
    });
});
