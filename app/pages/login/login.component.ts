import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { User } from "../../shared/user/user";
import { UserService } from "../../shared/user/user.service";
//import { Router, NavigationExtras } from "@angular/router";
import {RouterExtensions} from "nativescript-angular/router";
import { Page } from "ui/page";
import { Color } from "color";
import { View } from "ui/core/view";
import {HttpResponse} from "http";
import application = require("application");
import * as appSettings from "application-settings";

@Component({
  selector: "my-app",
  providers: [UserService],
  templateUrl: "pages/login/login.html",
  styleUrls: ["pages/login/login-common.css", "pages/login/login.css"]
})

export class LoginComponent implements OnInit, AfterViewInit {
  
  user: User;
  isLoggingIn = true;
  @ViewChild("container") container: ElementRef;

  constructor(private router: RouterExtensions, private userService: UserService, private page: Page) {
    this.user = new User();
  }

  ngOnInit() {
    this.page.actionBarHidden = true;
    this.page.backgroundImage = "res://bg_login";
  }

  ngAfterViewInit() {
    /** todo: display loading screen? */
    let prevToken = appSettings.getString("userToken", null);
    if(prevToken != null){
      console.log("using previous token: " + prevToken);
      this.user.token = prevToken;
      this.userService.user = this.user;
      this.userService.validate(this.user, this.validateCallBack);
    }
  }

  validateCallBack = (response: HttpResponse) => {
    if(response.statusCode == 200){
      let username = response.content.toJSON()["username"];
      this.user.email = username;
      if (this.userService.isUserLoggedIn()) {
          this.userService.user = this.user;
          this.router.navigate(["/list"], { clearHistory: true });
      }
    } else {
      this.user = new User();
      appSettings.remove("userToken");
    }
  }

  submit() {
    if (this.isLoggingIn) {
      this.login();
    } else {
      this.signUp();
    }
  }

  login() {
    this.userService.login(this.user, this.loginCallback);
  }

  loginCallback = (response: HttpResponse) => {
    let token = response.content.toJSON()["token"];
    this.userService.setUserToken(token);

    if (this.userService.isUserLoggedIn()) {
      console.log("user token: " + this.userService.getUserToken());
      appSettings.setString("userToken", this.userService.getUserToken());
      console.log("Appsettings-Token", appSettings.getString("userToken"));
      this.router.navigate(["/list"], { clearHistory: true });
    }
  };

  signUp() {
    this.userService.register(this.user, this.loginCallback);
  }

  toggleDisplay() {
    this.isLoggingIn = !this.isLoggingIn;

    let container = <View>this.container.nativeElement;
    container.animate({
      backgroundColor: this.isLoggingIn ? new Color("white") : new Color("lightgray"),
      duration: 200
    });
  }
}
