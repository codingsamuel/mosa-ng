﻿import { ChangeDetectionStrategy, Component, OnInit, Optional } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { PromiseReject, PromiseResolve } from '@mosa-ng/core';
import { Observable } from 'rxjs';
import { ConfirmDialogData, ConfirmDialogResult } from '../../models/confirm-dialog.model';
import { TableItem } from '../../models/table-item.model';
import { ConfirmDialog } from '../confirm-dialog/confirm.dialog';

@Component({
    selector: 'mosa-cell-editor-base',
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
export class CellEditorBaseComponent<Model> implements OnInit, CanDeactivate<CellEditorBaseComponent<Model>> {

    public dataSource: MatTableDataSource<TableItem<Model>>;
    public displayedColumns: (keyof Model | string)[] = [];

    constructor(
        @Optional()
        protected readonly myMatDialog: MatDialog,
    ) {
    }

    public ngOnInit(): void {
        this.dataSource = new MatTableDataSource<TableItem<Model>>();
    }

    public get changedRows(): TableItem<Model>[] {
        return this.dataSource?.data?.filter((c: TableItem<Model>): boolean => c.changedRowKeys?.length > 0);
    }

    /**
     * Remove table item data
     * @param data
     */
    public serializeData(data: TableItem<Model>[]): Model[] {
        return data.map((val: TableItem<Model>): Model => {
            delete val.changedRowKeys;
            delete val.rowOriginalData;
            return val;
        });
    }

    public toTableItems(data: Model[]): TableItem<Model>[] {
        return data.map((val: Model): TableItem<Model> => ({
            ...val,
            rowOriginalData: val,
            changedRowKeys: [],
        }));
    }

    public canDeactivate(_component: CellEditorBaseComponent<Model>, _currentRoute: ActivatedRouteSnapshot, _currentState: RouterStateSnapshot,
                         _nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        if (!this.changedRows.length) {
            return true;
        }

        return new Promise((resolve: PromiseResolve<boolean>, _reject: PromiseReject): void => {
            this.myMatDialog
                .open(ConfirmDialog, {
                    width: '600px',
                    data: new ConfirmDialogData('mosa.components.cellEditorBase.discardChanges.label',
                        'mosa.components.cellEditorBase.discardChanges.message'),
                })
                .afterClosed()
                .subscribe((result: ConfirmDialogResult): void => {
                    if (result === ConfirmDialogResult.confirmed) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                });
        });
    }

}
