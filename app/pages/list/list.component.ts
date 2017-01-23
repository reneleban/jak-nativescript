import { Component, ElementRef, OnInit, ViewChild, ChangeDetectorRef} from "@angular/core";
import { RadSideDrawerComponent, SideDrawerType } from "nativescript-telerik-ui/sidedrawer/angular";  

@Component({
  selector: "list",
  templateUrl: "pages/list/list.html",
  styleUrls: ["pages/list/list-common.css", "pages/list/list.css"]
})

export class ListComponent {
    @ViewChild(RadSideDrawerComponent) 
    public drawerComponent: RadSideDrawerComponent;
    private drawer: SideDrawerType;

    public pages:Array<Object>;

    constructor (private _changeDetectionRef: ChangeDetectorRef) {
      this.pages = [
            {name:"Home"},
            {name:"About"},
            {name:"Contact"}
        ]; 
    }
    
    ngAfterViewInit() {
        this.drawer = this.drawerComponent.sideDrawer;
        this._changeDetectionRef.detectChanges();
    }

    public openDrawer() {
        this.drawer.toggleDrawerState();
    }
}
