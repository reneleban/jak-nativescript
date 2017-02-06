import {Component} from "@angular/core";
import {ModalDialogParams} from "nativescript-angular/directives/dialogs";
import {CardService} from "../card/card.service";
import {BoardService} from "../board/board.service";
import {ListService} from "../list/list.service";
import {Observable, Subscription} from "rxjs";

@Component({
    selector: "modal-content",
    template: `
<StackLayout>
    <Label text="{{ deleteMessage }}"></Label>
    
    <Button text="ok" (tap)="close('ok')"></Button>
    <Button text="cancel" (tap)="close('cancel')"></Button>
</StackLayout>
    `
})

export class DeleteDialog {
    private userToken: string;

    private listId: string = null;
    private boardId: string = null;

    private deleteMessage: string = "";

    constructor(private params: ModalDialogParams,
                private cardService: CardService,
                private listService: ListService,
                private boardService: BoardService) {
        this.userToken = params.context.userToken;

        if (params.context.boardId != null) {
            this.boardId = params.context.boardId;
            this.deleteMessage = "Do you really want to delete a complete board?";
        } else if (params.context.listId != null) {
            this.listId = params.context.listId;
            this.deleteMessage = "Do you really want to delete a complete list?";
        }
    }

    public deleteBoard(boardId: string): Observable<any> {
        return this.boardService.delete(this.userToken, boardId);
    }

    public deleteList(listId: string): Observable<any> {
        return this.listService.delete(this.userToken, listId);
    }

    public deleteCards(listId: string): Observable<any> {
        return this.cardService.deleteAll(this.userToken, listId);
    }

    // TODO: Call method 'closeCallback' only once!
    public close(result: string) {
        if (result === "ok") {
            if (this.boardId != null) {
                // DELETE WHOLE BOARD
                this.listService.lists(this.userToken, this.boardId).subscribe(res => {

                    for (var i = 0; i < 0; i++) {
                        for (var i = 0; i < res.length; i++) {
                            let listId = res["list_id"];

                            this.deleteCards(listId).subscribe(res => {
                                this.params.closeCallback(result);
                            }, err => {
                                this.deleteList(listId).subscribe(res => {
                                    this.params.closeCallback(result);
                                }, err => {
                                    this.params.closeCallback(result);
                                });
                            });
                        }

                        this.deleteBoard(this.boardId).subscribe(res => {
                            this.params.closeCallback(result);
                        }, err => {
                            this.params.closeCallback(result);
                        });
                    }

                });
            } else if (this.listId != null) {
                // DELETE WHOLE LIST

                this.deleteCards(this.listId).subscribe(res => {
                    this.params.closeCallback(result);
                }, err => {
                    this.deleteList(this.listId).subscribe(res => {
                        this.params.closeCallback(result);
                    }, err => {
                        this.params.closeCallback(result);
                    });
                });
            }
        } else {
            this.params.closeCallback(result);
        }
    }
}