import {Injectable} from "@angular/core";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import {Config} from "../config";
import {JakRequest} from "../json/jak.request";
import {Json} from "../json/json";
import {Observable} from "rxjs";

@Injectable()
export class CardService {

    constructor(private json: Json) {
    }

    cards(token: string, listId: string): Observable<any> {
        let request = new JakRequest(Config.cardApiUrl + "/" + token + "/" + listId, "GET");
        console.log(request.toString());
        return this.json.send(request);
    }
}