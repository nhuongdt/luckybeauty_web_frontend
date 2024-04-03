export interface IZaloTemplate {
    id: string;
    idLoaiTin: number;
    tenMauTin: string;
    // moTaChiTiet: string;
    isDefault: boolean;
    isSystem?: boolean;
    template_type: string;
    language: string;
    elements?: IZaloElement[];
    buttons?: IZaloButtonDetail[];
}
export interface IZaloElement {
    id: string;
    idTemplate: string;
    elementType: string;
    thuTuSapXep: number;
    isImage: boolean;
    content: string;
    tables: IZaloTableDetail[];
}
export interface IZaloTableDetail {
    id: string;
    idElement: string;
    thuTuSapXep: number;
    key: string;
    value: string;
}
export interface IZaloButtonDetail {
    id: string;
    idTemplate: string;
    thuTuSapXep: number;
    type: string;
    title: string;
    payload: string;
    image_icon?: string;
}
