export class User {
  
  private _email : string;
  private _password : string;
  private _token : string;

  public get email() : string {
    return this._email;
  }
  public set email(v : string) {
    this._email = v;
  }
  
  public get password() : string {
    return this._password;
  }
  public set password(v : string) {
    this._password = v;
  }
  
  public get token() : string {
    return this._token;
  }
  public set token(v : string) {
    this._token = v;
  }
}