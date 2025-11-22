import { ContentChild, Directive, ElementRef, HostListener, inject, OnInit } from '@angular/core';
import { CellEditorComponent } from '../components/cell-editor/cell-editor.component';
import { CellEditorService } from '../services/cell-editor.service';

@Directive({ selector: 'td[mosaCellEditor]' })
export class CellEditorDirective implements OnInit {

    @ContentChild(CellEditorComponent)
    private readonly cellEditor!: CellEditorComponent;

    private readonly myElementRef: ElementRef<HTMLElement> = inject(ElementRef<HTMLElement>);
    private readonly myCellEditorService: CellEditorService = inject(CellEditorService);

    constructor() {
    }

    @HostListener('keydown.escape', [ '$event' ])
    public onEscapeKeyDown(e: KeyboardEvent): void {
        e.preventDefault();
        this.cellEditor.toOutput();
    }

    @HostListener('keydown.tab', [ '$event' ])
    @HostListener('keydown.shift.tab', [ '$event' ])
    @HostListener('keydown.meta.tab', [ '$event' ])
    public onShiftKeyDown(e: KeyboardEvent): void {
        e.preventDefault();
        if (e.shiftKey) {
            this.moveToCell(e, false);
        } else {
            this.moveToCell(e, true);
        }
    }

    @HostListener('keydown.enter', [ '$event' ])
    public onEnterKeyDown(e: KeyboardEvent): void {
        e.preventDefault();
        if (this.myCellEditorService.isEditingCellValid()) {
            this.moveToNextRowCell(e);
        }
    }

    @HostListener('click', [ '$event' ])
    public onClick(e: MouseEvent): void {
        e.preventDefault();
        this.myCellEditorService.updateEditingCell(this.cellEditor);
        this.cellEditor.cellClick.emit();
    }

    public ngOnInit(): void {
        this.myElementRef.nativeElement.classList.add('editable-cell');
    }

    private moveToNextRowCell(e: KeyboardEvent): void {
        const currentCell: Element | null | undefined = this.cellEditor?.element?.parentElement;
        if (!currentCell) {
            return;
        }

        let columnDefClass: string = '';
        currentCell.classList.forEach((className: string): void => {
            const found: boolean = className.includes('mat-column-');
            if (found) {
                columnDefClass = className;
            }
        });

        const targetCell: ChildNode | null = this.findNextRowEditableColumn(currentCell, columnDefClass);
        this.cellEditor.toOutput(true);
        CellEditorDirective.executeMove(e, targetCell);
    }

    private findNextRowEditableColumn(row: Element, matColumnClassName: string): ChildNode | null {
        const nextRow: Element | null | undefined = row.parentElement?.nextElementSibling;
        if (!nextRow) {
            return null;
        }

        const column: Element = nextRow.getElementsByClassName(matColumnClassName)[ 0 ];
        return column?.classList.contains('editable-cell') ?
            column.firstChild :
            this.findNextRowEditableColumn(nextRow, matColumnClassName);
    }

    private findNextEditableColumn(cell: Element): ChildNode | null {
        let nextCell: Element | null | undefined = cell.parentElement?.nextElementSibling;

        if (!nextCell) {
            const nextRow: Element | null | undefined = cell.parentElement?.parentElement?.nextElementSibling;
            if (nextRow) {
                nextCell = nextRow.firstElementChild;
            }
        }

        if (nextCell) {
            return nextCell.classList.contains('editable-cell')
                ? nextCell.firstChild
                : this.findNextEditableColumn(nextCell);
        }

        return null;
    }

    private findPreviousEditableColumn(cell: Element): ChildNode | null {
        let prevCell: Element | null = cell.previousElementSibling;

        if (!prevCell) {
            const previousRow: Element | null | undefined = cell.parentElement?.previousElementSibling;
            if (previousRow) {
                prevCell = previousRow.lastElementChild;
            }
        }

        if (prevCell) {
            return prevCell.classList.contains('editable-cell') ?
                prevCell.firstChild :
                this.findPreviousEditableColumn(prevCell);
        } else {
            return null;
        }
    }

    private moveToCell(event: KeyboardEvent, nextCell: boolean): void {
        const currentCell: HTMLElement = this.cellEditor.element;
        if (this.cellEditor.element != null) {
            const targetCell: ChildNode | null = nextCell
                ? this.findNextEditableColumn(currentCell)
                : this.findPreviousEditableColumn(currentCell);
            if (this.myCellEditorService.isEditingCellValid()) {
                this.cellEditor.toOutput(true);
                (targetCell as HTMLElement)?.click();
            }
            CellEditorDirective.executeMove(event, targetCell);
        }
    }

    private static invokeElementMethod(element: EventTarget | ChildNode | Element | null, methodName: string, args?: unknown[]): void {
        // eslint-disable-next-line @typescript-eslint/no-restricted-types,@typescript-eslint/no-unsafe-function-type,@typescript-eslint/no-explicit-any
        ((element as any)[ methodName ] as Function).apply(element, args);
    }

    private static executeMove(e: KeyboardEvent, targetCell: ChildNode | null): void {
        e.preventDefault();
        // If datepicker is opened, remove cdk-overlay from dom
        const element: Element = e.composedPath()[ 0 ] as Element;
        if (element.className.includes('td-input-date')) {
            const cdkOverlayContainer: Element = document.getElementsByClassName('cdk-overlay-container')[ 0 ];
            const cdkBackdrop: Element = cdkOverlayContainer.getElementsByClassName('cdk-overlay-backdrop')[ 0 ];
            if (cdkBackdrop != null) {
                CellEditorDirective.invokeElementMethod(cdkBackdrop, 'click');
            }
            cdkOverlayContainer.innerHTML = '';
        }

        CellEditorDirective.invokeElementMethod(e.target, 'blur');
        if (targetCell != null) {
            CellEditorDirective.invokeElementMethod(targetCell, 'click');
        }
    }

}
