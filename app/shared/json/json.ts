import {Injectable} from "@angular/core";
import {Headers} from "@angular/http";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import {JakRequest} from "./jak.request";
import * as http from "http"
import {HttpResponse} from "http";

@Injectable()
export class Json {

    public send(request: JakRequest, callback: (response: HttpResponse) => any) {
        let headers = new Headers();
        headers.append("Content-Type", `${request.contentType}`);

        let url = request.url;
        let parameterString = JSON.stringify(request.params);

        http.request({
            url: request.url,
            method: request.method,
            headers: headers,
            content: parameterString
        }).then(function successCallback(response) {
            console.log("Success -> " + response);
            callback(response);
        }, function errorCallback(response) {
            console.log("An error occured:");
            console.log(response);
            callback(response);
        });
    }
}