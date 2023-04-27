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

export class PropMesAlert {
    title = '';
    mes = '';
    type = 1; // ok, 0.err
}
