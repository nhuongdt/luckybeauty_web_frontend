import React, { useState, useEffect } from 'react';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography
} from '@mui/material';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
const TabWeek: React.FC = () => {
    const [weekDates, setWeekDates] = useState<any[]>([]);

    useEffect(() => {
        getWeekDate(new Date());
    }, []);
    const getWeekDate = (dateCurrent: Date) => {
        const firstDayOfWeek = new Date(
            dateCurrent.setDate(dateCurrent.getDate() - dateCurrent.getDay() + 1)
        );

        const dates = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(firstDayOfWeek);
            date.setDate(date.getDate() + i);
            const formattedDate = formatDate(date);
            dates.push(formattedDate);
        }

        setWeekDates(dates);
    };
    const formatDate = (date: Date): JSX.Element => {
        const day = date.toLocaleDateString('vi', { weekday: 'long' });
        const month = date.toLocaleDateString('vi', { month: 'long' });
        const dayOfMonth = date.getDate();
        return (
            <>
                <Box sx={{ fontWeight: '400', fontSize: '12px' }}>{day}</Box>
                <Box sx={{ fontSize: '18px', color: '#333233', mt: '8px' }}>{dayOfMonth}</Box>
            </>
        );
    };

    const Data = [
        {
            startTime: format(new Date().setHours(7), 'HH:mm a'),
            endTime: format(new Date().setHours(8), 'HH:mm a'),
            client: 'Đinh Tuấn Tài 5',
            employee: 'Tài Đinh Tuấn',
            service: 'Cắt tóc, uốn phồng',
            color: '#F1416C',
            date: 'Thứ năm'
        },
        {
            startTime: format(new Date().setHours(8, 10), 'HH:mm a'),
            endTime: format(new Date().setHours(9, 40), 'HH:mm a'),
            client: 'Đinh Tuấn Tài 7',
            employee: 'Tài Đinh Tuấn',
            service: 'Cắt tóc, uốn phồng',
            color: '#50CD89',
            date: 'Thứ bảy'
        },
        {
            startTime: format(new Date().setHours(9, 40), 'HH:mm a'),
            endTime: format(new Date().setHours(1, 5), 'HH:mm p'),
            client: 'Đinh Tuấn Tài 4',
            employee: 'Tài Đinh Tuấn',
            service: 'Cắt tóc, uốn phồng',
            color: '#FF9900',
            date: 'Thứ tư'
        },
        {
            startTime: format(new Date().setHours(7), 'HH:mm a'),
            endTime: format(new Date().setHours(9, 30), 'HH:mm a'),
            client: 'Đinh Tuấn Tài 2',
            employee: 'Tài Đinh Tuấn',
            service: 'Cắt tóc, uốn phồng',
            color: '#50CD89',
            date: 'Thứ hai'
        },
        {
            startTime: format(new Date().setHours(11, 30), 'HH:mm a'),
            endTime: format(new Date().setHours(12), 'HH:mm a'),
            client: 'Đinh Tuấn Tài 3',
            employee: 'Tài Đinh Tuấn',
            service: 'Cắt tóc, uốn phồng',
            color: '#009EF7',
            date: 'Thứ ba'
        },
        {
            startTime: format(new Date().setHours(9, 50), 'HH:mm a', { locale: vi }),
            endTime: format(new Date().setHours(12, 30), 'HH:mm a'),
            client: 'Đinh Tuấn Tài cn',
            employee: 'Tài Đinh Tuấn',
            service: 'Cắt tóc, uốn phồng',
            color: '#009EF7',
            date: 'Chủ nhật'
        },
        {
            startTime: format(new Date().setHours(9, 30), 'HH:mm a'),
            endTime: format(new Date().setHours(12, 30), 'HH:mm p'),
            client: 'Đinh Tuấn Tài 6',
            employee: 'Tài Đinh Tuấn',
            service: 'Cắt tóc, uốn phồng',
            color: '#50CD89',
            date: 'Thứ sáu'
        },

        {
            startTime: format(new Date().setHours(9, 30), 'HH:mm a', { locale: vi }),
            endTime: format(new Date().setHours(12), 'HH:mm p', { locale: vi }),
            client: 'Đinh Tuấn Tài 6',
            employee: 'Tài Đinh Tuấn',
            service: 'Cắt tóc, uốn phồng',
            color: '#50CD89',
            date: 'Thứ sáu'
        },
        {
            startTime: format(new Date().setHours(7, 17), 'HH:mm p', { locale: vi }),
            endTime: format(new Date().setHours(8), 'HH:mm p', { locale: vi }),
            client: 'Đinh Tuấn Tài 6.2',
            employee: 'Tài Đinh Tuấ',
            service: 'Cắt tóc, uốn phồng',
            color: '#50CD89',
            date: 'Thứ sáu'
        },
        {
            startTime: format(new Date().setHours(7, 38), 'HH:mm a', { locale: vi }),
            endTime: format(new Date().setHours(9, 50), 'HH:mm p', { locale: vi }),
            client: 'Đinh Tuấn Tài 6.3',
            employee: 'Tài Đinh Tuấn',
            service: 'Cắt tóc, uốn phồng',
            color: '#50CD89',
            date: 'Thứ sáu'
        }
    ];
    const weekDates2 = ['Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy', 'Chủ nhật'];
    // Tạo mảng 2 chiều để lưu trữ dữ liệu cho mỗi ngày trong tuần
    const weekData: any[][] = Array(7)
        .fill([])
        .map(() => []);

    // Đưa dữ liệu vào mảng 2 chiều theo ngày
    Data.map((item) => {
        const dateIndex = weekDates2.findIndex((date) => date === item.date);
        if (dateIndex !== -1) {
            weekData[dateIndex] = [...weekData[dateIndex], item];
        }
    });

    return (
        <Box>
            <TableContainer
                component={Paper}
                sx={{ boxShadow: 'none', width: '100%', paddingRight: '40px' }}>
                <Table sx={{ width: '100%' }}>
                    <TableHead component="div" sx={{ width: '100%' }}>
                        <TableRow>
                            <TableCell
                                sx={{
                                    opacity: '0',
                                    pointerEvents: 'none',
                                    borderBottom: '0',
                                    width: '70px'
                                }}>
                                <Box>00:00</Box>
                            </TableCell>
                            {weekDates.map((date, index) => (
                                <TableCell
                                    colSpan={1}
                                    key={index}
                                    sx={{
                                        color: '#999699'
                                    }}>
                                    {date}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody
                        component="div"
                        sx={{
                            '& .MuiTableCell-body:not(:first-child)': {
                                borderLeft: '1px solid rgba(224, 224, 224, 1)'
                            },
                            '& .MuiTableCell-body:last-child': {
                                borderRight: '1px solid rgba(224, 224, 224, 1)'
                            }
                        }}>
                        {Array.from({ length: 14 }, (_, index) => {
                            const hour = index + 7; // Giờ bắt đầu từ 7h sáng (7 -> 20)
                            const timeLabel = hour.toString().padStart(2, '0') + ':00'; // Định dạng nhãn thời gian

                            return (
                                <TableRow key={index}>
                                    <TableCell
                                        sx={{
                                            color: '#999699',
                                            fontSize: '12px',
                                            verticalAlign: 'top',
                                            paddingTop: '8px',
                                            paddingBottom: '50px',
                                            textAlign: 'right',
                                            border: '0',
                                            width: '70px'
                                        }}>
                                        {timeLabel}
                                    </TableCell>
                                    {weekDates2.map((date, dateIndex) => {
                                        const matchingData = Data.filter(
                                            (item) =>
                                                item.date === date &&
                                                parseInt(item.startTime.split(':')[0], 10) === hour
                                        );

                                        return (
                                            <TableCell
                                                key={dateIndex}
                                                sx={{
                                                    padding: '4px',
                                                    position: 'relative',
                                                    width: `${100 / weekDates2.length}%`
                                                }}>
                                                <Box>
                                                    {matchingData.map((item, itemIndex) => {
                                                        const startTimeHours = parseInt(
                                                            item.startTime.split(':')[0],
                                                            10
                                                        );
                                                        const startTimeMinutes = parseInt(
                                                            item.startTime.split(':')[1],
                                                            10
                                                        );
                                                        const endTimeHours = parseInt(
                                                            item.endTime.split(':')[0],
                                                            10
                                                        );
                                                        const endTimeMinutes = parseInt(
                                                            item.endTime.split(':')[1],
                                                            10
                                                        );

                                                        // console.log(
                                                        //     endTimeHours +
                                                        //         'giờ' +
                                                        //         ' , ' +
                                                        //         endTimeMinutes +
                                                        //         'phút'
                                                        // );
                                                        const formattedStartTime = format(
                                                            new Date().setHours(
                                                                startTimeHours,
                                                                startTimeMinutes
                                                            ),
                                                            'HH:mm'
                                                        );
                                                        const formattedEndTime = format(
                                                            new Date().setHours(
                                                                endTimeHours,
                                                                endTimeMinutes
                                                            ),
                                                            'HH:mm'
                                                        );
                                                        console.log(
                                                            formattedStartTime +
                                                                ' - ' +
                                                                formattedEndTime
                                                        );
                                                        const durationHours =
                                                            endTimeHours - startTimeHours;
                                                        const durationMinutes =
                                                            endTimeMinutes - startTimeMinutes;

                                                        const duration =
                                                            durationHours * 60 + durationMinutes;
                                                        const cellHeight = `${duration * 1.25}px`;

                                                        const startMinutesFrom7AM =
                                                            (startTimeHours - 7) * 60 +
                                                            startTimeMinutes;
                                                        const topPosition = `${
                                                            startMinutesFrom7AM * 1.25
                                                        }px`;

                                                        return (
                                                            <Box
                                                                key={itemIndex}
                                                                bgcolor={item.color + '1a'}
                                                                title={
                                                                    'Nhân viên thực hiện: ' +
                                                                    item.employee
                                                                }
                                                                position="absolute"
                                                                height={cellHeight}
                                                                whiteSpace="nowrap"
                                                                overflow="hidden"
                                                                zIndex="1"
                                                                padding="8px 8px 16px 8px"
                                                                borderRadius="4px"
                                                                borderLeft={`6px solid ${item.color}`}
                                                                width={`${
                                                                    100 / matchingData.length
                                                                }%`}
                                                                top={topPosition}
                                                                left={`${
                                                                    (itemIndex /
                                                                        matchingData.length) *
                                                                    100
                                                                }%`}>
                                                                <Box>
                                                                    <Typography
                                                                        variant="body1"
                                                                        color={item.color}
                                                                        fontSize="12px">
                                                                        {item.startTime +
                                                                            ' - ' +
                                                                            item.endTime}
                                                                    </Typography>
                                                                </Box>
                                                                <Typography
                                                                    variant="body1"
                                                                    color={item.color}
                                                                    fontWeight="700"
                                                                    fontSize="12px">
                                                                    {item.client}
                                                                </Typography>
                                                                <Typography
                                                                    color={item.color}
                                                                    variant="body1"
                                                                    fontSize="12px">
                                                                    {item.service}
                                                                </Typography>
                                                            </Box>
                                                        );
                                                    })}
                                                </Box>
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};
export default TabWeek;
