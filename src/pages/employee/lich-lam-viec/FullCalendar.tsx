import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    Avatar,
    Typography,
    Button,
    Select,
    SelectChangeEvent,
    MenuItem,
    ButtonGroup
} from '@mui/material';
import avatar from '../../../images/avatar.png';
import { ReactComponent as EditIcon } from '../../../images/edit-2.svg';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { ReactComponent as CalendarIcon } from '../../../images/calendar.svg';
import { ReactComponent as ListIcon } from '../../../images/list.svg';
import { ReactComponent as ArrowDown } from '../../../images/arow-down.svg';
import CustomEmployee from './DialogCustom';
import ThemLich from './them_lich_lam_viec';
import Delete from './deleteAlert';
import Edit from './editNhanVien';
const Calendar: React.FC = () => {
    const [weekDates, setWeekDates] = useState<any[]>([]);

    useEffect(() => {
        const today = new Date();
        const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1));

        const dates = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(firstDayOfWeek);
            date.setDate(date.getDate() + i);
            const formattedDate = formatDate(date);
            dates.push(formattedDate);
        }

        setWeekDates(dates);
    }, []);

    const formatDate = (date: Date): JSX.Element => {
        const day = date.toLocaleDateString('vi', { weekday: 'long' });
        const month = date.toLocaleDateString('vi', { month: 'long' });
        const dayOfMonth = date.getDate();
        return (
            <>
                <Box sx={{ fontWeight: '400', fontSize: '12px' }}>{day}</Box>
                <div>
                    {dayOfMonth} {month}
                </div>
            </>
        );
    };

    const datas = [
        {
            name: 'Hà Nguyễn',
            totalTime: '63h',
            avatar: avatar,
            MonDay: '04:00 - 18:00',
            Tuesday: '00:00 - 18:00',
            Wednesday: '10:00 - 18:00',
            Thursday: '19:00 - 18:00',
            Friday: '09:00 - 18:00',
            Saturday: '03:00 - 18:00',
            Sunday: '02:00 - 18:00'
        },
        {
            name: 'Hà Thanh',
            totalTime: '63h',
            avatar: avatar,
            MonDay: '09:00 - 18:00',
            Tuesday: '09:00 - 18:00',
            Wednesday: '09:00 - 18:00',
            Thursday: '09:00 - 18:00',
            Friday: '09:00 - 18:00',
            Saturday: '09:00 - 18:00',
            Sunday: '09:00 - 18:00'
        },
        {
            name: 'Tên gì trông hay ',
            totalTime: '63h',
            avatar: avatar,
            MonDay: '09:00 - 18:00',
            Tuesday: '09:00 - 18:00',
            Wednesday: '09:00 - 18:00',
            Thursday: '09:00 - 18:00',
            Friday: '09:00 - 18:00',
            Saturday: '09:00 - 18:00',
            Sunday: '09:00 - 18:00'
        },
        {
            name: 'Tài',
            totalTime: '63h',
            avatar: avatar,
            MonDay: '09:00 - 17:00',
            Tuesday: '09:00 - 8:00',
            Wednesday: '09:00 - 10:00',
            Thursday: '09:00 - 15:00',
            Friday: '09:00 - 18:00',
            Saturday: '09:00 - 18:00',
            Sunday: '09:00 - 18:00'
        },
        {
            name: 'Tên của ai thế',
            totalTime: '63h',
            avatar: avatar,
            MonDay: '09:00 - 10:00',
            Tuesday: '09:00 - 3:00',
            Wednesday: '09:00 - 18:00',
            Thursday: '09:00 - 8:00',
            Friday: '09:00 - 18:00',
            Saturday: '09:00 - 18:00',
            Sunday: '09:00 - 18:00'
        }
    ];
    const [employ, setEmploy] = useState('');
    const changeEmploy = (event: SelectChangeEvent) => {
        setEmploy(event.target.value);
    };
    const [value, setValue] = useState('');
    const changeValue = (event: SelectChangeEvent) => {
        setValue(event.target.value);
    };

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedId, setSelectedId] = useState('');
    const open = Boolean(anchorEl);
    const handleOpenCustom = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
        setSelectedId(event.currentTarget.className);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const [openDialog, setOpenDialog] = useState(false);
    const handleOpenDialog = () => {
        setOpenDialog(true);
    };
    const handleCloseDialog = () => {
        setOpenDialog(false);
    };
    const [openDelete, setOpenDelete] = useState(false);
    const handleOpenDelete = () => {
        setOpenDelete(true);
    };
    const handleCloseDelete = () => {
        setOpenDelete(false);
    };
    const [openEdit, setOpenEdit] = useState(false);
    const handleOpenEdit = () => {
        setOpenEdit(true);
    };
    const handleCloseEdit = () => {
        setOpenEdit(false);
    };

    const getCurrentDateInVietnamese = (): string => {
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

        const currentDate = new Date();
        const dayOfWeek = daysOfWeek[currentDate.getDay()];
        const dayOfMonth = currentDate.getDate();
        const month = monthsOfYear[currentDate.getMonth()];
        const year = currentDate.getFullYear();

        const formattedDate = `${dayOfWeek},  ${dayOfMonth} ${month}, năm ${year}`;
        return formattedDate;
    };

    return (
        <Box>
            <CustomEmployee
                open={open}
                handleClose={handleClose}
                anchorEl={anchorEl}
                selectedRowId={selectedId}
                handleOpenDelete={handleOpenDelete}
                handleOpenDialog={handleOpenDialog}
                handleCloseDialog={handleCloseDialog}
                handleOpenEdit={handleOpenEdit}
            />
            <Edit open={openEdit} onClose={handleCloseEdit} />
            <Delete open={openDelete} onClose={handleCloseDelete} />
            <ThemLich open={openDialog} onClose={handleCloseDialog} />
            <Box mb="16px" display="flex" justifyContent="space-between">
                <Box>
                    <Select
                        onChange={changeEmploy}
                        value={employ}
                        displayEmpty
                        size="small"
                        sx={{
                            '& svg': {
                                position: 'relative',
                                left: '-10px'
                            },
                            bgcolor: '#fff',
                            '[aria-expanded="true"] ~ svg': {
                                transform: 'rotate(180deg)'
                            }
                        }}
                        IconComponent={() => <ArrowDown />}>
                        <MenuItem value="">Tất cả nhân viên</MenuItem>
                        <MenuItem value="Tài">Đinh Tuấn Tài</MenuItem>
                        <MenuItem value="vân">Đinh Thị vân anh</MenuItem>
                        <MenuItem value="Anh">Đinh Thị Phương Anh</MenuItem>
                        <MenuItem value="Dương">Đinh Tuấn Dương</MenuItem>
                    </Select>
                </Box>
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
                    <Button variant="outlined" sx={{ mr: '16px' }} className="btn-outline-hover">
                        <ChevronLeftIcon />
                    </Button>
                    <Button
                        className="btn-to-day"
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
                        {getCurrentDateInVietnamese()}
                    </Typography>
                    <Button variant="outlined" sx={{ ml: '16px' }} className="btn-outline-hover">
                        <ChevronRightIcon />
                    </Button>
                </Box>
                <Box display="flex" alignItems="center" gap="8px">
                    <ButtonGroup
                        variant="outlined"
                        sx={{
                            '& button': {
                                minWidth: 'unset!important',
                                paddingX: '6px!important',
                                height: '32px',
                                borderColor: '#E6E1E6!important'
                            }
                        }}>
                        <Button className="btn-outline-hover" sx={{ mr: '1px' }}>
                            <CalendarIcon />
                        </Button>
                        <Button className="btn-outline-hover">
                            <ListIcon />
                        </Button>
                    </ButtonGroup>
                    <Select
                        onChange={changeValue}
                        value={value}
                        IconComponent={() => <ArrowDown />}
                        displayEmpty
                        size="small"
                        sx={{
                            '& .MuiSelect-select': {
                                lineHeight: '32px',
                                p: '0',
                                height: '32px',
                                pl: '10px'
                            },
                            bgcolor: '#fff',
                            '& svg': {
                                position: 'relative',
                                left: '-10px',
                                width: '20px',
                                height: '20px'
                            },
                            '[aria-expanded="true"] ~ svg': {
                                transform: 'rotate(180deg)'
                            }
                        }}>
                        <MenuItem value="">Tuần</MenuItem>
                        <MenuItem value="Tháng">Tháng</MenuItem>
                        <MenuItem value="Năm">Năm</MenuItem>
                    </Select>
                </Box>
            </Box>
            <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                <Table>
                    <TableHead>
                        <TableRow
                            sx={{
                                '& .MuiTableCell-root': {
                                    paddingTop: '8px',
                                    paddingLeft: '4px',
                                    paddingRight: '4px'
                                }
                            }}>
                            <TableCell sx={{ border: 'none' }}>Nhân viên</TableCell>
                            {weekDates.map((date, index) => (
                                <TableCell key={index}>{date}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody
                        sx={{
                            '& .custom-time': {
                                fontFamily: 'Roboto',
                                height: '32px',
                                bgcolor: '#F2EBF0',
                                borderRadius: '8px',
                                padding: '8px',
                                fontSize: '12px',
                                color: '#333233'
                            },
                            '& .bodder-inline': {
                                borderInline: '1px solid #E6E1E6',
                                padding: '4px 4px 20px 4px'
                            }
                        }}>
                        {datas.map((item) => (
                            <TableRow key={item.name.replace(/\s/g, '')}>
                                <TableCell sx={{ border: '0!important' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <Avatar
                                            sx={{ width: 32, height: 32 }}
                                            src={item.avatar}
                                            alt={item.name}
                                        />
                                        <Box>
                                            <Typography
                                                fontSize="14px"
                                                color="#4C4B4C"
                                                variant="body1">
                                                {item.name}
                                            </Typography>
                                            <Typography
                                                fontSize="12px"
                                                color="#999699"
                                                variant="body1">
                                                {item.totalTime}
                                            </Typography>
                                        </Box>
                                        <Button
                                            onClick={handleOpenCustom}
                                            variant="text"
                                            sx={{
                                                minWidth: 'unset',
                                                ml: 'auto',
                                                '&:hover svg': {
                                                    filter: 'brightness(0) saturate(100%) invert(23%) sepia(23%) saturate(1797%) hue-rotate(267deg) brightness(103%) contrast(88%)'
                                                }
                                            }}>
                                            <EditIcon />
                                        </Button>
                                    </Box>
                                </TableCell>
                                <TableCell className="bodder-inline">
                                    <Box className="custom-time">{item.MonDay}</Box>
                                </TableCell>
                                <TableCell className="bodder-inline">
                                    <Box className="custom-time">{item.Tuesday}</Box>
                                </TableCell>
                                <TableCell className="bodder-inline">
                                    <Box className="custom-time">{item.Wednesday}</Box>
                                </TableCell>
                                <TableCell className="bodder-inline">
                                    <Box className="custom-time">{item.Thursday}</Box>
                                </TableCell>
                                <TableCell className="bodder-inline">
                                    <Box className="custom-time">{item.Friday}</Box>
                                </TableCell>
                                <TableCell className="bodder-inline">
                                    <Box className="custom-time">{item.Saturday}</Box>
                                </TableCell>
                                <TableCell className="bodder-inline">
                                    <Box className="custom-time">{item.Sunday}</Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default Calendar;
