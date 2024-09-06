import { Avatar, Button, debounce, Grid, Pagination, Stack, Tab, Tabs, TextField, Typography } from '@mui/material';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import React, { useEffect, useRef, useState } from 'react';
import { PagedResultDto } from '../../services/dto/pagedResultDto';
import datLichService from '../../services/dat-lich/datLichService';
import { BookingDetail_ofCustomerDto } from '../../services/dat-lich/dto/BookingGetAllItemDto';
import { BookingRequestDto } from '../../services/dat-lich/dto/PagedBookingResultRequestDto';
import { LabelDisplayedRows } from '../../components/Pagination/LabelDisplayedRows';
import PageEmpty from '../../components/PageEmpty';
import { LoaiChungTu } from '../../lib/appconst';
import { KhachHangItemDto } from '../../services/khach-hang/dto/KhachHangItemDto';

export type IPropsTabKhachHangBooking = {
    txtSearch: string;
    onClickAddHoaDon: (customerId: string, loaiHoaDon: number, bookingId?: string) => void;
};

const TabKhachHangBooking = (props: IPropsTabKhachHangBooking) => {
    const { txtSearch, onClickAddHoaDon, ...other } = props;
    const firstLoad = useRef(true);
    const [paramSearchCus, setParamSearchCus] = useState<BookingRequestDto>({
        currentPage: 0,
        pageSize: 10
    } as BookingRequestDto);
    const [listCusBooking, setListCusBooking] = useState<PagedResultDto<BookingDetail_ofCustomerDto>>();

    const GetListCustomer_wasBooking = async (txtSearch: string) => {
        paramSearchCus.textSearch = txtSearch;
        const data = await datLichService.GetKhachHang_Booking(paramSearchCus);
        setListCusBooking({
            ...listCusBooking,
            items: data?.items,
            totalCount: data?.totalCount,
            totalPage: Math.ceil(data?.totalCount / (paramSearchCus?.pageSize ?? 16))
        });
    };

    const debounceCustomer = useRef(
        debounce(async (paramSearch) => {
            await GetListCustomer_wasBooking(paramSearch);
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
        GetListCustomer_wasBooking(txtSearch);
    }, [paramSearchCus?.currentPage]);

    const addHoaDon = (cusItem: BookingDetail_ofCustomerDto, loaiHoaDon: number) => {
        onClickAddHoaDon(cusItem.idKhachHang, loaiHoaDon, cusItem.idBooking);
    };

    return (
        <>
            {listCusBooking?.totalCount == 0 ? (
                <PageEmpty
                    style={{ height: '86vh' }}
                    icon={<AccessTimeOutlinedIcon style={{ width: 100, height: 100 }} />}
                    text={'Không có khách hàng đặt hẹn'}
                />
            ) : (
                <Grid container spacing={2}>
                    {listCusBooking?.items?.map((cusItem, index) => (
                        <Grid item key={index} xs={12} sm={4} md={4} lg={3}>
                            <Stack
                                padding={1.5}
                                border={'1px solid transparent'}
                                borderRadius={1}
                                sx={{
                                    transition: '.4s',
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
                                                color: '#b7b42d',
                                                '&:hover': {
                                                    color: '#3c9977',
                                                    cursor: 'pointer'
                                                }
                                            }}
                                            onClick={() => addHoaDon(cusItem, LoaiChungTu.HOA_DON_BAN_LE)}>
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
                                            }}
                                            onClick={() => addHoaDon(cusItem, LoaiChungTu.GOI_DICH_VU)}>
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
                                currentPage={(paramSearchCus?.currentPage ?? 0) + 1}
                                pageSize={paramSearchCus?.pageSize}
                                totalCount={listCusBooking?.totalCount}
                            />
                            <Pagination
                                shape="circular"
                                count={listCusBooking?.totalPage}
                                page={(paramSearchCus?.currentPage ?? 0) + 1}
                                defaultPage={(paramSearchCus?.currentPage ?? 0) + 1}
                                onChange={(e, value) =>
                                    setParamSearchCus({
                                        ...paramSearchCus,
                                        currentPage: value
                                    })
                                }
                            />
                        </Stack>
                    </Grid>
                </Grid>
            )}
        </>
    );
};
export default TabKhachHangBooking;
