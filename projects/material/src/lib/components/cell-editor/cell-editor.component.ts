import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, ElementRef, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { TableItem } from '../../models/table-item.model';

@Component({
    selector: 'mosa-cell-editor',
    templateUrl: './cell-editor.component.html',
    styleUrls: [ './cell-editor.component.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class CellEditorComponent<T = any> implements OnInit {

    @Input()
    public key: string = '';

    @Input()
    public rowItem!: TableItem<T>;

    @Input()
    public value: T | undefined;

    @Output()
    public valueChange: EventEmitter<T | undefined> = new EventEmitter<T | undefined>();

    @Output()
    public cellClick: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

    @Output()
    private readonly cellChange: EventEmitter<void> = new EventEmitter<void>();

    @Output()
    private readonly cellCancel: EventEmitter<void> = new EventEmitter<void>();

    @ContentChild(MatSelect)
    private readonly select: MatSelect | undefined;

    public mode: 'input' | 'output' = 'output';

    private oldValue: T | undefined;

    private readonly myChangeDetectorRef: ChangeDetectorRef = inject(ChangeDetectorRef);
    private readonly myElementRef: ElementRef<HTMLElement> = inject(ElementRef<HTMLElement>);

    constructor() {
    }

    public get element(): HTMLElement {
        return this.myElementRef.nativeElement;
    }

    public ngOnInit(): void {
        this.oldValue = this.value;
        this.rowItem.rowOriginalData = this.rowItem;
    }

    public toOutput(save?: boolean): void {
        if (this.mode !== 'output') {
            this.mode = 'output';
            this.myChangeDetectorRef.markForCheck();
            this.element.classList.remove('focused');

            if (save) {
                if (!this.rowItem.changedRowKeys) {
                    this.rowItem.changedRowKeys = [];
                }
                const index: number = this.rowItem.changedRowKeys.indexOf(this.key);
                if (this.value !== this.oldValue) {
                    if (index === -1) {
                        this.rowItem.changedRowKeys.push(this.key);
                        this.element.classList.add('edited');
                    }
                    this.cellChange.emit();
                } else {
                    if (index !== -1) {
                        this.rowItem.changedRowKeys.splice(index, 1);
                        this.element.classList.remove('edited');
                    }
                }
            } else {
                this.value = this.oldValue;
                this.cellCancel.emit();
            }
            this.valueChange.next(this.value);
        }
    }

    public toInput(): void {
        this.mode = 'input';
        this.myChangeDetectorRef.markForCheck();
        this.element.classList.add('focused');
        setTimeout((): void => {
            const comp: HTMLElement | null = this.element.querySelector('.cell-input');

            if (comp instanceof HTMLInputElement) {
                comp.focus();
            } else if (this.select) {
                this.select.open();
            }
        });
    }

}
