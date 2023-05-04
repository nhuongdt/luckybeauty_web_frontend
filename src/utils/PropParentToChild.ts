export class PropModal {
    isShow = false;
    isNew = false;
    id?: string | null = '';
    item?: any = {};
    constructor({ isShow = false, isNew = false, id = '', item = {} }) {
        this.isNew = isNew;
        this.isShow = isShow;
        this.id = id;
        this.item = item;
    }
}

export class PropConfirmOKCancel {
    show = false;
    title = '';
    mes = '';
    type = 1; // ok, 0.err
    constructor({ show = false, title = '', mes = '', type = 0 }) {
        this.show = show;
        this.title = title;
        this.mes = mes;
        this.type = type;
    }
}
