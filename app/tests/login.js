var reflect = require("reflect-metadata")
var component = require("../pages/login/login.component")

describe("Test for app/pages/login/login.component.ts", function(){
    var loginComponent;
    beforeEach(function(){
        loginComponent = component.LoginComponent;
    });

    it("loginComponent should exist", function(){
        loginComponent = component.LoginComponent();
        expect(loginComponent).not.toBe(null)
    });

    it("user should exist", function(){
        expect(loginComponent.user).not.toBe(null)
    });
});