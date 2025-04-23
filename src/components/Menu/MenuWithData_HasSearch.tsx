import { Checkbox, FormControlLabel, Menu, MenuItem, Stack, TextField, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { IList } from '../../services/dto/IList';
import { CSSProperties } from 'styled-components';
import { useState } from 'react';
import utils from '../../utils/utils';

type IPropsMenu = {
    open: boolean;
    hasCheckBox?: boolean;
    lstData: IList[];
    anchorEl: HTMLElement | null;
    handleChoseItem?: (item: IList) => void;
    choseMultipleItem?: (arrId: string[]) => void;
    handleClose: () => void;
    style?: CSSProperties;
};
export default function MenuWithDataHasSearch({
    open,
    hasCheckBox,
    lstData,
    anchorEl,
    handleChoseItem,
    choseMultipleItem,
    handleClose
}: IPropsMenu) {
    const [arrIdChosed, setArrIdChosed] = useState<string[]>([]);
    const [textSearch, setTextSearch] = useState<string>('');

    const lstSearch = lstData?.filter(
        (x) =>
            utils.strToEnglish(x.text).indexOf(utils.strToEnglish(textSearch)) > -1 ||
            (x?.text2 && utils.strToEnglish(x.text2).indexOf(utils.strToEnglish(textSearch)) > -1)
    );

    const changeCheckBox = (id: string, isCheck: boolean) => {
        let arrNew: string[];
        if (isCheck) {
            arrNew = [id, ...arrIdChosed];
        } else {
            arrNew = arrIdChosed?.filter((x) => x !== id);
        }
        setArrIdChosed(arrNew);
        if (choseMultipleItem) {
            choseMultipleItem(arrNew);
        }
    };

    const changeCheckAll = (isCheck: boolean) => {
        let arrNew: string[];
        if (isCheck) {
            arrNew = lstData?.map((x) => {
                return x.id;
            });
        } else {
            arrNew = [];
        }
        setArrIdChosed([...arrNew]);
        if (choseMultipleItem) {
            choseMultipleItem(arrNew);
        }
    };

    return (
        <Menu
            id="menu-with-data-has-search"
            autoFocus={false}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
                'aria-labelledby': 'basic-button'
            }}>
            <TextField
                size="small"
                InputProps={{ startAdornment: <SearchIcon /> }}
                variant="standard"
                onKeyDown={(e) => e.stopPropagation()}
                value={textSearch}
                onChange={(e) => setTextSearch(e.target.value)}
            />

            {hasCheckBox && (
                <MenuItem>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={arrIdChosed?.length === lstData?.length}
                                onChange={(e) => changeCheckAll(e.currentTarget.checked)}
                            />
                        }
                        label="Tất cả"
                    />
                </MenuItem>
            )}

            {lstSearch?.map((x, index) => (
                <MenuItem
                    key={index}
                    onClick={() => {
                        if (handleChoseItem) handleChoseItem(x);
                    }}>
                    <Stack direction="row" spacing={1} alignItems={'center'}>
                        {hasCheckBox && (
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={arrIdChosed.includes(x.id)}
                                        onChange={(e) => changeCheckBox(x.id, e.currentTarget.checked)}
                                    />
                                }
                                label={x.text}
                            />
                        )}
                    </Stack>
                </MenuItem>
            ))}
        </Menu>
    );
}
