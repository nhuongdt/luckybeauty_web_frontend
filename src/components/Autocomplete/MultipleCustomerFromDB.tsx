import * as React from 'react';
import { Autocomplete, Grid, TextField, Typography, Box } from '@mui/material';
import { useState, useRef } from 'react';
import { debounce } from '@mui/material/utils';
import utils from '../../utils/utils';
import { Guid } from 'guid-typescript';
import { IDataAutocomplete } from '../../services/dto/IDataAutocomplete';
import { RequestFromToDto } from '../../services/dto/ParamSearchDto';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { LoaiTin } from '../../lib/appconst';
import khachHangService from '../../services/khach-hang/khachHangService';
import HeThongSMSServices from '../../services/sms/gui_tin_nhan/he_thong_sms_services';

export default function AutocompleteMultipleCustomerFromDB({
    paramFilter,
    arrIdChosed,
    handleChoseItem,
    label,
    helperText = '',
    err = false
}: any) {
    const [lstOption, setLstOption] = useState<IDataAutocomplete[]>([]);
    const [lstChosed, setLstChosed] = useState<IDataAutocomplete[]>([]);
    const [textSearch, setTextSearch] = useState('');

    const getInforDatafromDB = async () => {
        // if (arrIdChosed != null && arrIdChosed.length > 1) {
        //     switch (type) {
        //         case LoaiTin.TIN_THUONG:
        //             {
        //                 if (arrIdChosed.length > 0) {
        //                     const data = await khachHangService.getKhachHang(arrIdChosed[0]);
        //                     if (data !== null) {
        //                         const itemMap = {
        //                             id: data.id,
        //                             text1: data.tenKhachHang,
        //                             text2: data.soDienThoai
        //                         } as unknown as IDataAutocomplete;
        //                         setItemChosed(itemMap);
        //                     }
        //                 } else {
        //                     setItemChosed(null);
        //                 }
        //             }
        //             break;
        //         case LoaiTin.TIN_SINH_NHAT:
        //             {
        //                 const data = await BrandnameService.GetInforBrandnamebyID(arrIdChosed);
        //                 if (data !== null) {
        //                     const itemMap = {
        //                         id: data.id,
        //                         text1: data.brandname,
        //                         text2: data.sdtCuaHang
        //                     };
        //                     setItemChosed(itemMap);
        //                 }
        //             }
        //             break;
        //     }
        // } else {
        //     setItemChosed(() => null);
        // }
    };

    const debounceDropDown = useRef(
        debounce(async (paramFilter, textSearch) => {
            paramFilter.textSearch = textSearch; // txtSearch
            switch (paramFilter?.idLoaiTin) {
                case LoaiTin.TIN_THUONG:
                    {
                        // only search by textsearch
                        const data = await khachHangService.jqAutoCustomer(paramFilter);
                        if (data !== null) {
                            setLstOption(
                                data.map((x: any) => {
                                    return {
                                        id: x.id,
                                        text1: x.tenKhachHang,
                                        text2: x.soDienThoai
                                    };
                                })
                            );
                        }
                    }
                    break;
                case LoaiTin.TIN_SINH_NHAT:
                case LoaiTin.TIN_LICH_HEN:
                case LoaiTin.TIN_GIAO_DICH:
                    {
                        const data = await HeThongSMSServices.JqAutoCustomer_byIdLoaiTin(
                            paramFilter,
                            paramFilter?.idLoaiTin
                        );
                        if (data !== null) {
                            setLstOption(
                                data.map((x: any) => {
                                    return {
                                        id: x.id,
                                        text1: x.tenKhachHang,
                                        text2: x.soDienThoai
                                    };
                                })
                            );
                        }
                    }
                    break;
            }
        }, 500)
    ).current;

    React.useEffect(() => {
        debounceDropDown(paramFilter, textSearch);
    }, [paramFilter, textSearch]);

    React.useEffect(() => {
        setLstChosed(
            arrIdChosed.map((x: string) => {
                return {
                    id: x,
                    text1: '',
                    text2: ''
                };
            })
        );
    }, arrIdChosed);

    const choseItem = (item: any) => {
        setLstChosed(item);
        handleChoseItem(item);
    };
    const handleInputChange = (newInputValue: any) => {
        setTextSearch(newInputValue);
    };

    return (
        <>
            <Autocomplete
                size="small"
                fullWidth
                disablePortal
                autoComplete
                multiple={true}
                filterSelectedOptions
                value={lstChosed}
                onChange={(event: any, newValue: any) => choseItem(newValue)}
                onInputChange={(event, newInputValue) => {
                    handleInputChange(newInputValue);
                }}
                options={lstOption}
                getOptionLabel={(option: any) => (option?.text1 ? option.text1 : '')}
                renderInput={(params) => (
                    <TextField {...params} label={label ?? 'Tìm kiếm'} helperText={helperText} error={err} />
                )}
                renderOption={(props, option) => {
                    return (
                        <li
                            {...props}
                            key={option.id}
                            style={{
                                borderBottom: '1px dashed var(--border-color)'
                            }}>
                            <Grid container alignItems="center">
                                <Grid item sx={{ width: 'calc(100% - 44px)', wordWrap: 'break-word' }}>
                                    <Typography style={{ fontSize: '13px' }}>{option?.text1}</Typography>
                                    <Box
                                        component="span"
                                        style={{
                                            fontWeight: 500,
                                            color: '#acaca5',
                                            fontSize: '12px'
                                        }}>
                                        {option?.text2}
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
