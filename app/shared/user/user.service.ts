import {Injectable} from "@angular/core";
import {Http, Headers, Response} from "@angular/http";
import {Observable} from "rxjs/Rx";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import {User} from "./user";
import {Config} from "../config";
import {JakRequest} from "../json/jak.request";
import {Json} from "../json/json";
import {HttpResponse} from "http";

@Injectable()
export class UserService {

    constructor(private json: Json) {
    }

    register(user: User) {
    }

    login(user: User) {
        let request = new JakRequest(Config.apiUrl, "GET");
        let b64encodedAuth = `${user.email}:${user.password}`;
        request.addHeader("Authorization", `Basic ${b64encodedAuth}`);
        this.json.send(request, this.callback);
    }

    public callback = function(response: HttpResponse) {
        alert("Got it: " + response.content.toString());
    };

    handleErrors(error: Response) {
        console.log(JSON.stringify(error.json()));
        return Observable.throw(error);
    }
}
