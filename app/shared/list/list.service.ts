import {Injectable} from "@angular/core";
import {Response} from "@angular/http";
import {Observable} from "rxjs/Rx";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import {Config} from "../config";
import {JakRequest} from "../json/jak.request";
import {Json} from "../json/json";
import {HttpResponse} from "http";

@Injectable()
export class ListService {

    constructor(private json: Json) {
    }

    lists(token: string, boardId: string): Observable<any> {
        let request = new JakRequest(Config.listApiUrl + "/list/" + token + "/" + boardId, "GET");
        console.log(request.toString());
        return this.json.send(request);
    }
}