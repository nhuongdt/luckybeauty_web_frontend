import React, { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Select,
    SelectChangeEvent,
    MenuItem,
    ButtonGroup,
    Switch
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { ReactComponent as SettingIcon } from '../../images/settingIcon.svg';
import { ReactComponent as AddIcon } from '../../images/add.svg';
import { ReactComponent as ShapeIcon } from '../../images/Shape.svg';
import { ReactComponent as ShapeIcon2 } from '../../images/Shape2.svg';
import TabDay from './components/TabDay';
import TabWeek from './components/TabWeek';
import TabMonth from './components/TabMonth';
import { BookingGetAllItemDto } from '../../services/dat-lich/dto/BookingGetAllItemDto';
import datLichService from '../../services/dat-lich/datLichService';
import Cookies from 'js-cookie';
const LichHen: React.FC = () => {
    const [dateView, setDateView] = useState('');
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [data, setData] = useState<BookingGetAllItemDto[]>([]);
    const getData = async (curentDate: Date) => {
        const data = await datLichService.getAllBooking({
            idChiNhanh: Cookies.get('IdChiNhanh') ?? '',
            date: curentDate
        });
        setData(data);
    };
    const handlePreviousWeek = () => {
        const datePreviousWeek = new Date(selectedDate);
        if (TabLichHen === 'Tuần') {
            datePreviousWeek.setDate(datePreviousWeek.getDate() - 7);
        } else if (TabLichHen === 'Tháng') {
            datePreviousWeek.setDate(datePreviousWeek.getMonth() - 1);
        } else {
            datePreviousWeek.setDate(datePreviousWeek.getDate() - 1);
        }
        setSelectedDate(datePreviousWeek);
        getCurrentDateInVietnamese(datePreviousWeek);
        getData(datePreviousWeek);
    };
    const handleNextWeek = () => {
        const dateNextWeek = new Date(selectedDate);
        if (TabLichHen === 'Tuần') {
            dateNextWeek.setDate(dateNextWeek.getDate() + 7);
        } else if (TabLichHen === 'Tháng') {
            dateNextWeek.setDate(dateNextWeek.getMonth() + 1);
        } else {
            dateNextWeek.setDate(dateNextWeek.getDate() + 1);
        }
        setSelectedDate(dateNextWeek);
        getCurrentDateInVietnamese(dateNextWeek);
        getData(dateNextWeek);
    };
    const toDayClick = () => {
        const newDate = new Date();
        setSelectedDate(newDate);
        getCurrentDateInVietnamese(newDate);
        getData(newDate);
    };
    useEffect(() => {
        getCurrentDateInVietnamese(new Date());
        getData(new Date());
    }, []);

    const getCurrentDateInVietnamese = (date: Date) => {
        const daysOfWeek = [
            'Chủ nhật',
            'Thứ hai',
            'Thứ ba',
            'Thứ tư',
            'Thứ năm',
            'Thứ sáu',
            'Thứ bảy'
        ];
        const monthsOfYear = [
            'tháng 1',
            'tháng 2',
            'tháng 3',
            'tháng 4',
            'tháng 5',
            'tháng 6',
            'tháng 7',
            'tháng 8',
            'tháng 9',
            'tháng 10',
            'tháng 11',
            'tháng 12'
        ];
        const dayOfWeek = daysOfWeek[date.getDay()];
        const dayOfMonth = date.getDate();
        const month = monthsOfYear[date.getMonth()];
        const year = date.getFullYear();

        const formattedDate = `${dayOfWeek},  ${dayOfMonth} ${month}, năm ${year}`;
        setDateView(formattedDate);
    };
    const [TabLichHen, setTabLichHen] = useState('Tuần');
    const handleChangeTab = (event: SelectChangeEvent<string>) => {
        const newValue = event.target.value as string;
        setTabLichHen(newValue);

        if (newValue === 'Tuần') {
            Cookies.set('Tab-lich-hen', 'Tuần', { expires: 7 });
        } else if (newValue === 'Ngày') {
            Cookies.set('Tab-lich-hen', 'Ngày');
        } else if (newValue === 'Tháng') {
            Cookies.set('Tab-lich-hen', 'Tháng');
        }
    };
    useEffect(() => {
        const CheckTab = Cookies.get('Tab-lich-hen');
        if (CheckTab === 'Tuần') {
            setTabLichHen('Tuần');
        } else if (CheckTab === 'Ngày') {
            setTabLichHen('Ngày');
        } else if (CheckTab === 'Tháng') {
            setTabLichHen('Tháng');
        } else {
            undefined;
        }
    }, []);
    return (
        <Box
            sx={{
                paddingLeft: '2.2222222222222223vw',
                paddingRight: '2.2222222222222223vw',
                paddingTop: '1.5277777777777777vw'
            }}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid #E6E1E6',
                    paddingBottom: '1.5277777777777777vw'
                }}>
                <Typography
                    marginTop="4px"
                    color="#0C050A"
                    fontSize="16px"
                    variant="h1"
                    fontWeight="700">
                    Lịch hẹn
                </Typography>
                <Box
                    sx={{
                        '& button': {
                            minWidth: 'unset'
                        },
                        display: 'flex',
                        gap: '8px'
                    }}>
                    <Button
                        variant="outlined"
                        className="btn-outline-hover"
                        sx={{ bgcolor: '#fff!important', paddingX: '8px' }}>
                        <SettingIcon />
                    </Button>
                    <Button
                        startIcon={<AddIcon />}
                        variant="outlined"
                        className="btn-outline-hover"
                        sx={{
                            bgcolor: '#fff!important',
                            color: '#666466',
                            '& svg': {
                                filter: ' brightness(0) saturate(100%) invert(39%) sepia(6%) saturate(131%) hue-rotate(251deg) brightness(95%) contrast(85%)'
                            }
                        }}>
                        Thêm thời gian chặn
                    </Button>
                    <Button
                        startIcon={<AddIcon />}
                        variant="contained"
                        className="btn-container-hover"
                        sx={{ bgcolor: '#7C3367' }}>
                        Thêm cuộc hẹn
                    </Button>
                </Box>
            </Box>
            <Grid
                container
                justifyContent="space-between"
                alignItems="center"
                sx={{ paddingTop: '1.5277777777777777vw', marginBottom: '10px' }}>
                <Grid item>
                    <Select
                        defaultValue="Tất cả nhân viên"
                        size="small"
                        sx={{
                            bgcolor: '#fff',
                            '& .MuiSelect-select': { paddingY: '5.5px' },
                            fontSize: '14px'
                        }}>
                        <MenuItem value="Tất cả nhân viên">Tất cả nhân viên</MenuItem>
                        <MenuItem value="Đinh Tuấn Tài">Đinh Tuấn Tài</MenuItem>
                        <MenuItem value="Hả cái gì vậy ?">Hả cái gì vậy ?</MenuItem>
                        <MenuItem value="My sún">My sún</MenuItem>
                    </Select>
                </Grid>
                <Grid item>
                    <Box
                        display="flex"
                        sx={{
                            '& button:not(.btn-to-day)': {
                                minWidth: 'unset',
                                borderColor: '#E6E1E6',
                                bgcolor: '#fff!important',
                                px: '7px!important'
                            },
                            '& svg': {
                                color: '#666466!important'
                            },
                            alignItems: 'center'
                        }}>
                        <Button
                            onClick={handlePreviousWeek}
                            variant="outlined"
                            sx={{ mr: '16px' }}
                            className="btn-outline-hover">
                            <ChevronLeftIcon />
                        </Button>
                        <Button
                            className="btn-to-day"
                            onClick={toDayClick}
                            variant="text"
                            sx={{
                                color: '#7C3367!important',
                                fontSize: '16px!important',
                                textTransform: 'unset!important',
                                bgcolor: 'transparent!important',
                                fontWeight: '400',
                                paddingX: '0',
                                pb: '10px',
                                mr: '20px'
                            }}>
                            Hôm nay
                        </Button>
                        <Typography variant="h3" color="#333233" fontSize="16px" fontWeight="700">
                            {dateView}
                        </Typography>
                        <Button
                            onClick={handleNextWeek}
                            variant="outlined"
                            sx={{ ml: '16px' }}
                            className="btn-outline-hover">
                            <ChevronRightIcon />
                        </Button>
                    </Box>
                </Grid>
                <Grid item sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ButtonGroup variant="outlined" sx={{ height: '32px' }}>
                        <Button className="btn-outline-hover" sx={{ marginRight: '1px' }}>
                            <ShapeIcon />
                        </Button>
                        <Button className="btn-outline-hover">
                            <ShapeIcon2 />
                        </Button>
                    </ButtonGroup>
                    <Select
                        size="small"
                        value={TabLichHen}
                        onChange={handleChangeTab}
                        sx={{
                            bgcolor: '#fff',
                            '& .MuiSelect-select': { paddingY: '5.5px' },
                            fontSize: '14px'
                        }}>
                        <MenuItem value="Tuần">Tuần</MenuItem>
                        <MenuItem value="Ngày">Ngày</MenuItem>
                        <MenuItem value="Tháng">Tháng</MenuItem>
                    </Select>
                    <Select
                        defaultValue="Dịch vụ"
                        size="small"
                        sx={{
                            bgcolor: '#fff',
                            '& .MuiSelect-select': { paddingY: '5.5px' },
                            fontSize: '14px'
                        }}>
                        <MenuItem value="Dịch vụ">Dịch vụ</MenuItem>
                        <MenuItem value="Cắt tóc">Cắt tóc</MenuItem>
                        <MenuItem value="Uốn">Uốn</MenuItem>
                    </Select>
                </Grid>
            </Grid>
            {TabLichHen === 'Tuần' ? (
                <TabWeek dateQuery={selectedDate} data={data} />
            ) : TabLichHen === 'Ngày' ? (
                <TabDay />
            ) : TabLichHen === 'Tháng' ? (
                <TabMonth />
            ) : undefined}
        </Box>
    );
};
export default LichHen;
