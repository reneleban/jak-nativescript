import {Injectable} from "@angular/core";
import {Response} from "@angular/http";
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

    user: User;

    constructor(private json: Json) {
    }

    base64 = require("base-64");

    register(user: User, func: (response: HttpResponse) => void) {
        this.user = user;

        let request = new JakRequest(Config.loginApiUrl, "POST");
        request.addParam('username', user.email);
        request.addParam('password', user.password);

        console.log(request.toString);

        this.json.send(request, func);  
    };

    login(user: User, func: (response: HttpResponse) => void) {
        this.user = user;
        let request = new JakRequest(Config.loginApiUrl, "GET");
        let b64encodedAuth = `${user.email}:${user.password}`;
        b64encodedAuth = this.base64.encode(b64encodedAuth);
        request.addHeader("Authorization", `Basic ${b64encodedAuth}`);
        console.log(request.toString());
        this.json.send(request, func);
    };

    validate(user: User, func: (response:HttpResponse) => void){
        this.user = user;
        let request = new JakRequest(Config.validateLoginApiUrl + "/" + this.getUserToken(), "GET");
        console.log(request.toString());
        this.json.send(request, func);
    }

    isUserLoggedIn(): Boolean {
        return this.user != null && this.user.token.length != 0;
    };

    getUserToken(): string {
        return this.isUserLoggedIn() ? this.user.token : null;
    };

    setUserToken(token: string) {
        this.user.token = token;
    };

    handleErrors(error: Response) {
        console.log(JSON.stringify(error.json()));
        return Observable.throw(error);
    };

    getUsername(): string {
        return this.user.email;
    }
}
