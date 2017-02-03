import {Component, OnInit, ChangeDetectionStrategy} from "@angular/core";
import {HttpResponse} from "http";
import {Observable as RxObservable} from "rxjs/Observable";
import {UserService} from "../../shared/user/user.service";
import {CardService} from "../../shared/card/card.service";
import {ActivatedRoute} from "@angular/router";

class CardItem {
    constructor(
        public owner: string,
        public list_id: string,
        public id: string,
        public title: string
    ) {
    }
}

@Component({
  selector: "card",
  templateUrl: "pages/card/card.html",
  styleUrls: ["pages/card/card-common.css", "pages/card/card.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CardComponent implements OnInit {
    private userToken: string;
    public cardItems: RxObservable<Array<CardItem>>;
    public subscr: any;
    public items: Array<CardItem>;

    private listId: string;

    constructor (private userService: UserService,
                 private cardService: CardService,
                 private route: ActivatedRoute) {

        this.route.queryParams.subscribe(params => {
           this.listId = params["selectedListId"];
        });

        this.items = [];
        
        this.cardItems = RxObservable.create(subscriber => {
            this.subscr = subscriber;
            subscriber.next(this.items);
            return function () {
                console.log("Unsubscribe called!");
            };
        });
    }

    ngOnInit() {
        this.userToken = this.userService.getUserToken();
        this.loadCards();
    }

    public loadCards(){
        if (this.userToken != null) {
            this.items = [];
            this.subscr.next(this.items);
            this.cardService.cards(this.userToken, this.listId, this.cardCallback);
        }
    }

    cardCallback = (response: HttpResponse) => {
        let content = response.content.toJSON();
        for (var i = 0; i < content.length; i++) {
            var data = content[i];
            console.dir(data);
            // var item = new ListItem(data["owner"], data["board_id"], data["list_id"], data["name"]);
            // this.items.push(item);
            // this.subscr.next(this.items);
        }
    };

    public onListItemTap(cardItem: CardItem) {
        // console.dir(listItem);
    }
}
