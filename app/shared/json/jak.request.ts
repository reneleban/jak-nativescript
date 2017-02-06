export class JakRequest {

    private _url: string;
    private _method: string;
    private _params: {} = {};
    private _additionalHeaders: {} = {};
    private _contentType: string = "application/json";

    constructor(url: string, method: string) {
        this._url = url;
        this._method = method;
    }

    addParam(key: string, value: string) {
        this._params[key] = value;
    }

    addHeader(key: string, value: string) {
        this._additionalHeaders[key] = value;
    }

    get contentType(): string {
        return this._contentType;
    }

    set contentType(value: string) {
        this._contentType = value;
    }

    get method(): string {
        return this._method;
    }

    get params(): {} {
        return this._params;
    }

    get additionalHeaders(): {} {
      return this._additionalHeaders;
    }

    get url(): string {
        return this._url;
    }

    set url(value: string) {
        this._url = value;
    }

    toString(): string {
        return `${this._method} -> ${this._url}`;
        // return `${this._url} -> ${this._method} ? ${this.sfyParams} ... {${this.sfyAdditionalHeaders}}`;
    }

    get sfyParams(): string {
        return this.sfy(this._params);
    }

    get sfyAdditionalHeaders(): string {
        return this.sfy(this._additionalHeaders);
    }

    private sfy(object: {}): string {
        return JSON.stringify(object);
    }
}
