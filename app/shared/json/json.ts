import {Injectable} from "@angular/core";
import {Headers, Http, RequestOptionsArgs, RequestOptions, Request, Response} from "@angular/http";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import {JakRequest} from "./jak.request";
import {Observable} from "rxjs";
import {URLSearchParams} from '@angular/http';

@Injectable()
export class Json {

    constructor(private http: Http) {}

    public send(request: JakRequest): Observable<any> {
        let headers = new Headers();
        headers.append("Content-Type", `${request.contentType}`);

        // TODO: Add additional headers
        Object.keys(request.additionalHeaders).forEach(function(k) {
            headers.append(k, request.additionalHeaders[k]);
        });

        let basicOptions: RequestOptionsArgs = {
          url: request.url,
          method: request.method,
          headers: new Headers(request.additionalHeaders)
        };


        if (Object.keys(request.params).length > 0) {
            let body = new URLSearchParams();
            Object.keys(request.params).forEach(key => {
                body.set(key, request.params[key]);
            });
            basicOptions["body"] = body.toString(); // JSON.stringify(request.params);
        }

        let reqOptions = new RequestOptions(basicOptions);
        let req = new Request(reqOptions);

        return this.http.request(req)
            .map((res:Response) => res.json())
            .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }
}
