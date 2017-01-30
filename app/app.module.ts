import { NgModule } from "@angular/core";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NativeScriptHttpModule } from "nativescript-angular/http";
import { NativeScriptModule } from "nativescript-angular/platform";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { AppComponent } from "./app.component";
import { routes, navigatableComponents } from "./app.routing";

import drawerModule = require("nativescript-telerik-ui/sidedrawer");
import { SIDEDRAWER_DIRECTIVES } from "nativescript-telerik-ui/sidedrawer/angular";

import { IfAndroidDirective, IfIosDirective } from "./shared/ifplatformdirectives";

@NgModule({
  imports: [
    NativeScriptModule,
    NativeScriptHttpModule,
    NativeScriptFormsModule,
    NativeScriptRouterModule,
    NativeScriptRouterModule.forRoot(routes),

  ],
  declarations: [ 
    AppComponent,
    SIDEDRAWER_DIRECTIVES,
    IfAndroidDirective,
    IfIosDirective,
    ...navigatableComponents
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
