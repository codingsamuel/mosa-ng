import { Injectable } from '@angular/core';
import { CellEditorComponent } from '../components/cell-editor/cell-editor.component';

@Injectable({
    providedIn: 'root',
})
export class CellEditorService {

    public cellEditor: CellEditorComponent | undefined;

    private documentEditListener: ((e: MouseEvent) => void | undefined) | undefined;

    constructor() {
    }

    public updateEditingCell(cellEditor: CellEditorComponent): void {
        if (cellEditor !== this.cellEditor) {
            this.cellEditor?.toOutput(true);
        }
        this.cellEditor = cellEditor;
        this.cellEditor.toInput();
        this.bindDocumentEditListener();
    }

    public bindDocumentEditListener(): void {
        if (!this.documentEditListener) {
            this.documentEditListener = (e: MouseEvent): void => {
                e.preventDefault();
                const target: HTMLElement = e.target as HTMLElement;
                const mosaCellEditor: HTMLElement | null = target.closest('mosa-cell-editor');
                if (this.cellEditor && mosaCellEditor !== this.cellEditor.element && !target.classList.contains('cell-output')) {
                    document.removeEventListener('click', this.documentEditListener!);
                    this.documentEditListener = undefined;
                    this.cellEditor.toOutput(true);
                    this.cellEditor = undefined;
                }
            };

            document.addEventListener('click', this.documentEditListener);
        }
    }

    public isEditingCellValid(): boolean {
        return this.cellEditor?.element != null && Array.from(this.cellEditor.element.querySelectorAll('.ng-invalid')).length === 0;
    }
}
