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
    Typography,
    Avatar
} from '@mui/material';
import AvatarDemo from '../../../images/xinh.png';
const TabDay: React.FC = () => {
    const NhanViens = [
        {
            name: 'Tài Đinh',
            position: 'Kỹ thuật',
            avatar: AvatarDemo
        },
        {
            name: 'Trang Nguyễn',
            position: 'Ý tưởng',
            Avatar: AvatarDemo
        },
        {
            name: 'Tài Đinh',
            position: 'Kỹ thuật',
            avatar: AvatarDemo
        },
        {
            name: 'Trang Nguyễn',
            position: 'Ý tưởng',
            Avatar: AvatarDemo
        },
        {
            name: 'Tài Đinh',
            position: 'Kỹ thuật',
            avatar: AvatarDemo
        },
        {
            name: 'Trang Nguyễn',
            position: 'Ý tưởng',
            Avatar: AvatarDemo
        },
        {
            name: 'Trang Nguyễn',
            position: 'Ý tưởng',
            Avatar: AvatarDemo
        },
        {
            name: 'Trang Nguyễn',
            position: 'Ý tưởng',
            Avatar: AvatarDemo
        },
        {
            name: 'Trang Nguyễn',
            position: 'Ý tưởng',
            Avatar: AvatarDemo
        },
        {
            name: 'Trang Nguyễn',
            position: 'Ý tưởng',
            Avatar: AvatarDemo
        }
    ];
    const Clients = [
        {
            startTime: '10:06',
            endTime: '15:09',
            name: 'Trang Nguyễn',
            service: 'Cắt móng',
            color: '#50CD89'
        },
        {
            startTime: '9:06',
            endTime: '13:09',
            name: 'Gà trống',
            service: 'Cắt móng',
            color: '#009EF7'
        },
        {
            startTime: '10:06',
            endTime: '12:09',
            name: 'Tài Đinh',
            service: 'Cắt móng',
            color: '#50CD89'
        }
    ];
    const NhanViens2 = NhanViens;
    const Mang2Chieu: any[][] = Array(7)
        .fill([])
        .map(() => []);
    Clients.map((item) => {
        const dateIndex = NhanViens2.findIndex((item) => item.name === item.name);
        if (dateIndex !== -1) {
            Mang2Chieu[dateIndex] = [...Mang2Chieu[dateIndex], item];
        }
    });
    useEffect(() => {
        const htmlElement = document.querySelector('html');
        if (htmlElement) {
            htmlElement.style.overflow = 'hidden';
        }
        return () => {
            if (htmlElement) {
                htmlElement.style.overflow = 'unset';
            }
        };
    }, []);
    return (
        <Box>
            <TableContainer sx={{ maxHeight: 'calc(95vh - 200px)' }}>
                <Table sx={{ width: '100%', overflow: 'auto' }}>
                    <TableHead>
                        <TableRow
                            sx={{ whiteSpace: 'nowrap', overflow: 'auto', overflowY: 'hidden' }}>
                            <TableCell sx={{ opacity: '0', pointerEvent: 'none' }}>
                                <Box>hi</Box>
                            </TableCell>
                            {NhanViens.map((item, index) => (
                                <TableCell key={index}>
                                    <Box sx={{ display: 'flex', gap: '8px' }}>
                                        <Box>
                                            <Box>
                                                <Avatar src={item.avatar} alt={item.name} />
                                            </Box>
                                        </Box>
                                        <Box>
                                            <Typography
                                                variant="body1"
                                                color="#333F48"
                                                fontWeight="700">
                                                {item.name}
                                            </Typography>
                                            <Typography
                                                variant="body1"
                                                color="#70797F"
                                                fontSize="12px">
                                                {item.position}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody
                        sx={{
                            '& .MuiTableCell-root:not(:first-child)': {
                                borderLeft: '1px solid  rgba(224, 224, 224, 1)'
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
                                    {NhanViens2.map((item1, dateIndex) => {
                                        const matchingData = Clients.filter((item: any) => {
                                            item.name === item1.name &&
                                                parseInt(item.startTime.split(':')[0], 10) === hour;
                                        });

                                        return (
                                            <TableCell
                                                key={dateIndex}
                                                sx={{
                                                    padding: '4px',
                                                    position: 'relative',
                                                    width: `${100 / NhanViens2.length}%`
                                                }}>
                                                <Box>
                                                    {matchingData.map(
                                                        (item: any, itemIndex: number) => {
                                                            console.log(item.startTime);
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
                                                            console.log(startTimeHours);
                                                            const durationHours =
                                                                endTimeHours - startTimeHours;
                                                            const durationMinutes =
                                                                endTimeMinutes - startTimeMinutes;

                                                            const duration =
                                                                durationHours * 60 +
                                                                durationMinutes;
                                                            const cellHeight = `${
                                                                duration * 1.25
                                                            }px`;

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
                                                                        {item.name}
                                                                    </Typography>
                                                                    <Typography
                                                                        color={item.color}
                                                                        variant="body1"
                                                                        fontSize="12px">
                                                                        {item.service}
                                                                    </Typography>
                                                                </Box>
                                                            );
                                                        }
                                                    )}
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
export default TabDay;
