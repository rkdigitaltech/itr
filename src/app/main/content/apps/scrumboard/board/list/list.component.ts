import { Component, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FuseUtils } from '../../../../../../core/fuseUtils';
import { ScrumboardService } from 'app/main/content/apps/scrumboard/scrumboard.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { MdDialog, MdDialogRef } from '@angular/material';
import { FuseScrumboardCardDialogComponent } from '../dialogs/card/card.component';
import { FuseConfirmDialogComponent } from '../../../../../../core/components/confirm-dialog/confirm-dialog.component';
import { Card } from '../../card.model';

@Component({
    selector     : 'fuse-scrumboard-board-list',
    templateUrl  : './list.component.html',
    styleUrls    : ['./list.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FuseScrumboardBoardListComponent implements OnInit, OnDestroy
{
    board: any;
    dialogRef: any;

    @Input() list;
    @ViewChild(PerfectScrollbarDirective) listScroll: PerfectScrollbarDirective;

    onBoardChanged: Subscription;

    confirmDialogRef: MdDialogRef<FuseConfirmDialogComponent>;

    constructor(
        private route: ActivatedRoute,
        private scrumboardService: ScrumboardService,
        public dialog: MdDialog
    )
    {
    }

    ngOnInit()
    {
        this.onBoardChanged =
            this.scrumboardService.onBoardChanged
                .subscribe(board => {
                    this.board = board;
                });

    }

    onListNameChanged(newListName)
    {
        this.list.name = newListName;
    }

    onCardAdd(newCardName)
    {
        if ( newCardName === '' )
        {
            return;
        }

        this.scrumboardService.addCard(this.list.id, new Card({name: newCardName}));

        setTimeout(() => {
            this.listScroll.scrollToBottom(0, 400);
        });

    }

    removeList(listId)
    {
        this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete the list and it\'s all cards?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if ( result )
            {
                this.scrumboardService.removeList(listId);
            }
        });
    }

    openCardDialog(cardId)
    {
        this.dialogRef = this.dialog.open(FuseScrumboardCardDialogComponent, {
            panelClass: 'scrumboard-card-dialog',
            data      : {
                cardId: cardId,
                listId: this.list.id
            }
        });
        this.dialogRef.afterClosed()
            .subscribe(response => {

            });
    }

    onDrop(ev)
    {
        this.scrumboardService.updateBoard();
    }

    ngOnDestroy()
    {
        this.onBoardChanged.unsubscribe();
    }
}
