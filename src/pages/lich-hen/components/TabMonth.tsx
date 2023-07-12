import React from 'react';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Avatar,
    Menu,
    MenuItem
} from '@mui/material';
import {
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    format,
    eachWeekOfInterval,
    getDay
} from 'date-fns';
import { ReactComponent as ClockBlue } from '../../../images/clock-blue.svg';
import { ReactComponent as ClockPink } from '../../../images/clock-pink.svg';
import { ReactComponent as ClockGreen } from '../../../images/clock-green.svg';
import { ReactComponent as ClockOrange } from '../../../images/clock-orange.svg';
import { ReactComponent as ClockViolet } from '../../../images/clock-violet.svg';
const TabMonth: React.FC = () => {
    const currentMonth = new Date();
    const startDate = startOfMonth(currentMonth);
    const endDate = endOfMonth(currentMonth);
    const weeksInMonth = eachWeekOfInterval({ start: startDate, end: endDate });

    const weekDays = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];
    React.useEffect(() => {
        const HTML = document.documentElement;
        HTML.style.overflowY = 'hidden';

        return () => {
            HTML.style.overflowY = 'auto';
        };
    }, []);
    const color = [
        {
            color: '#009EF7',
            background: '#F1FAFF', //Đang phục vụ
            icon: <ClockBlue />
        },
        {
            color: '#F1416C',
            background: '#FFF5F8', // Huỷ
            icon: <ClockPink />
        },
        {
            color: '#FF9900',
            background: '#FFF8DD', //Chưa xác nhận
            icon: <ClockOrange />
        },
        {
            color: '#50CD89',
            background: '#E8FFF3', //Hoàn thành
            icon: <ClockGreen />
        },
        {
            color: '#7C3367',
            background: '#E5D6E1', // Đã xác nhận
            icon: <ClockViolet />
        }
    ];
    const data = [
        {
            day: 'Thứ 2',
            date: '3',
            client: 'Vy',
            service: 'Cut tok',
            startTime: '6:00',
            color: color[2].color,
            bg: color[2].background
        },
        {
            day: 'Thứ 2',
            date: '3',
            client: 'Quynh',
            service: 'Tẩm quất',
            startTime: '7:00',
            color: color[0].color,
            bg: color[0].background
        },
        {
            day: 'Thứ 2',
            date: '3',
            client: 'Chị Chi',
            service: 'Mát xa',
            startTime: '8:38',
            color: color[1].color,
            bg: color[1].background
        },
        {
            day: 'Thứ 2',
            date: '3',
            client: 'Chị Linh',
            service: 'Cạo gió',
            startTime: '8:38',
            color: color[3].color,
            bg: color[3].background
        },
        {
            day: 'Thứ 7',
            date: '15',
            client: 'Chị Nhì',
            service: 'Gội đầu',
            startTime: '8:38',
            color: color[3].color,
            bg: color[3].background
        },
        {
            day: 'Thứ 6',
            date: '7',
            client: 'Chị Nhường',
            service: 'Sơn móng',
            startTime: '0:38',
            color: color[0].color,
            bg: color[0].background
        }
    ];

    return (
        <TableContainer
            sx={{
                bgcolor: '#fff',
                padding: '24px',

                borderRadius: '8px',
                maxHeight: innerHeight > 768 ? '70vh' : '64vh',
                '&::-webkit-scrollbar': {
                    width: '10px',
                    height: '10px'
                },
                '&::-webkit-scrollbar-track': {
                    borderRadius: '16px'
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'rgba(124, 51, 103, 0.2)',
                    borderRadius: '8px'
                }
            }}>
            <Table>
                <TableHead
                    sx={{
                        bgcolor: '#F2F2F2',
                        position: 'sticky',
                        top: '0',
                        left: '0',
                        zIndex: '5'
                    }}>
                    <TableRow>
                        {weekDays.map((day) => (
                            <TableCell key={day} sx={{ border: '0', textAlign: 'center' }}>
                                {day}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {weeksInMonth.map((weekStartDate) => (
                        <TableRow key={weekStartDate.getTime()}>
                            {weekDays.map((ngay, index) => {
                                const currentDate = new Date(weekStartDate);
                                currentDate.setDate(weekStartDate.getDate() + index + 1);

                                const matchingData = data.filter(
                                    (item: any) =>
                                        item.date === format(currentDate, 'd') && item.day === ngay
                                );
                                return (
                                    <TableCell
                                        key={currentDate.getTime()}
                                        sx={{
                                            padding: '0',
                                            border: '0',
                                            position: 'relative',
                                            height: '190px',
                                            width: 1 / weekDays.length
                                        }}>
                                        <Box
                                            sx={{
                                                fontSize: '14px',
                                                color: '#4C4B4C',
                                                height: '100%',
                                                display: 'flex',
                                                width: '100%',
                                                justifyContent: 'end',
                                                pointerEvents: 'none',
                                                padding: '8px',
                                                position: 'absolute',
                                                top: '0',
                                                left: '0'
                                            }}>
                                            {format(currentDate, 'd')}
                                        </Box>
                                        {Array.isArray(matchingData) && matchingData.length > 0
                                            ? matchingData.map((item: any, itemIndex: number) => (
                                                  <Box
                                                      key={itemIndex}
                                                      sx={{
                                                          bgcolor: item.bg,
                                                          padding: item ? '4px 12px' : '',
                                                          width: 'fit-content',
                                                          borderRadius: '4px',
                                                          marginTop: itemIndex != 0 ? '2px' : '0opx'
                                                      }}>
                                                      {' '}
                                                      <Typography
                                                          variant="body1"
                                                          fontSize="12px"
                                                          whiteSpace="nowrap"
                                                          color={item.color}>
                                                          {' '}
                                                          <b> {item.startTime} </b>
                                                          {item.service + ':'}
                                                          {item.client}
                                                      </Typography>
                                                  </Box>
                                              ))
                                            : undefined}
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
export default TabMonth;
