import {Component, OnInit, ChangeDetectionStrategy, AfterViewInit, ChangeDetectorRef, ViewChild} from "@angular/core";
import {UserService} from "../../shared/user/user.service";
import {CardService} from "../../shared/card/card.service";
import {ActivatedRoute} from "@angular/router";
import * as elementRegistryModule from "nativescript-angular/element-registry";
import {Button} from "ui/button";
import * as dialogs from "ui/dialogs";
import {SwipeGestureEventData} from "ui/gestures";
elementRegistryModule.registerElement("CardView", () => require("nativescript-cardview").CardView);

class CardItem {
    constructor(
        public owner: string,
        public list_id: string,
        public id: string,
        public name: string,
        public description: string
    ) {
    }
}

@Component({
  selector: "card",
  templateUrl: "pages/card/card.html",
  styleUrls: ["pages/card/card-common.css", "pages/card/card.css"],
  changeDetection: ChangeDetectionStrategy.Default
})

export class CardComponent implements OnInit, AfterViewInit {
    private userToken: string;
    public items: Array<CardItem>;

    private listId: string;
    private listName: string;

    @ViewChild("fab")
    private fab:Button;

    constructor (private _changeDetectionRef: ChangeDetectorRef,
                 private userService: UserService,
                 private cardService: CardService,
                 private route: ActivatedRoute) {

        this.items = [];

        this.route.queryParams.subscribe(params => {
            this.listId = params["selectedListId"];
            this.listName = params["selectedListName"];
        });
    }


    ngOnInit() {
        this.userToken = this.userService.getUserToken();
    }

    ngAfterViewInit() {
        this._changeDetectionRef.detectChanges();

        if (this.userToken != null) {
            this.items = [];
            this.cardService.cards(this.userToken, this.listId).subscribe(response => {
                for (var i = 0; i < response.length; i++) {
                    var data = response[i];
                    var item = new CardItem(data["owner"], data["list_id"], data["card_id"], data["name"], data["description"]);
                    this.items.push(item);
                }
            });
        }
    }

    public addCard() {
        let options  = {
            title: "Neue Karte",
            defaultText: "Bezeichnung",
            inputType: dialogs.inputType.text,
            okButtonText: "Erstellen",
            cancelButtonText: "Abbrechen"
        }

        dialogs.prompt(options).then((result: dialogs.PromptResult) => {
            if(result.text.trim().length > 0){
                this.cardService.add(this.userToken, result.text, this.listId).subscribe(response => {
                    var item = new CardItem(response["owner"], response["list_id"], response["card_id"], response["name"], response["description"]);
                    this.items.push(item);
                });
            }
        });
    }

    swipe(cardItem: CardItem, args: SwipeGestureEventData) {
        if (args.direction > 2) return;
        var value = 400;
        if(args.direction==2) value *= -1;
        args.view.animate({translate : {x:value, y: 0}, duration: 300}).then(value => {
            this.items.splice(this.items.indexOf(cardItem), 1);
        }).then(value => {
            this.cardService.delete(this.userToken, cardItem.id).subscribe(response => {
                console.log("deleted card");
            });
        });
    }

    public onListItemTap(cardItem: CardItem) {
        // console.dir(listItem);
    }
}
