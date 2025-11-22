import { ChangeDetectionStrategy, Component, OnInit, Optional } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot } from '@angular/router';
import { ConfirmDialogData, ConfirmDialogResult } from '../../models/confirm-dialog.model';
import { TableItem } from '../../models/table-item.model';
import { ConfirmDialog } from '../confirm-dialog/confirm.dialog';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'mosa-cell-editor-base',
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CellEditorBaseComponent<Model> implements OnInit, CanDeactivate<CellEditorBaseComponent<Model>> {

    public dataSource: MatTableDataSource<TableItem<Model>> = new MatTableDataSource<TableItem<Model>>();
    public displayedColumns: (keyof Model | string)[] = [];

    constructor(
        @Optional()
        protected readonly myMatDialog: MatDialog,
    ) {
    }

    public ngOnInit(): void {
        //
    }

    public get changedRows(): TableItem<Model>[] {
        return this.dataSource?.data?.filter((c: TableItem<Model>): boolean => !!c.changedRowKeys && c.changedRowKeys?.length > 0);
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

    public async canDeactivate(_component: CellEditorBaseComponent<Model>,
                               _currentRoute: ActivatedRouteSnapshot,
                               _currentState: RouterStateSnapshot,
                               _nextState?: RouterStateSnapshot): Promise<boolean> {
        if (!this.changedRows.length) {
            return true;
        }

        const result: ConfirmDialogResult = await firstValueFrom(
            this.myMatDialog
                .open(ConfirmDialog, {
                    width: '600px',
                    data: new ConfirmDialogData('mosa.components.cellEditorBase.discardChanges.label',
                        'mosa.components.cellEditorBase.discardChanges.message'),
                })
                .afterClosed(),
        );

        return result === ConfirmDialogResult.confirmed;
    }

}
