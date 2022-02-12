import reducer, { login, logout } from "../stores/user";

describe("User store tests", () => {
    it("Should contain null on initial state", () => {
        expect(reducer(undefined, {})).toEqual({
            user: null,
        });
    });

    it("Should contain stored number after login", () => {
        expect(reducer(undefined, login(123))).toEqual({
            user: {
                payload: 123,
                type: "user/login",
            },
        });
    });

    it("Should contain null after logout", () => {
        reducer(undefined, login(123));
        expect(reducer(undefined, logout())).toEqual({
            user: null,
        });
    });
});
