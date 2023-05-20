import * as React from 'react';
import { Box, Grid, Typography, Avatar } from '@mui/material';
import clockIcon from '../../images/clock.svg';
import avatar from '../../images/avatar.png';
const CheckInNew: React.FC = () => {
    const Clients = [
        {
            avatar: avatar,
            name: 'Đinh Tuấn Tài',
            phone: '0911290476',
            point: 250,
            date: '12/04/2023',
            hour: '9h00',
            state: 'Đang chờ'
        },
        {
            avatar: avatar,
            name: 'Đinh Tuấn Tài',
            phone: '0911290476',
            point: 250,
            date: '12/04/2023',
            hour: '9h00',
            state: 'Đang chờ'
        },
        {
            avatar: avatar,
            name: 'Đinh Tuấn Tài',
            phone: '0911290476',
            point: 250,
            date: '12/04/2023',
            hour: '9h00',
            state: 'Đang chờ'
        },
        {
            avatar: avatar,
            name: 'Đinh Tuấn Tài',
            phone: '0911290476',
            point: 250,
            date: '12/04/2023',
            hour: '9h00',
            state: 'Đang chờ'
        },
        {
            avatar: avatar,
            name: 'Đinh Tuấn Tài',
            phone: '0911290476',
            point: 250,
            date: '12/04/2023',
            hour: '9h00',
            state: 'Đang chờ'
        },
        {
            avatar: avatar,
            name: 'Đinh Tuấn Tài',
            phone: '0911290476',
            point: 250,
            date: '12/04/2023',
            hour: '9h00',
            state: 'Đang chờ'
        },
        {
            avatar: avatar,
            name: 'Đinh Tuấn Tài',
            phone: '0911290476',
            point: 250,
            date: '12/04/2023',
            hour: '9h00',
            state: 'Đang chờ'
        }
    ];
    return (
        <Box width="100%">
            <Grid container spacing={2} width="100%" margin="0">
                {Clients.map((Client) => (
                    <Grid item lg={3} sm={4} xs={6}>
                        <div
                            style={{
                                boxShadow: '0px 7px 20px 0px #28293D14',
                                backgroundColor: '#fff',
                                borderRadius: '8px',
                                padding: '24px'
                            }}>
                            <Box display="flex" gap="8px">
                                <Avatar
                                    src={Client.avatar}
                                    alt={Client.name}
                                    sx={{ width: 40, height: 40 }}
                                />
                                <div>
                                    <Typography color="#333233" variant="subtitle1">
                                        {Client.name}
                                    </Typography>
                                    <Typography color="#999699" fontSize="12px">
                                        {Client.phone}
                                    </Typography>
                                </div>
                            </Box>
                            <Box display="flex" gap="8px" marginTop="16px">
                                <Typography fontSize="14px" color="#4C4B4C">
                                    Điểm tích lũy:
                                </Typography>
                                <Typography fontSize="14px" color="#4C4B4C" fontWeight="700">
                                    {Client.point}
                                </Typography>
                            </Box>
                            <Box display="flex" marginTop="16px">
                                <Typography color="#666466" fontSize="14px">
                                    {Client.date}
                                </Typography>
                                <Typography color="#666466" fontSize="14px" marginLeft="13px">
                                    <img src={clockIcon} style={{ marginRight: '5px' }} />
                                    {Client.hour}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    lineHeight="16px"
                                    className="state"
                                    sx={{
                                        padding: '4px 12px ',
                                        borderRadius: '8px',
                                        backgroundColor: '#FFF8DD',
                                        color: '#FFC700',
                                        marginLeft: 'auto'
                                    }}>
                                    {Client.state}
                                </Typography>
                            </Box>
                        </div>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};
export default CheckInNew;
