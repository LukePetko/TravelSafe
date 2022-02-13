/**
 * @jest-environment jsdom
 */
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import { Login } from "../Login";

const mockStore = configureStore();
const initialState = {};
const store = mockStore(initialState);

describe("Login screen tests", () => {
    it("Should contain login button", () => {
        const wrapper = mount(
            <Provider store={store}>
                <Login />
            </Provider>,
        );
        expect(
            wrapper.find("Pressable").at(0).find("Text").at(0).text(),
        ).toEqual("Log In");
        expect(
            wrapper.find("Pressable").at(1).find("Text").at(0).text(),
        ).toEqual("Register");
    });
});
