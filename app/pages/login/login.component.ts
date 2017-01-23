import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { User } from "../../shared/user/user";
import { UserService } from "../../shared/user/user.service";
//import { Router, NavigationExtras } from "@angular/router";
import {RouterExtensions} from "nativescript-angular/router";
import { Page } from "ui/page";
import { Color } from "color";
import { View } from "ui/core/view";
import {HttpResponse} from "http";
import application = require("application");

@Component({
  selector: "my-app",
  providers: [UserService],
  templateUrl: "pages/login/login.html",
  styleUrls: ["pages/login/login-common.css", "pages/login/login.css"]
})

export class LoginComponent implements OnInit {
  
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
