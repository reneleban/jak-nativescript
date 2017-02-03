import {Injectable} from "@angular/core";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import {Config} from "../config";
import {JakRequest} from "../json/jak.request";
import {Json} from "../json/json";
import {HttpResponse} from "http";

@Injectable()
export class CardService {

    constructor(private json: Json) {
    }

    cards(token: string, listId: string, func: (response: HttpResponse) => void) {
        let request = new JakRequest(Config.cardApiUrl + "/" + token + "/" + listId, "GET");
        console.log(request.toString());
        this.json.send(request, func);
    }
}