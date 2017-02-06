import {
    Component, ElementRef, ViewChild, ChangeDetectorRef, OnInit, Input, ChangeDetectionStrategy,
    AfterViewInit
} from "@angular/core";
import { RadSideDrawerComponent, SideDrawerType } from "nativescript-telerik-ui/sidedrawer/angular";  
import {HttpResponse} from "http";
import { Observable as RxObservable } from "rxjs/Observable";

import { BoardService } from "../../shared/board/board.service";
import { UserService } from "../../shared/user/user.service";
import { ListService } from "../../shared/list/list.service";
import {RouterExtensions} from "nativescript-angular";
import {NavigationExtras} from "@angular/router";

class DataItem {
    constructor(public id: string, public name: string) { }
}

class ListItem {
    constructor(
        public owner: string, 
        public board_id: string, 
        public id: string, 
        public name: string
        ) { 

        }
}

@Component({
  selector: "list",
  templateUrl: "pages/list/list.html",
  styleUrls: ["pages/list/list-common.css", "pages/list/list.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ListComponent implements OnInit, AfterViewInit {
    @ViewChild(RadSideDrawerComponent) 
    public drawerComponent: RadSideDrawerComponent;
    private drawer: SideDrawerType;
    private userToken: string;

    public userLogoutIcon: string;

    public pages:Array<DataItem>;

    public listItems: RxObservable<Array<ListItem>>;
    public subscr: any;
    public items: Array<ListItem>;

    public tabSelectedIndex: number;

    constructor (private _changeDetectionRef: ChangeDetectorRef,
                 private userService: UserService,
                 private boardService: BoardService, 
                 private listService: ListService,
                 private router: RouterExtensions
                 ) {
        this.pages = [];
        this.tabSelectedIndex = 0;
        var charCode = 0xe903;
        this.userLogoutIcon = charCode.toString(16);

        this.items = [];

        this.listItems = RxObservable.create(subscriber => {
            this.subscr = subscriber;
            subscriber.next(this.items);
            return function () {
                console.log("Unsubscribe called!");
            };
        });
    }

    ngOnInit() {
        this.userToken = this.userService.getUserToken();

        if (this.userToken != null) {
            this.boardService.boards(this.userToken).subscribe(response => {
                for (var i = 0; i < response.length; i++) {
                    var element = response[i];
                    var item = new DataItem(element["board_id"], element["name"]);
                    this.pages.push(item);
                }
            });
        }
    }

    ngAfterViewInit() {
        this.drawer = this.drawerComponent.sideDrawer;
        this._changeDetectionRef.detectChanges();
    }

    public toggleDrawer() {
        this.drawer.toggleDrawerState();
    }

    public openBoard(item: DataItem){
        console.dir(item);
        if (this.userToken != null) {
            this.items = [];
            // this.subscr.next(this.items);
            this.listService.lists(this.userToken, item.id).subscribe(response => {
                for (var i = 0; i < response.length; i++) {
                    var data = response[i];
                    var item = new ListItem(data["owner"], data["board_id"], data["list_id"], data["name"]);
                    this.items.push(item);
                    this.subscr.next(this.items);
                }
                this.drawer.closeDrawer();
            });
        }
    }

    public onListItemTap(listItem: ListItem) {
        let navigationExtras: NavigationExtras = {
            queryParams: {
                "selectedListId": listItem.id
            }
        };

        this.router.navigate(["/card"], navigationExtras);
    }
}
