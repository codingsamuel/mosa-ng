// eslint-disable-next-line max-classes-per-file
export enum ConfirmDialogResult {
    confirmed,
    denied,
    cancelled,
}

export class ConfirmDialogAction {

    public icon: string | undefined;
    public visible: boolean | undefined;
    public label: string;

    constructor(label: string, icon?: string, visible?: boolean) {
        this.label = label;
        this.icon = icon;
        this.visible = visible;
    }

}

export class ConfirmDialogData {

    public title: string | undefined;
    public message: string | undefined;
    public cancel: ConfirmDialogAction | undefined;
    public confirm: ConfirmDialogAction | undefined;
    public deny: ConfirmDialogAction | undefined;
    public uppercase: boolean = true;

    constructor(title?: string, message?: string, cancel?: ConfirmDialogAction, confirm?: ConfirmDialogAction, deny?: ConfirmDialogAction, uppercase?: boolean) {
        this.title = title;
        this.message = message;
        this.cancel = cancel;
        this.confirm = confirm;
        this.deny = deny;

        if (uppercase != null) {
            this.uppercase = uppercase;
        }
    }
}
