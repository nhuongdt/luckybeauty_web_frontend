import * as React from 'react';
import { Autocomplete, Grid, TextField, Typography, Box } from '@mui/material';
import CenterFocusWeakIcon from '@mui/icons-material/CenterFocusWeak';
import { useState, useRef } from 'react';
import { debounce } from '@mui/material/utils';
import { KhachHangItemDto } from '../../services/khach-hang/dto/KhachHangItemDto';
import khachHangService from '../../services/khach-hang/khachHangService';
import { PagedKhachHangResultRequestDto } from '../../services/khach-hang/dto/PagedKhachHangResultRequestDto';
import Utils from '../../utils/utils'; // func common

export default function AutocompleteCustomer({ handleChoseItem }: any) {
    // const [listCustomer, setListCustomer] = useState<KhachHangItemDto[]>([]);
    const [listCustomer, setListCustomer] = useState([]);
    const [paramSearch, setParamSearch] = useState<PagedKhachHangResultRequestDto>({
        keyword: '',
        loaiDoiTuong: 1,
        maxResultCount: 50,
        skipCount: 0,
        sortBy: '',
        sortType: ''
    });

    const debounceDropDown = useRef(
        debounce(async (paramSearch: any) => {
            const data = await khachHangService.jqAutoCustomer(paramSearch);
            setListCustomer(data);
        }, 500)
    ).current;

    React.useEffect(() => {
        // if (Utils.checkNull(paramSearch.keyword)) {
        //     setListCustomer(listCustomer ? listCustomer : []);
        //     return undefined;
        // }
        debounceDropDown(paramSearch);
    }, [paramSearch.keyword]);

    const choseItem = (item: any) => {
        handleChoseItem(item);
    };
    const handleInputChange = (newInputValue: any) => {
        setParamSearch({ ...paramSearch, keyword: newInputValue });
    };

    return (
        <>
            <Autocomplete
                size="small"
                fullWidth
                disablePortal
                autoComplete
                multiple={false}
                onChange={(event: any, newValue: KhachHangItemDto | null) => choseItem(newValue)}
                onInputChange={(event, newInputValue) => {
                    handleInputChange(newInputValue);
                }}
                filterOptions={(x) => x}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                options={listCustomer}
                getOptionLabel={(option: any) => (option.tenKhachHang ? option.tenKhachHang : '')}
                renderInput={(params) => <TextField {...params} label="Tìm kiếm" />}
                renderOption={(props, option) => {
                    return (
                        <li {...props}>
                            <Grid container alignItems="center">
                                <Grid item sx={{ display: 'flex', width: 44 }}>
                                    <CenterFocusWeakIcon sx={{ color: 'text.secondary' }} />
                                </Grid>
                                <Grid
                                    item
                                    sx={{ width: 'calc(100% - 44px)', wordWrap: 'break-word' }}>
                                    <Typography style={{ fontSize: '14px' }}>
                                        {option.tenKhachHang}
                                    </Typography>
                                    <Box
                                        component="span"
                                        style={{
                                            fontWeight: 500,
                                            color: '#acaca5',
                                            fontSize: '12px'
                                        }}>
                                        {option.soDienThoai}
                                    </Box>
                                </Grid>
                            </Grid>
                        </li>
                    );
                }}
            />
        </>
    );
}
