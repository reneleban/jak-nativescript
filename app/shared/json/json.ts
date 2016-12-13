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

        // TODO: Add additional headers
        Object.keys(request.additionalHeaders).forEach(function(k) {
            headers.append(k, request.additionalHeaders[k]);
        });

        let url = request.url;
        let parameterString = JSON.stringify(request.params);

        http.request({
            url: request.url,
            method: request.method,
            headers: request.additionalHeaders,
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
