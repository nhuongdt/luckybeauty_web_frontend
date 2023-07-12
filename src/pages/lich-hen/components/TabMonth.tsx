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
const TabMonth: React.FC = () => {
    const currentMonth = new Date();
    const startDate = startOfMonth(currentMonth);
    const endDate = endOfMonth(currentMonth);
    const weeksInMonth = eachWeekOfInterval({ start: startDate, end: endDate });

    const weekDays = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];

    return (
        <TableContainer sx={{ bgcolor: '#fff', padding: '24px', borderRadius: '8px' }}>
            <Table>
                <TableHead sx={{ bgcolor: '#F2F2F2' }}>
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
                            {weekDays.map((_, index) => {
                                const currentDate = new Date(weekStartDate);
                                currentDate.setDate(weekStartDate.getDate() + index + 1);
                                return (
                                    <TableCell
                                        key={currentDate.getTime()}
                                        sx={{
                                            padding: '0',
                                            border: '0',
                                            height: '190px',
                                            width: 1 / weekDays.length
                                        }}>
                                        <Box
                                            sx={{
                                                fontSize: '14px',
                                                color: '#999699',
                                                height: '100%',
                                                display: 'flex',
                                                width: '100%',
                                                justifyContent: 'end',
                                                pointerEvents: 'none',
                                                padding: '8px'
                                            }}>
                                            {format(currentDate, 'd')}
                                        </Box>
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
