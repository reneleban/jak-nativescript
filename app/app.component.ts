import { Component } from "@angular/core";
import {Json} from "./shared/json/json";

import * as elementRegistryModule from "nativescript-angular/element-registry";
elementRegistryModule.registerElement("Fab", () => require("nativescript-floatingactionbutton").Fab);

import { UserService } from "./shared/user/user.service";
import { BoardService } from "./shared/board/board.service";
import { ListService } from "./shared/list/list.service";
import { CardService } from "./shared/card/card.service";

@Component({
  selector: "main",
  template: "<page-router-outlet></page-router-outlet>",
  providers: [Json, UserService, BoardService, ListService, CardService]
})

export class AppComponent {}
