import * as React from 'react';
import {
    Box,
    Grid,
    Typography,
    Avatar,
    ButtonGroup,
    Button,
    TextField,
    IconButton
} from '@mui/material';
import clockIcon from '../../images/clock.svg';
import avatar from '../../images/avatar.png';
import dotIcon from '../../images/dotssIcon.svg';
import calendar from '../../images/calendar-5.svg';
import addIcon from '../../images/add.svg';
import searchIcon from '../../images/search-normal.svg';
import closeIcon from '../../images/close-square.svg';

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
    const [active, setActive] = React.useState(false);
    const handleToggle = () => {
        setActive(!active);
    };
    return (
        <Box width="100%" marginTop="-34px">
            <Box display="flex" justifyContent="end" paddingRight="24px">
                <Box component="form" className="form-search" marginRight="auto" marginLeft="200px">
                    <TextField
                        sx={{
                            backgroundColor: '#FFFAFF',
                            borderColor: '#CDC9CD!important',
                            borderWidth: '1px!important'
                        }}
                        size="small"
                        className="search-field"
                        variant="outlined"
                        type="search"
                        placeholder="Tìm kiếm"
                        InputProps={{
                            startAdornment: (
                                <IconButton type="submit">
                                    <img src={searchIcon} />
                                </IconButton>
                            )
                        }}
                    />
                </Box>
                <ButtonGroup sx={{ gap: '8px' }}>
                    <Button
                        variant="outlined"
                        size="small"
                        sx={{
                            height: '40px',
                            padding: '10px',
                            borderColor: '#E6E1E6!important',
                            borderRadius: '4px!important',
                            borderRightWidth: '1px!important'
                        }}>
                        <img src={dotIcon} alt="dot" />
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        sx={{
                            borderColor: '#E6E1E6!important',
                            borderWidth: '1px!important',
                            borderRadius: '4px!important'
                        }}>
                        <img src={calendar} alt="calendar" />
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        sx={{
                            borderColor: '#7C3367!important',
                            color: '#4C4B4C',
                            fontSize: '14px',
                            fontWeight: '400',
                            textTransform: 'unset',
                            borderRadius: '4px!important',
                            borderWidth: '1px!important'
                        }}>
                        Dịch vụ
                    </Button>
                    <Button
                        variant="contained"
                        size="small"
                        sx={{
                            backgroundColor: '#7C3367!important',
                            border: 'none',
                            textTransform: 'unset',
                            fontSize: '14px',
                            fontWeight: '400',
                            borderRadius: '4px!important'
                        }}
                        onClick={handleToggle}>
                        <img src={addIcon} style={{ marginRight: '10px' }} />
                        Thêm khách
                    </Button>
                </ButtonGroup>
            </Box>
            <Grid container spacing={3} width="100%" margin="0" paddingRight="24px">
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
            {/* poppup */}
            <Box
                padding="28px 24px"
                component="form"
                className={active ? 'poppup-add_checkin active' : 'poppup-add_checkin'}
                display="flex"
                flexDirection="column">
                <Typography fontWeight="700" variant="h5">
                    Thêm khách hàng checkout
                </Typography>
                <Grid container marginTop="28px" spacing={3}>
                    <Grid item xs={7}>
                        <Typography fontSize="14px" color="#666466">
                            Họ và tên
                        </Typography>
                        <TextField
                            fullWidth
                            type="text"
                            placeholder="Đinh Tuấn Tài"
                            size="small"
                            sx={{
                                fontSize: '16px',
                                color: '#4C4B4C',
                                backgroundColor: '#fff',
                                maxWidth: '600px'
                            }}
                        />
                        <Typography fontSize="14px" color="#666466" marginTop="24px">
                            Số điện thoại
                        </Typography>
                        <TextField
                            fullWidth
                            type="text"
                            placeholder="0911290476"
                            size="small"
                            sx={{
                                fontSize: '16px',
                                color: '#4C4B4C',
                                backgroundColor: '#fff',
                                maxWidth: '600px'
                            }}
                        />
                    </Grid>
                    <Grid item xs={5} display="flex" justifyContent="end">
                        <TextField
                            fullWidth
                            sx={{
                                backgroundColor: '#fff',
                                borderColor: '#CDC9CD!important',
                                borderWidth: '1px!important',
                                maxWidth: '400px'
                            }}
                            size="small"
                            className="search-field"
                            variant="outlined"
                            type="search"
                            placeholder="Tìm kiếm"
                            InputProps={{
                                startAdornment: (
                                    <IconButton type="submit">
                                        <img src={searchIcon} />
                                    </IconButton>
                                )
                            }}
                        />
                    </Grid>
                </Grid>
                <ButtonGroup sx={{ gap: '8px', margin: '44px auto 0 auto' }}>
                    <Button
                        variant="contained"
                        sx={{
                            borderRadius: '4px!important',
                            textTransform: 'unset',
                            fontSize: '12px'
                        }}>
                        Lưu
                    </Button>
                    <Button
                        onClick={handleToggle}
                        variant="outlined"
                        sx={{
                            borderColor: '#965C85!important',
                            borderRadius: '4px!important',
                            textTransform: 'unset',
                            fontSize: '12px',
                            color: '#965C85'
                        }}>
                        Huỷ
                    </Button>
                </ButtonGroup>
                <IconButton
                    onClick={handleToggle}
                    sx={{ position: 'absolute', right: '31px', top: '35px' }}>
                    <img src={closeIcon} />
                </IconButton>
            </Box>
            <div
                onClick={handleToggle}
                className={active ? 'overlay-checkin active' : 'overlay-checkin'}></div>
        </Box>
    );
};
export default CheckInNew;
