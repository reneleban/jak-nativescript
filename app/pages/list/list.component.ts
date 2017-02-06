import {
    Component, ViewChild, ChangeDetectorRef, OnInit, ChangeDetectionStrategy, AfterViewInit,
    ViewContainerRef
} from "@angular/core";
import {RadSideDrawerComponent, SideDrawerType} from "nativescript-telerik-ui/sidedrawer/angular";
import {BoardService} from "../../shared/board/board.service";
import {UserService} from "../../shared/user/user.service";
import {ListService} from "../../shared/list/list.service";
import {RouterExtensions} from "nativescript-angular";
import {NavigationExtras} from "@angular/router";
import * as dialogs from "ui/dialogs";
import {ModalDialogService, ModalDialogOptions} from "nativescript-angular/directives/dialogs";
import {DeleteDialog} from "../../shared/delete/DeleteDialog";

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
  changeDetection: ChangeDetectionStrategy.Default

})

export class ListComponent implements OnInit, AfterViewInit {
    @ViewChild(RadSideDrawerComponent) 
    public drawerComponent: RadSideDrawerComponent;
    private drawer: SideDrawerType;
    private userToken: string;

    private boardName: string;
    private boardId: string;

    public userLogoutIcon: string;

    public pages:Array<DataItem>;

    public items: Array<ListItem>;

    public tabSelectedIndex: number;

    constructor (private _changeDetectionRef: ChangeDetectorRef,
                 private userService: UserService,
                 private boardService: BoardService, 
                 private listService: ListService,
                 private router: RouterExtensions,
                 private modalService: ModalDialogService,
                 private viewContainerRef: ViewContainerRef
                 ) {
        this.pages = [];
        this.tabSelectedIndex = 0;
        var charCode = 0xe903;
        this.userLogoutIcon = charCode.toString(16);

        this.items = [];
    }

    ngOnInit() {
        this.userToken = this.userService.getUserToken();
        this.loadBoards(true);
    }

    loadBoards(openFirst: boolean = false) {
        if (this.userToken != null) {
            this.pages = [];
            this.boardService.boards(this.userToken).subscribe(response => {
                for (var i = 0; i < response.length; i++) {
                    var element = response[i];
                    var item = new DataItem(element["board_id"], element["name"]);
                    this.pages.push(item);
                }

                if (openFirst && this.pages.length > 0) {
                    var firstBoard = this.pages[0];
                    this.openBoard(firstBoard);
                } else {
                    this.boardName = "No boards available";
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
        this.boardName = item.name;
        this.boardId = item.id;

        if (this.userToken != null) {
            this.items = [];
            this.listService.lists(this.userToken, item.id).subscribe(response => {
                for (var i = 0; i < response.length; i++) {
                    var data = response[i];
                    var item = new ListItem(data["owner"], data["board_id"], data["list_id"], data["name"]);
                    this.items.push(item);
                }
                this.drawer.closeDrawer();
            });
        }
    }

    public addBoard(){
        let options  = {
            title: "Neues Board",
            defaultText: "Bezeichnung", 
            inputType: dialogs.inputType.text,
            okButtonText: "Erstellen",
            cancelButtonText: "Abbrechen"
        }

        dialogs.prompt(options).then((result: dialogs.PromptResult) => {
            if(result.text.trim().length > 0){
                this.boardService.add(this.userToken, result.text).subscribe(response => {
                    var item = new DataItem(response["board_id"], response["name"]);
                    this.pages.push(item);
                });

            }
        });

    }

    public onListItemTap(listItem: ListItem) {
        let navigationExtras: NavigationExtras = {
            queryParams: {
                "selectedListId": listItem.id,
                "selectedListName": listItem.name
            }
        };

        this.router.navigate(["/card"], navigationExtras);
    }

    public addList() {
        let options  = {
            title: "Neue Liste",
            defaultText: "Bezeichnung",
            inputType: dialogs.inputType.text,
            okButtonText: "Erstellen",
            cancelButtonText: "Abbrechen"
        }

        dialogs.prompt(options).then((result: dialogs.PromptResult) => {
            if(result.text.trim().length > 0){
                this.listService.add(this.userToken, this.boardId, result.text).subscribe(response => {
                    var item = new ListItem(response["owner"], response["board_id"], response["list_id"], response["name"]);
                    this.items.push(item);
                });

            }
        });
    }

    public deleteBoard() {
        let options: ModalDialogOptions = {
            viewContainerRef: this.viewContainerRef,
            context: {
                boardId: this.boardId,
                userToken: this.userToken
            },
            fullscreen: true
        };

        this.modalService.showModal(DeleteDialog, options).then((dialogResult: string) => {
            if (dialogResult === "ok") {
                this.loadBoards();
            }
        });
    }
}
