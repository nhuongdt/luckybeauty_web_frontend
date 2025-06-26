/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { formatDistanceToNow } from 'date-fns';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import KeyboardDoubleArrowRightOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowRightOutlined';

import {
    Grid,
    Box,
    Typography,
    Select,
    MenuItem,
    Menu,
    Button,
    Badge,
    Avatar,
    IconButton,
    Checkbox,
    FormGroup,
    FormControlLabel,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Tooltip,
    Switch,
    Stack,
    Toolbar,
    Card
} from '@mui/material';
import './header.css';
import LuckybeautyLogo from '../../images/luckybeautylogo.png';
// import { ReactComponent as ToggleIcon } from '../../images/btntoggle.svg';
//import { ReactComponent as SuportIcon } from '../../images/messageChat.svg';
import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NotificationIcon from '../../images/notification.svg';
import Cookies from 'js-cookie';
import { SuggestChiNhanhDto } from '../../services/suggests/dto/SuggestChiNhanhDto';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { ReactComponent as LocationIcon } from '../../images/location.svg';
import { ReactComponent as ProfileIcon } from '../../images/profile-circle.svg';
import { ReactComponent as SettingIcon } from '../../images/settingIcon.svg';
import { ReactComponent as LogoutIcon } from '../../images/logoutInner.svg';
import { ReactComponent as BackIcon } from '../../images/back_linear_icon.svg';
import { ReactComponent as RestartIcon } from '../../images/restart_alt.svg';
import { ReactComponent as CloseIcon } from '../../images/close-square.svg';
import { ReactComponent as ChatIcon } from '../../images/icons/chat_message.svg';
import useWindowWidth from '../StateWidth';
import notificationStore from '../../stores/notificationStore';
import { observer } from 'mobx-react';
import NotificationSeverity from '../../enum/NotificationSeverity';
import UserNotificationState from '../../enum/UserNotificationState';
import NotificationService from '../../services/notification/NotificationService';
import utils from '../../utils/utils';
import suggestStore from '../../stores/suggestStore';
import impersonationService, { Impersonation } from '../../services/impersonation/impersonationService';
import NotificationStore from '../../stores/notificationStore';
import { useColorMode } from '../../stores/data-context/ThemContext';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}
const drawerWidth = 240;
const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open'
})<AppBarProps>(({ theme }) => ({
    zIndex: theme.zIndex.drawer + 1,
    '&.MuiAppBar-root': {
        boxShadow: 'none'
    },
    border: `1px solid ${theme.palette.grey[300]}`,
    backgroundColor: theme.palette.background.default,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
    }),
    variants: [
        {
            props: ({ open }) => open,
            style: {
                marginLeft: drawerWidth,
                width: `calc(100% - ${drawerWidth}px)`,

                transition: theme.transitions.create(['width', 'margin'], {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.enteringScreen
                })
            }
        }
    ]
}));
//import TawkMessenger from '../../lib/tawk_chat';
interface HeaderProps {
    collapsed: boolean;
    toggle: () => void;
    onClick: () => void;
    isChildHovered: boolean;
    CookieSidebar: boolean;
    handleChangeChiNhanh: (currentChiNhanh: SuggestChiNhanhDto) => void;
    notificationStore: NotificationStore;
}

