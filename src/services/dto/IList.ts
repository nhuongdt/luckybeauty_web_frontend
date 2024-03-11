import { SvgIconComponent } from '@mui/icons-material';
import { ReactComponentElement } from 'react';

export interface IList {
    id: string;
    text: string;
    text2?: string;
    isShow?: boolean;
    color?: string;
    icon?: ReactComponentElement<SvgIconComponent>;
    children?: IList[];
}
