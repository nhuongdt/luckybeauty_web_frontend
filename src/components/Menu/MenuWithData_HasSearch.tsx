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
    const [isCheckAll, setIsCheckAll] = useState<boolean>(false);

    const lstSearch = lstData?.filter(
        (x) =>
            utils.strToEnglish(x.text).indexOf(utils.strToEnglish(textSearch)) > -1 ||
            (x?.text2 && utils.strToEnglish(x.text2).indexOf(utils.strToEnglish(textSearch)) > -1)
    );

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
        setIsCheckAll(isCheck);

        if (choseMultipleItem) {
            choseMultipleItem(arrNew);
        }
    };

    const choseItem = (item: IList) => {
        const id = item?.id;
        let arrNew: string[] = [];
        if (hasCheckBox) {
            setArrIdChosed((prev) => {
                if (prev.includes(id)) {
                    arrNew = prev.filter((x) => x !== id);
                } else {
                    arrNew = [...prev, id];
                }
                return [...arrNew];
            });
            setIsCheckAll(arrNew?.length === lstData?.length);
            if (choseMultipleItem) {
                choseMultipleItem(arrNew);
            }
        } else {
            if (handleChoseItem) handleChoseItem(item);
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
                <MenuItem onClick={() => changeCheckAll(!isCheckAll)}>
                    <FormControlLabel control={<Checkbox checked={isCheckAll} />} label="Tất cả" />
                </MenuItem>
            )}

            {lstSearch?.map((x, index) => (
                <MenuItem key={index} onClick={() => choseItem(x)}>
                    <Stack direction="row" spacing={1} alignItems={'center'}>
                        {hasCheckBox && (
                            <Checkbox
                                sx={{
                                    '&.MuiCheckbox-root': {
                                        paddingLeft: 0
                                    }
                                }}
                                checked={arrIdChosed.includes(x.id)}
                            />
                        )}
                        <Typography variant="body1"> {x.text}</Typography>
                    </Stack>
                </MenuItem>
            ))}
        </Menu>
    );
}