const Header: React.FC<HeaderProps> = (
    { collapsed, toggle, isChildHovered, handleChangeChiNhanh, notificationStore },
    props: HeaderProps
) => {
    //const tawkChatRef = React.useRef<any>();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [ThongBaoAnchorEl, setThongBaoAnchorEl] = React.useState<null | HTMLElement>(null);
    const [settingThongBao, setSettingThongBao] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const openThongBao = Boolean(ThongBaoAnchorEl);
    const openSettingThongBao = Boolean(settingThongBao);
    const [isLightMode, setIsLightMode] = useState(true);
    const { toggleColorMode, mode } = useColorMode();

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleThongBaoClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setThongBaoAnchorEl(event.currentTarget);
    };
    const handleSettingClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setSettingThongBao(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleCloseThongBao = () => {
        notificationStore.skipCountNotification = 0;
        notificationStore.maxResultCountNotification = 5;
        notificationStore.GetUserNotification();
        setThongBaoAnchorEl(null);
    };
    const CloseSettingThongBao = () => {
        setSettingThongBao(null);
    };
    const navigate = useNavigate();
    const [chiNhanhs, setListChiNhanh] = useState([] as SuggestChiNhanhDto[]);
    const [currentChiNhanh, setCurrentChiNhanh] = useState('');
    useEffect(() => {
        //getNotification();
        notificationStore.GetUserNotification();
    }, []);

    useEffect(() => {
        // Call API to get list of permissions here

        const getChiNhanhs = async () => {
            if (Cookies.get('Abp.AuthToken') !== null && Cookies.get('Abp.AuthToken') !== undefined) {
                await suggestStore.GetChiNhanhByUser();
                const listChiNhanh = suggestStore?.suggestChiNhanh_byUserLogin;
                if (listChiNhanh !== undefined && listChiNhanh != null && listChiNhanh.length > 0) {
                    // mobx return Proxy object --> convert to array
                    setListChiNhanh(listChiNhanh);

                    const idChiNhanhMacDinh = Cookies.get('idChiNhanhMacDinh');
                    let idChiNhanh = Cookies.get('IdChiNhanh')?.toString() ?? '';
                    let tenChiNhanh = '';
                    const remember = Cookies.get('isRememberMe');
                    if (utils.checkNull(idChiNhanh)) {
                        idChiNhanh = listChiNhanh[0].id;
                        tenChiNhanh = listChiNhanh[0].tenChiNhanh;
                        if (!utils.checkNull(idChiNhanhMacDinh)) {
                            idChiNhanh = idChiNhanhMacDinh ?? '';
                            // find chinhanh mac dinh
                            const cnMacDinh = listChiNhanh.filter((x: SuggestChiNhanhDto) => x.id === idChiNhanh);
                            if (cnMacDinh.length > 0) {
                                tenChiNhanh = cnMacDinh[0].tenChiNhanh;
                            }
                        }
                        setCurrentChiNhanh(idChiNhanh);

                        Cookies.set('IdChiNhanh', idChiNhanh, {
                            expires: remember === 'true' ? 1 : undefined
                        });
                        handleChangeChiNhanh({ id: idChiNhanh, tenChiNhanh: tenChiNhanh });
                    } else {
                        // if chinhanh was change: set this
                        setCurrentChiNhanh(idChiNhanh);
                        tenChiNhanh = listChiNhanh[0].tenChiNhanh;
                        const cnMacDinh = listChiNhanh.filter((x: SuggestChiNhanhDto) => x.id === idChiNhanh);
                        if (cnMacDinh.length > 0) {
                            tenChiNhanh = cnMacDinh[0].tenChiNhanh;
                        }
                        handleChangeChiNhanh({ id: idChiNhanh, tenChiNhanh: tenChiNhanh });

                        Cookies.set('IdChiNhanh', idChiNhanh, {
                            expires: remember === 'true' ? 1 : undefined
                        });
                    }
                }
            }
        };
        getChiNhanhs();
    }, []);

    const changeChiNhanh = (e: any, item: any) => {
        const idChiNhanh = item.props.value;
        const tenChiNhanh = item.props.children;
        setCurrentChiNhanh(idChiNhanh);
        const remember = Cookies.get('isRememberMe');
        Cookies.set('IdChiNhanh', idChiNhanh, {
            expires: remember === 'true' ? 1 : undefined
        });
        //window.location.reload();
        handleChangeChiNhanh({ id: idChiNhanh, tenChiNhanh: tenChiNhanh });
    };

    const dataSettingThongBao = [
        {
            title: 'Lịch hẹn',
            option: ['Lịch hẹn mới', 'Cập nhật lịch hẹn']
        },
        {
            title: 'Hoạt động',
            option: ['Sản phẩm', 'Sinh nhật khách hàng', 'Khách Đánh giá']
        }
    ];
    // kéo thả nút

    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({
        x: useWindowWidth() - 120,
        y: window.innerHeight - 90
    });
    const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
    useEffect(() => {
        if (isDragging) {
            const handleMouseMove = (e: any) => {
                setPosition((prevPosition) => ({
                    x: e.clientX - startPosition.x,
                    y: e.clientY - startPosition.y
                }));
            };

            document.addEventListener('mousemove', handleMouseMove);

            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
            };
        }
    }, [isDragging, startPosition]);
    const handleMouseDown = (e: any) => {
        setIsDragging(true);
        setStartPosition({
            x: e.clientX - position.x,
            y: e.clientY - position.y
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const changeColorMode = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsLightMode(event.target.checked);
        toggleColorMode;
    };

    return (
        <AppBar position="fixed" open={collapsed}>
            <Toolbar sx={{ padding: 'unset' }}>
                <Stack direction={'row'} justifyContent={collapsed ? 'end' : 'space-between'} width={'100%'}>
                    <Box
                        onClick={toggle}
                        sx={[{ cursor: 'pointer', transition: '0.2s' }, collapsed && { display: 'none' }]}>
                        <img style={{ width: '2rem', height: '2rem' }} src={LuckybeautyLogo} />
                        <KeyboardDoubleArrowRightOutlinedIcon />
                    </Box>
                    <Stack direction="row" alignItems={'center'}>
                        <Stack direction="row" alignItems={'center'}>
                            <Stack direction="row" spacing={1} alignItems={'center'}>
                                <Typography>{mode === 'light' ? 'Light mode' : 'Dark mode'}</Typography>
                                <Switch checked={mode === 'light'} onChange={toggleColorMode} />
                            </Stack>
                            <LocationIcon />
                            <Select
                                sx={{
                                    ml: '10px',
                                    border: 'none!important',
                                    '& *': {
                                        border: '0!important'
                                    },
                                    '& .MuiSelect-select': {
                                        padding: '0',
                                        fontSize: '14px'
                                    },
                                    '&:hover': {
                                        color: 'var(--color-main)'
                                    }
                                }}
                                size="small"
                                value={currentChiNhanh}
                                onChange={(e, item) => changeChiNhanh(e, item)}>
                                {chiNhanhs.map((item) => {
                                    return (
                                        <MenuItem key={item.id} value={item.id}>
                                            {item.tenChiNhanh}
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </Stack>

                        <Badge
                            color="error"
                            badgeContent={notificationStore.notifications?.unreadCount ?? 0}
                            sx={{
                                marginRight: '5px'
                            }}>
                            <Button
                                id="btnThongBao"
                                onClick={handleThongBaoClick}
                                aria-controls={openThongBao ? 'thongBao' : undefined}
                                aria-haspopup="true"
                                aria-expanded={openThongBao ? 'true' : undefined}
                                sx={{
                                    padding: '0',
                                    bgcolor: 'transparent!important',
                                    minWidth: 'unset!important',
                                    '&:hover img': {
                                        filter: 'var(--color-hoverIcon)'
                                    }
                                }}>
                                <img src={NotificationIcon} alt="notification" />
                            </Button>
                        </Badge>
                        <Menu
                            open={openThongBao}
                            id="thongBao"
                            anchorEl={ThongBaoAnchorEl}
                            onClose={handleCloseThongBao}
                            MenuListProps={{
                                'aria-labelledby': 'btnThongBao'
                            }}>
                            <Box
                                display={'flex'}
                                justifyContent={'space-between'}
                                maxWidth={'450px'}
                                sx={{
                                    overflow: 'auto',
                                    maxHeight: '66vh',
                                    '&::-webkit-scrollbar': {
                                        width: '7px'
                                    },
                                    '&::-webkit-scrollbar-thumb': {
                                        bgcolor: 'rgba(0,0,0,0.1)',
                                        borderRadius: '8px'
                                    },
                                    '&::-webkit-scrollbar-track': {
                                        bgcolor: 'var(--color-bg)'
                                    }
                                }}
                                flexDirection={'column'}>
                                <Box alignItems={'start'}>
                                    <MenuItem
                                        sx={{
                                            cursor: 'auto!important',
                                            bgcolor: 'transparent!important',
                                            '&> .MuiTouchRipple-root': {
                                                display: 'none'
                                            }
                                        }}>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                width: '100%',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                borderBottom: '1px solid #F2F2F2'
                                            }}>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    gap: '3px',
                                                    aignItems: 'center'
                                                }}>
                                                <Typography variant="body1" fontWeight="700">
                                                    Thông báo
                                                </Typography>
                                                <Box
                                                    sx={{
                                                        width: '16px',
                                                        height: '16px',
                                                        borderRadius: '50%',
                                                        bgcolor: '#F1416C',
                                                        color: '#fff',
                                                        fontSize: '12px',
                                                        textAlign: 'center',
                                                        lineHeight: '16px',
                                                        margin: 'auto'
                                                    }}>
                                                    {notificationStore.notifications?.unreadCount ?? 0}
                                                </Box>
                                            </Box>
                                            <Box display={'flex'} justifyContent={'end'} alignItems={'center'}>
                                                <Button
                                                    sx={{ fontSize: '14px' }}
                                                    onClick={() => {
                                                        notificationStore.setAllNotificationAsRead();
                                                    }}>
                                                    Đánh dấu đã đọc tất cả
                                                </Button>
                                                <IconButton
                                                    onClick={handleSettingClick}
                                                    sx={{
                                                        '&:hover svg': {
                                                            filter: 'var(--color-hoverIcon)'
                                                        }
                                                    }}>
                                                    <SettingIcon />
                                                </IconButton>
                                            </Box>
                                        </Box>
                                    </MenuItem>
                                </Box>
                                <Box alignItems={'center'}>
                                    <List>
                                        {notificationStore.notifications?.items.map((item, key) => (
                                            <ListItemButton
                                                key={key}
                                                disableGutters
                                                divider
                                                onClick={async () => {
                                                    if (item.state === UserNotificationState.Unread) {
                                                        await NotificationService.SetNotificationAsRead(item.id);
                                                        await notificationStore.GetUserNotification();
                                                    }
                                                    if (item.url != '' && item.url != undefined && item.url != null) {
                                                        handleCloseThongBao();
                                                        navigate(item.url);
                                                    }
                                                }}>
                                                <ListItemIcon
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}>
                                                    {item.notification.severity === NotificationSeverity.Info ? (
                                                        <InfoOutlinedIcon
                                                            sx={{
                                                                color:
                                                                    item.state == UserNotificationState.Read
                                                                        ? '#ccc'
                                                                        : ''
                                                            }}
                                                            color="info"
                                                        />
                                                    ) : null}
                                                    {item.notification.severity === NotificationSeverity.Error ? (
                                                        <ErrorOutlineOutlinedIcon
                                                            sx={{
                                                                color:
                                                                    item.state == UserNotificationState.Read
                                                                        ? '#ccc'
                                                                        : ''
                                                            }}
                                                            color="error"
                                                        />
                                                    ) : null}
                                                    {item.notification.severity === NotificationSeverity.Fatal
                                                        ? null
                                                        : null}
                                                    {item.notification.severity === NotificationSeverity.Success ? (
                                                        <CheckCircleOutlineOutlinedIcon
                                                            sx={{
                                                                color:
                                                                    item.state == UserNotificationState.Read
                                                                        ? '#ccc'
                                                                        : ''
                                                            }}
                                                            color="success"
                                                        />
                                                    ) : null}
                                                    {item.notification.severity === NotificationSeverity.Warn ? (
                                                        <WarningAmberOutlinedIcon
                                                            sx={{
                                                                color:
                                                                    item.state == UserNotificationState.Read
                                                                        ? '#ccc'
                                                                        : ''
                                                            }}
                                                            color="warning"
                                                        />
                                                    ) : null}
                                                </ListItemIcon>
                                                <ListItemText
                                                    sx={{
                                                        color: item.state == UserNotificationState.Read ? '#ccc' : ''
                                                    }}
                                                    primary={
                                                        <Box display={'flex'} justifyContent={'space-between'}>
                                                            <Typography fontSize="14px" fontWeight="500">
                                                                {item.notification.notificationName}
                                                            </Typography>
                                                            <Typography
                                                                sx={{
                                                                    fontSize: '10px',
                                                                    marginRight: '5px',
                                                                    fontWeight: '300',
                                                                    float: 'left'
                                                                }}>
                                                                {formatDistanceToNow(
                                                                    new Date(item.notification.creationTime),
                                                                    {
                                                                        addSuffix: true
                                                                    }
                                                                )}
                                                            </Typography>
                                                        </Box>
                                                    }
                                                    secondary={
                                                        <Typography fontSize="12px" fontWeight={'400'}>
                                                            {item.notification.content}
                                                        </Typography>
                                                    }
                                                />
                                            </ListItemButton>
                                        ))}
                                    </List>
                                </Box>
                                <MenuItem
                                    sx={{
                                        cursor: 'auto!important',
                                        bgcolor: 'transparent!important',
                                        '&> .MuiTouchRipple-root': {
                                            display: 'none'
                                        }
                                    }}>
                                    {notificationStore.maxResultCountNotification >=
                                    notificationStore.notifications?.totalCount ? null : (
                                        <Button
                                            variant="text"
                                            sx={{ color: '#319DFF', margin: 'auto' }}
                                            onClick={async () => {
                                                notificationStore.skipCountNotification = 0;
                                                notificationStore.maxResultCountNotification += 5;
                                                notificationStore.GetUserNotification();
                                            }}>
                                            Xem thêm
                                        </Button>
                                    )}
                                </MenuItem>
                            </Box>
                        </Menu>
                        <Menu
                            id="setting-thongbao"
                            anchorEl={settingThongBao}
                            open={openSettingThongBao}
                            onClose={CloseSettingThongBao}
                            sx={{
                                '& ul': {
                                    width: '400px'
                                },
                                '& li': {
                                    bgcolor: 'transparent!important',
                                    cursor: 'auto!important'
                                },
                                '& li > .MuiTouchRipple-root': {
                                    display: 'none'
                                }
                            }}>
                            <MenuItem>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        width: '100%',
                                        '& button:hover svg': {
                                            filter: 'var(--color-hoverIcon)'
                                        }
                                    }}>
                                    <Typography color="#4C4B4C" variant="body1" fontSize="16px" fontWeight="700">
                                        Thiết lập thông báo
                                    </Typography>
                                    <Box>
                                        <IconButton>
                                            <RestartIcon />
                                        </IconButton>
                                        <IconButton
                                            onClick={CloseSettingThongBao}
                                            sx={{
                                                '& svg': {
                                                    width: '16px',
                                                    height: '16px'
                                                }
                                            }}>
                                            <CloseIcon />
                                        </IconButton>
                                    </Box>
                                </Box>
                            </MenuItem>
                            {dataSettingThongBao.map((item, index) => (
                                <MenuItem key={index}>
                                    <Box>
                                        <Typography variant="body1" fontSize="12px" fontWeight="500" color="#4C4B4C">
                                            {item.title}
                                        </Typography>
                                        <FormGroup>
                                            {item.option.map((label, indexChild) => (
                                                <FormControlLabel
                                                    sx={{
                                                        '& .Mui-checked': {
                                                            color: 'var(--color-main)!important'
                                                        }
                                                    }}
                                                    key={indexChild}
                                                    control={<Checkbox />}
                                                    label={
                                                        <Typography
                                                            variant="body1"
                                                            fontSize="12px"
                                                            fontWeight="400"
                                                            color="#333233">
                                                            {' '}
                                                            {label}
                                                        </Typography>
                                                    }
                                                />
                                            ))}
                                        </FormGroup>
                                    </Box>
                                </MenuItem>
                            ))}
                            <MenuItem>
                                <Box sx={{ display: 'flex', width: '100%', gap: '20px' }}>
                                    <Button
                                        variant="outlined"
                                        fullWidth
                                        sx={{
                                            color: '#CDC9CD',
                                            borderColor: '#CDC9CD',
                                            bgcolor: '#fff'
                                        }}
                                        className="btn-outline-hover">
                                        Đặt lại
                                    </Button>
                                    <Button
                                        onClick={CloseSettingThongBao}
                                        variant="contained"
                                        fullWidth
                                        className="btn-container-hover"
                                        sx={{ color: '#fff', bgcolor: 'var(--color-main)' }}>
                                        Áp dụng
                                    </Button>
                                </Box>
                            </MenuItem>
                        </Menu>

                        <Button
                            id="btnAuthor"
                            aria-controls={open ? 'author' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={handleClick}
                            sx={{ pr: '25px', mr: '-20px' }}>
                            <Avatar src={Cookies.get('avatar') ?? ''} sx={{ height: 36, width: 36 }} alt={'profile'} />
                        </Button>

                        <Menu
                            open={open}
                            id="author"
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            MenuListProps={{
                                'aria-labelledby': 'btnAuthor'
                            }}
                            sx={{
                                '& .typo': {
                                    color: '#4C4B4C',
                                    fontSize: '14px',
                                    fontWeight: '400',
                                    bgcolor: 'transparent',
                                    border: '0'
                                },
                                '& a': {
                                    display: 'flex',
                                    gap: '16px'
                                },
                                '& .hover:hover button': {
                                    color: 'var(--color-main)'
                                },
                                '& .hover:hover svg': {
                                    filter: 'var(--color-hoverIcon)'
                                }
                            }}>
                            <MenuItem
                                onClick={() => {
                                    handleClose();
                                    navigate('/account/profile');
                                }}>
                                <Box sx={{ display: 'flex', gap: '12px' }}>
                                    <Avatar
                                        src={Cookies.get('avatar') ?? ''}
                                        alt="avatar"
                                        sx={{ width: 40, height: 40 }}
                                    />
                                    <Box
                                        sx={{
                                            '& h2': {
                                                fontWeight: '700',
                                                color: '#333233',
                                                fontSize: '16px',
                                                marginBottom: '0'
                                            },
                                            '& p': {
                                                color: '#666466',
                                                fontSize: '12px'
                                            }
                                        }}>
                                        <Box component="h2">{Cookies.get('fullname') ?? ''}</Box>
                                        <Box component="p">{Cookies.get('email') ?? ''}</Box>
                                    </Box>
                                </Box>
                            </MenuItem>
                            <MenuItem
                                className="hover"
                                sx={{ display: Cookies.get(Impersonation) ? '' : 'none' }}
                                onClick={async () => {
                                    await impersonationService.backToImpersonate();
                                }}>
                                <Box
                                    display={'flex'}
                                    flexDirection={'row'}
                                    gap={2}
                                    alignItems={'center'}
                                    justifyContent={'start'}>
                                    <BackIcon />
                                    <Box component="button" className="typo">
                                        Quay lại Host
                                    </Box>
                                </Box>
                            </MenuItem>
                            {/* <MenuItem
                                onClick={() => {
                                    tawkChatRef.current.toggle();
                                }}>
                                <Box
                                    display={'flex'}
                                    flexDirection={'row'}
                                    gap={2}
                                    alignItems={'center'}
                                    justifyContent={'start'}>
                                    <ChatIcon />
                                    <Box component="button" className="typo">
                                        Hỗ trợ
                                    </Box>
                                </Box>
                            </MenuItem> */}
                            <MenuItem
                                onClick={() => {
                                    handleClose();
                                    navigate('/account/profile');
                                }}
                                className="hover">
                                <Link to="/account/profile" style={{ textDecoration: 'none', listStyle: 'none' }}>
                                    <ProfileIcon />
                                    <Box component="button" className="typo">
                                        {' '}
                                        Hồ sơ{' '}
                                    </Box>
                                </Link>
                            </MenuItem>
                            <MenuItem
                                className="hover"
                                onClick={() => {
                                    Object.keys(Cookies.get()).forEach((cookieName) => {
                                        if (cookieName !== 'TenantName' && cookieName !== 'Abp.TenantId') {
                                            Cookies.remove(cookieName);
                                        }
                                    });
                                    localStorage.clear();
                                    handleClose();
                                    navigate('/login');
                                    window.location.reload();
                                }}>
                                <Box
                                    display={'flex'}
                                    flexDirection={'row'}
                                    gap={2}
                                    alignItems={'center'}
                                    justifyContent={'start'}>
                                    <LogoutIcon />
                                    <Box component="button" className="typo">
                                        Đăng xuất{' '}
                                    </Box>
                                </Box>
                            </MenuItem>
                        </Menu>
                        {!open && <ExpandMoreIcon />}
                        {open && <ExpandLessIcon />}
                    </Stack>
                </Stack>
            </Toolbar>
        </AppBar>
    );
};
export default observer(Header);
