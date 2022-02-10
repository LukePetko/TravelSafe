import reducer, { login } from '../stores/user';

describe('User store tests', () => {
    it('Should contain null on initial state', () => {
        expect(reducer(undefined, {})).toEqual({
            user: null,
        });
    });

    it('Should contain stored number after login', () => {
        expect(reducer(undefined, login(123))).toEqual({
            user: 123,
        });
    });

    it('Should contain null after logout', () => {
        reducer(undefined, login(123));
        expect(reducer(undefined, login(null))).toEqual({
            user: null,
        });
    });
});
