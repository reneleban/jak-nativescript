import { Component, ElementRef, ViewChild, ChangeDetectorRef, OnInit, Input, ChangeDetectionStrategy} from "@angular/core";
import { RadSideDrawerComponent, SideDrawerType } from "nativescript-telerik-ui/sidedrawer/angular";  
import {HttpResponse} from "http";

import { BoardService } from "../../shared/board/board.service";
import { UserService } from "../../shared/user/user.service";

class DataItem {
    constructor(public id: string, public name: string) { }
}

@Component({
  selector: "list",
  templateUrl: "pages/list/list.html",
  styleUrls: ["pages/list/list-common.css", "pages/list/list.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ListComponent implements OnInit {
    @ViewChild(RadSideDrawerComponent) 
    public drawerComponent: RadSideDrawerComponent;
    private drawer: SideDrawerType;
    private userToken: string;

    public pages:Array<DataItem>;

    constructor (private _changeDetectionRef: ChangeDetectorRef,
                 private userService: UserService,
                 private boardService: BoardService) {
                     this.pages = [];
                     this.pages.push(new DataItem("testid", "testname"));
    }

    ngOnInit() {
        this.userToken = this.userService.getUserToken();

        if (this.userToken != null) {
            this.boardService.boards(this.userToken, this.listCallback);
        }
    }

    listCallback = (response: HttpResponse) => {
        let content = response.content.toJSON();
        for (var i = 0; i < content.length; i++) {
            var data = content[i];
            var item = new DataItem(data["id"], data["name"]);
            this.pages.push(item);
        }
    }

    ngAfterViewInit() {
        this.drawer = this.drawerComponent.sideDrawer;
        this._changeDetectionRef.detectChanges();
    }

    public openDrawer() {
        this.drawer.toggleDrawerState();
    }
}
