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
export class BoardService {

    token: string;

    constructor(private json: Json) {
    }

    boards(token: string, func: (response: HttpResponse) => void) {
        let request = new JakRequest(Config.boardApiUrl + "/" + token, "GET");
        console.log(request.toString());
        this.json.send(request, func);
    }
}