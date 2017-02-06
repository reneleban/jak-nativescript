import {Component, OnInit, ChangeDetectionStrategy, AfterViewInit, ChangeDetectorRef} from "@angular/core";
import {UserService} from "../../shared/user/user.service";
import {CardService} from "../../shared/card/card.service";
import {ActivatedRoute} from "@angular/router";
import * as elementRegistryModule from "nativescript-angular/element-registry";
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

    constructor (private _changeDetectionRef: ChangeDetectorRef,
                 private userService: UserService,
                 private cardService: CardService,
                 private route: ActivatedRoute) {

        this.items = [];

        this.route.queryParams.subscribe(params => {
            this.listId = params["selectedListId"];
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
                    console.dir(data);
                    var item = new CardItem(data["owner"], data["list_id"], data["card_id"], data["name"], data["description"]);
                    this.items.push(item);
                }
            });
        }
    }

    public onListItemTap(cardItem: CardItem) {
        // console.dir(listItem);
    }
}
