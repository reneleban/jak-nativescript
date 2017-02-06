import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Rx";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import {Config} from "../config";
import {JakRequest} from "../json/jak.request";
import {Json} from "../json/json";

@Injectable()
export class BoardService {

    token: string;

    constructor(private json: Json) {
    }

    boards(token: string): Observable<any> {
        let request = new JakRequest(Config.boardApiUrl + "/" + token, "GET");
        console.log(request.toString());
        return this.json.send(request);
    }
    
    add(token: string, name: string): Observable<any> {
        let request = new JakRequest(Config.boardApiUrl + "/" + token, "POST" );
        request.addParam('name', name);
        return this.json.send(request);
    }

}