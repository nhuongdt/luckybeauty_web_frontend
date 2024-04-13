import { CustomerSMSDto, ParamSearchSMS } from '../../services/sms/gui_tin_nhan/gui_tin_nhan_dto';
import * as React from 'react';
import { Autocomplete, Grid, TextField, Typography, Box } from '@mui/material';
import { useState, useRef } from 'react';
import { debounce } from '@mui/material/utils';
import { LoaiTin, TrangThaiSMS } from '../../lib/appconst';
import khachHangService from '../../services/khach-hang/khachHangService';
import HeThongSMSServices from '../../services/sms/gui_tin_nhan/he_thong_sms_services';
import { PagedKhachHangResultRequestDto } from '../../services/khach-hang/dto/PagedKhachHangResultRequestDto';

export type IPropsZalo_AutocompleteMultipleCustomer = {
    label?: string;
    helperText?: string;
    isError?: boolean;
    paramFilter: ParamSearchSMS;
    arrIdChosed?: string[];
    handleChoseItem: (arrChosed: CustomerSMSDto[]) => void;
};

// Sử dụng generics để truyền kiểu dữ liệu của props từ ParentComponent xuống ChildComponent
export default function Zalo_MultipleAutoComplete_WithSDT(props: IPropsZalo_AutocompleteMultipleCustomer) {
    const { label, helperText, isError, arrIdChosed, paramFilter, handleChoseItem } = props;
    const [lstOption, setLstOption] = useState<CustomerSMSDto[]>([]);
    const [lstChosed, setLstChosed] = useState<CustomerSMSDto[]>([]);
    const [textSearch, setTextSearch] = useState('');

    const getInforCustomerFromDB = async () => {
        if (arrIdChosed !== undefined && arrIdChosed != null) {
            const arr: CustomerSMSDto[] = [];
            for (let index = 0; index < arrIdChosed.length; index++) {
                const element = arrIdChosed[index];
                const customer = await khachHangService.getKhachHang(element);
                arr.push({
                    id: customer?.id,
                    zoaUserId: customer?.zoaUserId,
                    tenKhachHang: customer?.tenKhachHang,
                    soDienThoai: customer?.soDienThoai
                } as CustomerSMSDto);
            }
            setLstChosed(arr);
            handleChoseItem(arr);
        } else {
            setLstChosed([]);
        }
    };

    const debounceDropDown = useRef(
        debounce(async (paramFilter, textSearch) => {
            paramFilter.textSearch = textSearch; // txtSearch
            switch (paramFilter?.idLoaiTin) {
                case LoaiTin.TIN_THUONG:
                    {
                        // only search by textsearch
                        const param = {
                            keyword: textSearch,
                            loaiDoiTuong: 1,
                            skipCount: 0,
                            maxResultCount: 50
                        } as PagedKhachHangResultRequestDto;
                        const data = await khachHangService.jqAutoCustomer(param);
                        if (data !== null) {
                            setLstOption(
                                data.map((x: any) => {
                                    return {
                                        id: x?.id,
                                        zoaUserId: x?.zoaUserId,
                                        tenKhachHang: x?.tenKhachHang,
                                        soDienThoai: x?.soDienThoai
                                    } as CustomerSMSDto;
                                })
                            );
                        }
                    }
                    break;
                case LoaiTin.TIN_SINH_NHAT:
                case LoaiTin.TIN_LICH_HEN:
                case LoaiTin.TIN_GIAO_DICH:
                    {
                        paramFilter.isFilterCustomer = true;
                        paramFilter.trangThais = [TrangThaiSMS.DRAFT, TrangThaiSMS.CHUA_GUI];
                        const data = await HeThongSMSServices.JqAutoCustomer_byIdLoaiTin(
                            paramFilter,
                            paramFilter?.idLoaiTin
                        );
                        if (data !== null) {
                            setLstOption(data);
                        }
                    }
                    break;
            }
        }, 500)
    ).current;

    React.useEffect(() => {
        debounceDropDown(paramFilter, textSearch);
    }, [paramFilter?.fromDate, paramFilter?.toDate, paramFilter?.idChiNhanhs, textSearch, paramFilter?.idLoaiTin]);

    React.useEffect(() => {
        getInforCustomerFromDB();
    }, [arrIdChosed]);

    const choseItem = (item: CustomerSMSDto[]) => {
        setLstChosed(item);
        handleChoseItem(item);
    };
    const handleInputChange = (newInputValue: string) => {
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
                filterOptions={(x) => x}
                onChange={(event: any, newValue: CustomerSMSDto[]) => choseItem(newValue)}
                onInputChange={(event, newInputValue) => {
                    handleInputChange(newInputValue);
                }}
                options={lstOption}
                getOptionLabel={(option: CustomerSMSDto) => (option?.tenKhachHang ? option.tenKhachHang : '')}
                renderInput={(params) => (
                    <TextField {...params} label={label ?? 'Tìm kiếm'} helperText={helperText} error={isError} />
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
                                    <Typography style={{ fontSize: '13px' }}>{option?.tenKhachHang}</Typography>
                                    <Box
                                        component="span"
                                        style={{
                                            fontWeight: 500,
                                            color: '#acaca5',
                                            fontSize: '12px'
                                        }}>
                                        {option?.soDienThoai}
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
