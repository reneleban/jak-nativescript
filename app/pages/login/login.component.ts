import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { User } from "../../shared/user/user";
import { UserService } from "../../shared/user/user.service";
import { Router } from "@angular/router";
import { Page } from "ui/page";
import { Color } from "color";
import { View } from "ui/core/view";

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

  constructor(private router: Router, private userService: UserService, private page: Page) {
    this.user = new User();
    //this.user.email = "testtest@test.test";
    //this.user.password = "test123";
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
    this.userService.login(this.user);
  }

  signUp() {
    this.userService.register(this.user);
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
