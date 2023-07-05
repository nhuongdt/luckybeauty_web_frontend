import { useState, useEffect } from 'react';
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
const TabWeek: React.FC = () => {
    const [weekDates, setWeekDates] = useState<any[]>([]);
    useEffect(() => {
        getWeekDate(new Date());
        weekDates.findIndex((day) => {
            console.log(day);
        });
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
            startTime: '8:00',
            endTime: '9:00',
            client: 'Đinh Tuấn Tài 5',
            employee: 'Tài Đinh Tuấn',
            service: 'Cắt tóc, uốn phồng',
            color: '#50CD89',
            date: 'Thứ năm'
        },
        {
            startTime: '8:00',
            endTime: '9:00',
            client: 'Đinh Tuấn Tài',
            employee: 'Tài Đinh Tuấn',
            service: 'Cắt tóc, uốn phồng',
            color: '#50CD89',
            date: 'Thứ sáu'
        },
        {
            startTime: '8:00',
            endTime: '9:00',
            client: 'Đinh Tuấn Tài',
            employee: 'Tài Đinh Tuấn',
            service: 'Cắt tóc, uốn phồng',
            color: '#50CD89',
            date: 'Thứ tư'
        },
        {
            startTime: '8:00',
            endTime: '9:00',
            client: 'Đinh Tuấn Tài',
            employee: 'Tài Đinh Tuấn',
            service: 'Cắt tóc, uốn phồng',
            color: '#50CD89',
            date: 'Thứ hai'
        },
        {
            startTime: '8:00',
            endTime: '9:00',
            client: 'Đinh Tuấn Tài',
            employee: 'Tài Đinh Tuấn',
            service: 'Cắt tóc, uốn phồng',
            color: '#50CD89',
            date: 'Thứ ba'
        },
        {
            startTime: '8:00',
            endTime: '9:00',
            client: 'Đinh Tuấn Tài',
            employee: 'Tài Đinh Tuấn',
            service: 'Cắt tóc, uốn phồng',
            color: '#50CD89',
            date: 'Chủ nhật'
        },
        {
            startTime: '8:00',
            endTime: '9:00',
            client: 'Đinh Tuấn Tài',
            employee: 'Tài Đinh Tuấn',
            service: 'Cắt tóc, uốn phồng',
            color: '#50CD89',
            date: 'Thứ ba'
        }
    ];
    return (
        <Box>
            <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                <TableHead>
                    <TableRow>
                        {weekDates.map((date, index) => (
                            <TableCell key={index} sx={{ color: '#999699' }}>
                                {date}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody
                    sx={{
                        '& .MuiTableCell-body:not(:last-child)': {
                            borderLeft: '1px solid rgba(224, 224, 224, 1)'
                        },
                        '& .MuiTableCell-body:last-child': {
                            borderRight: '1px solid rgba(224, 224, 224, 1)'
                        }
                    }}>
                    {/* <TableRow>
                        {Data.map((item, index) => (
                            <TableCell key={index} sx={{ padding: '4px' }}>
                                {item === null ? (
                                    <Box>hi</Box>
                                ) : (
                                    <Box
                                        bgcolor={item.color + '1a'}
                                        title={'Nhân viên thực hiện :' + item.employee}
                                        padding="8px 8px 16px 8px"
                                        borderRadius="4px"
                                        borderLeft={`6px solid ${item.color}`}>
                                        <Box>
                                            <Typography
                                                variant="body1"
                                                color={item.color}
                                                fontSize="12px">
                                                {item.startTime + ' - ' + item.endTime}
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
                                )}
                            </TableCell>
                        ))}
                    </TableRow> */}
                    <TableRow>
                        {Data.map((item, index) => {
                            const dayIndex = weekDates.findIndex((day) => day === item.date);

                            if (dayIndex !== -1) {
                                return (
                                    <>
                                        {Array(dayIndex)
                                            .fill(null)
                                            .map((_, idx) => (
                                                <TableCell key={`empty-${idx}`}></TableCell>
                                            ))}
                                        <TableCell key={index}>
                                            {/* Hiển thị nội dung tương ứng */}
                                            <div>
                                                <span>
                                                    {item.startTime} - {item.endTime}
                                                </span>
                                                <span>{item.client}</span>
                                                <span>{item.employee}</span>
                                                <span>{item.service}</span>
                                            </div>
                                        </TableCell>
                                    </>
                                );
                            }
                            return null;
                        })}
                    </TableRow>
                </TableBody>
            </TableContainer>
        </Box>
    );
};
export default TabWeek;
