import { ISelect } from '../../lib/appconst';

export interface IPropsPopoverFilter<T> {
    id?: string;
    anchorEl: HTMLElement | null | SVGSVGElement; // icon MUI or HTML
    handleApply: (param: T) => void;
    handleClose: () => void;
    paramFilter: T;
}
export interface IPropsListCheckFilter {
    lstOption: ISelect[];
    arrValueDefault: number[];
    onChange: (arrIdChosed: number[]) => void;
}
export interface IPropsListRadioFilter {
    lstOption: ISelect[];
    defaultValue: number | string;
    onChange: (newValue: number | string) => void;
}
