import { Component } from "@angular/core";
import {Json} from "./shared/json/json";

@Component({
  selector: "main",
  template: "<page-router-outlet></page-router-outlet>",
  providers: [Json]
})

export class AppComponent {}
