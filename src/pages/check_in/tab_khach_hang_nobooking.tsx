import { Avatar, Button, debounce, Grid, Pagination, Stack, Tab, Tabs, TextField, Typography } from '@mui/material';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import React, { useEffect, useRef, useState } from 'react';
import { PagedKhachHangResultRequestDto } from '../../services/khach-hang/dto/PagedKhachHangResultRequestDto';
import { KhachHangItemDto } from '../../services/khach-hang/dto/KhachHangItemDto';
import { PagedResultDto } from '../../services/dto/pagedResultDto';
import khachHangService from '../../services/khach-hang/khachHangService';
import { LabelDisplayedRows } from '../../components/Pagination/LabelDisplayedRows';

const TabKhachHangNoBooking: React.FC<{ txtSearch: string }> = ({ txtSearch }) => {
    const firstLoad = useRef(true);
    const [paramSearchCus, setParamSearchCus] = useState<PagedKhachHangResultRequestDto>({
        skipCount: 1,
        maxResultCount: 16
    } as PagedKhachHangResultRequestDto);
    const [lstCustomerNoBooking, setLstCustomerNoBooking] = useState<PagedResultDto<KhachHangItemDto>>({
        items: [],
        totalCount: 0,
        totalPage: 0
    });

    const GetKhachHang_noBooking = async (txtSearch: string) => {
        paramSearchCus.keyword = txtSearch;
        const data = await khachHangService.GetKhachHang_noBooking(paramSearchCus);
        setLstCustomerNoBooking({
            ...lstCustomerNoBooking,
            items: data?.items,
            totalCount: data?.totalCount,
            totalPage: Math.ceil(data?.totalCount / paramSearchCus?.maxResultCount)
        });
    };

    const debounceCustomer = useRef(
        debounce(async (txt) => {
            await GetKhachHang_noBooking(txt);
        }, 500)
    ).current;

    useEffect(() => {
        debounceCustomer(txtSearch);
    }, [txtSearch]);

    useEffect(() => {
        if (firstLoad.current) {
            firstLoad.current = false;
            return;
        }
        GetKhachHang_noBooking(txtSearch);
    }, [paramSearchCus?.skipCount]);

    return (
        <Grid container spacing={2}>
            {lstCustomerNoBooking?.items?.map((cusItem, index) => (
                <Grid item key={index} xs={12} sm={4} md={4} lg={3}>
                    <Stack
                        padding={1.5}
                        border={'1px solid #cccc'}
                        borderRadius={1}
                        sx={{
                            boxShadow: '0px 2px 5px 0px #c6bdd1',
                            backgroundColor: '#fff',
                            '&:hover': {
                                borderColor: 'var(--color-main)',
                                cursor: 'pointer'
                            }
                        }}>
                        <Stack minHeight={100} justifyContent={'space-between'}>
                            <Stack direction={'row'} padding={1} justifyContent={'space-between'}>
                                <Stack spacing={2} direction={'row'}>
                                    <Stack>
                                        <Avatar src={cusItem?.avatar} />
                                    </Stack>
                                    <Stack spacing={1}>
                                        <Typography variant="body2" fontWeight={500}>
                                            {cusItem?.tenKhachHang}
                                        </Typography>
                                        <Typography variant="caption" color={'var( --color-text-blur)'}>
                                            {cusItem?.soDienThoai}
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </Stack>
                            <Stack
                                direction={'row'}
                                alignItems={'center'}
                                spacing={2}
                                height={30}
                                justifyContent={'space-between'}>
                                <Stack
                                    direction={'row'}
                                    spacing={1}
                                    sx={{
                                        color: 'var(--color-main)',
                                        '&:hover': {
                                            color: '#3c9977',
                                            cursor: 'pointer'
                                        }
                                    }}>
                                    <AddCircleOutlineOutlinedIcon />
                                    <Typography>Hóa đơn</Typography>
                                </Stack>
                                <Stack
                                    sx={{
                                        width: '1px',
                                        height: '100%'
                                    }}></Stack>

                                <Stack
                                    direction={'row'}
                                    spacing={1}
                                    sx={{
                                        color: 'var(--color-second)',
                                        '&:hover': {
                                            color: '#c32b2b',
                                            cursor: 'pointer'
                                        }
                                    }}>
                                    <AddCircleOutlineOutlinedIcon />
                                    <Typography> Gói dịch vụ</Typography>
                                </Stack>
                            </Stack>
                        </Stack>
                    </Stack>
                </Grid>
            ))}

            <Grid item xs={12} position={'absolute'} bottom={'10px'} width={'100%'}>
                <Stack direction={'row'} spacing={2} justifyContent={'center'} marginTop={2}>
                    <LabelDisplayedRows
                        currentPage={paramSearchCus?.skipCount}
                        pageSize={paramSearchCus?.maxResultCount}
                        totalCount={lstCustomerNoBooking?.totalCount}
                    />
                    <Pagination
                        shape="circular"
                        count={lstCustomerNoBooking?.totalPage}
                        page={paramSearchCus?.skipCount}
                        defaultPage={paramSearchCus?.skipCount}
                        onChange={(e, value) =>
                            setParamSearchCus({
                                ...paramSearchCus,
                                skipCount: value
                            })
                        }
                    />
                </Stack>
            </Grid>
        </Grid>
    );
};
export default TabKhachHangNoBooking;
