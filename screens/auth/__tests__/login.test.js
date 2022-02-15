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
    let wrapper;

    beforeEach(() => {
        wrapper = mount(
            <Provider store={store}>
                <Login />
            </Provider>,
        );
    });

    it("Should contain login button", () => {
        expect(
            wrapper.find("Pressable").at(0).find("Text").at(0).text(),
        ).toEqual("Log In");
    });

    it("Should contain Register button", () => {
        expect(
            wrapper.find("Pressable").at(2).find("Text").at(0).text(),
        ).toEqual("Register");
    });

    it("Should contain email field", () => {
        expect(wrapper.find("TextInput").at(0).props().placeholder).toEqual(
            "Enter Email",
        );
    });

    it("Should contain password field", () => {
        expect(wrapper.find("TextInput").at(2).props().placeholder).toEqual(
            "Enter Password",
        );
    });
});
