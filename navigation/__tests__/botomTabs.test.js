import React from "react";
import { configure, shallow } from "enzyme";

import Adapter from "@wojtekmaj/enzyme-adapter-react-17";

import { BottomTabNavigator } from "../index";

configure({ adapter: new Adapter() });

describe("Bottom navigation testing", () => {
    let wrapper;
    let Stack;
    beforeEach(() => {
        wrapper = shallow(<BottomTabNavigator />);
    });

    it("Should contain home", () => {
        expect(wrapper.find('Screen').at(0).props().options({ navigation: jest.fn() }).title).toEqual("Home");
        expect(wrapper.find('Screen').at(0).props().options({ navigation: jest.fn() }).tabBarIcon({ color: jest.fn() }).props.name).toEqual("home");
        expect(wrapper.find('Screen').at(0).props().name).toEqual("HomeTab");
    });

    it("Should contain search", () => { 
        expect(wrapper.find('Screen').at(1).props().options.title).toEqual("Search");
        expect(wrapper.find('Screen').at(1).props().options.tabBarIcon({ color: jest.fn() }).props.name).toEqual("search");
        expect(wrapper.find('Screen').at(1).props().name).toEqual("SearchTab");
    });
    
    it("Should contain Trip", () => {
        expect(wrapper.find('Screen').at(2).props().options.title).toEqual("Trip");
        expect(wrapper.find('Screen').at(2).props().options.tabBarIcon({ color: jest.fn() }).props.name).toEqual("plus");
        expect(wrapper.find('Screen').at(2).props().name).toEqual("TripTab");
    });

    it("Should contain Map", () => {
        expect(wrapper.find('Screen').at(3).props().options.title).toEqual("Map");
        expect(wrapper.find('Screen').at(3).props().options.tabBarIcon({ color: jest.fn() }).props.name).toEqual("map");
        expect(wrapper.find('Screen').at(3).props().name).toEqual("MapTab");
    });

    it("Should contain Profile", () => {
        expect(wrapper.find('Screen').at(4).props().options.title).toEqual("Profile");
        expect(wrapper.find('Screen').at(4).props().options.tabBarIcon({ color: jest.fn() }).props.name).toEqual("user");
        expect(wrapper.find('Screen').at(4).props().name).toEqual("ProfileTab");
    });
});
