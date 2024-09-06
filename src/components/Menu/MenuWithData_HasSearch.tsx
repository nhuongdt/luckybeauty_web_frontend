import { Menu, MenuItem, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { IList } from '../../services/dto/IList';
import { CSSProperties } from 'styled-components';

type IPropsMenu = {
    open: boolean;
    lstData: IList[];
    anchorEl: HTMLElement | null;
    handleChoseItem: (item: IList) => void;
    handleClose: () => void;
    style?: CSSProperties;
};
export default function MenuWithDataHasSearch({ open, lstData, anchorEl, handleChoseItem, handleClose }: IPropsMenu) {
    return (
        <Menu
            id="menu-with-data-has-search"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
                'aria-labelledby': 'basic-button'
            }}>
            <TextField size="small" InputProps={{ startAdornment: <SearchIcon /> }} variant="standard" />
            {lstData?.map((x, index) => (
                <MenuItem key={index} onClick={() => handleChoseItem(x)}>
                    {x.text}
                </MenuItem>
            ))}
        </Menu>
    );
}
