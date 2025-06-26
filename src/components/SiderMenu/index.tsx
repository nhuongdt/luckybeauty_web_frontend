/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ReactElement, useEffect, useState } from 'react';
import { appRouters } from '../routers/index';

import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Collapse, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack } from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { Box } from '@mui/material';
import { observer } from 'mobx-react';
import sessionStore from '../../stores/sessionStore';
import { NavLink } from 'react-router-dom';

import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import KeyboardDoubleArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowLeftOutlined';
import KeyboardDoubleArrowRightOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowRightOutlined';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import LuckybeautyLogo from '../../images/luckybeautylogo.png';
import { fontStyle, fontWeight } from '@mui/system';

declare var abp: any;

interface Props {
    collapsed: boolean;
    toggle: () => void;
    onHoverChange: (isHovered: boolean) => void;
    CookieSidebar: boolean;
}
interface MyDrawerProps {
    openDrawer: boolean;
    handleDrawerClose: () => void;
}
interface MenuItem {
    key: React.Key;
    icon?: React.ReactNode;
    iconActive?: React.ReactNode;
    children?: MenuItem[];
    label: React.ReactNode;
    type?: 'group';
}

interface MyListItemTextProps {
    isActive?: boolean;
    collapsed?: boolean;
}

function convertMenuItemsToMenu(menuItems: any[], listPermission: string[]): MenuItem[] {
    const isHost = abp.auth.isGranted('Pages.Tenants');
    const menu: MenuItem[] = [];
    const routerMenu = menuItems.filter((x) => x.showInMenu === true);
    routerMenu.forEach((item) => {
        // Check if item has permission to be added to menu
        if (listPermission.includes(item.permission) || item.permission === '') {
            const menuItem: MenuItem = {
                key: item.path,
                label: item.title,
                // label:
                //     item.children.length > 0 ? (
                //         item.title
                //     ) : (
                //         <Link to={item.path} title={item.title} style={{ textDecoration: 'none' }}>
                //             {item.title}
                //         </Link>
                //     ),
                icon: item.icon,
                iconActive: item.iconActive,
                type: item.isLayout ? 'group' : undefined,
                children: item.children.length > 0 ? convertMenuItemsToMenu(item.children, listPermission) : undefined
            };
            if (item?.featureName) {
                if (isHost) {
                    menu.push(menuItem);
                } else {
                    // ẩn/hiện tính năng theo phiên bản (Edition)
                    if (abp.features.isEnabled(item?.featureName)) {
                        menu.push(menuItem);
                    }
                }
            } else {
                menu.push(menuItem);
            }
        }
    });
    return menu;
}

const drawerWidth = 240;
const MyListItemParentText = styled(ListItemText)<MyListItemTextProps>(({ theme, isActive, collapsed }) => ({
    fontWeight: isActive ? '500' : '400',
    color: isActive ? 'var(--color-main)' : 'text.primary',
    left: collapsed ? '20%' : '50%'
}));

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen
    }),
    overflowX: 'hidden',
    overflowY: 'scroll' /* hoặc auto nếu bạn chỉ muốn khi tràn mới cuộn */,
    scrollbarWidth: 'none',
    backgroundColor: theme.palette.background.default
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
    }),
    overflowX: 'hidden',
    overflowY: 'scroll' /* hoặc auto nếu bạn chỉ muốn khi tràn mới cuộn */,
    scrollbarWidth: 'none' /* Firefox */,
    width: `calc(${theme.spacing(7)} + 1px)`,
    backgroundColor: theme.palette.background.default,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`
    }
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    variants: [
        {
            props: ({ open }) => open,
            style: {
                ...openedMixin(theme),
                '& .MuiDrawer-paper': openedMixin(theme)
            }
        },
        {
            props: ({ open }) => !open,
            style: {
                ...closedMixin(theme),
                '& .MuiDrawer-paper': closedMixin(theme)
            }
        }
    ]
}));

const AppSiderMenu: React.FC<MyDrawerProps> = ({ openDrawer, handleDrawerClose }) => {
    const navigate = useNavigate();
    const mainAppRoutes = appRouters.mainRoutes[1].routes.filter(
        (item: { showInMenu: boolean }) => item.showInMenu === true
    );
    const location = useLocation();
    const itemMenus = convertMenuItemsToMenu(mainAppRoutes, sessionStore.listPermisson);

    const [open, setOpen] = useState<{ [key: number]: boolean }>({});

    const handleDropdown = (index: number) => {
        setOpen((prevOpen) => ({
            ...prevOpen,
            [index]: !prevOpen[index]
        }));
    };
    const [OpenHover, setOpenHover] = useState(false);

    // const handleMouseEnter = () => {
    //     setOpenHover(true);
    //     onHoverChange(true);
    // };

    // const handleMouseLeave = () => {
    //     setOpenHover(false);
    //     onHoverChange(false);
    // };
    const theme = useTheme();
    // const [open, setOpen] = React.useState(false);

    // const handleDrawerOpen = () => {
    //     setOpen(true);
    // };

    // const handleDrawerClose = () => {
    //     setOpen(false);
    // };

    return (
        <Drawer variant="permanent" open={openDrawer}>
            <DrawerHeader>
                <Stack
                    direction={'row'}
                    spacing={1}
                    alignItems={'center'}
                    onClick={handleDrawerClose}
                    sx={{ cursor: 'pointer' }}>
                    <img style={{ width: '2rem', height: '2rem' }} src={LuckybeautyLogo} />
                    <Stack direction={'row'} spacing={1} alignItems={'center'}>
                        {theme.direction === 'rtl' ? null : (
                            <Typography color="#319DFF" fontSize={20}>
                                Lucky Beauty
                            </Typography>
                        )}
                        {theme.direction === 'rtl' ? (
                            <KeyboardDoubleArrowRightOutlinedIcon />
                        ) : (
                            <KeyboardDoubleArrowLeftOutlinedIcon />
                        )}
                    </Stack>
                </Stack>
            </DrawerHeader>
            <Divider />
            <List>
                {itemMenus.map((item, index) => (
                    <ListItem
                        key={index}
                        disablePadding
                        sx={{
                            display: 'block',
                            backgroundColor:
                                location.pathname === item.key.toString() ? theme.palette.background.paper : undefined
                        }}
                        onClick={item.children ? () => handleDropdown(index) : () => navigate(item.key.toString())}>
                        <ListItemButton
                            sx={[
                                {
                                    minHeight: 48,
                                    px: 2.5
                                },
                                openDrawer
                                    ? {
                                          justifyContent: 'initial'
                                      }
                                    : {
                                          justifyContent: 'center'
                                      }
                            ]}>
                            <ListItemIcon
                                sx={[
                                    {
                                        minWidth: 0,
                                        justifyContent: 'center'
                                    },
                                    openDrawer
                                        ? {
                                              mr: 3
                                          }
                                        : {
                                              mr: 'auto'
                                          },
                                    {
                                        color:
                                            location.pathname === item.key.toString()
                                                ? theme.palette.primary.main
                                                : undefined
                                    }
                                ]}>
                                {location.pathname === item.key.toString() ? item?.iconActive : item?.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.label}
                                sx={[
                                    openDrawer
                                        ? {
                                              opacity: 1
                                          }
                                        : {
                                              opacity: 0
                                          },
                                    {
                                        '& .MuiTypography-root': {
                                            fontWeight: location.pathname === item.key.toString() ? '600' : undefined
                                        }
                                    }
                                ]}
                            />
                            {(item?.children?.length ?? 0) > 0 ? (
                                open[index] ? (
                                    <ExpandLessIcon />
                                ) : (
                                    <ExpandMoreIcon />
                                )
                            ) : null}
                        </ListItemButton>
                        {item?.children?.map((itemChild, index2) => (
                            <Collapse
                                in={open[index]}
                                timeout="auto"
                                unmountOnExit
                                key={index2}
                                onClick={() => navigate(itemChild.key.toString())}>
                                <List
                                    component="div"
                                    disablePadding
                                    sx={{
                                        backgroundColor:
                                            location.pathname === itemChild?.key.toString()
                                                ? theme.palette.background.paper
                                                : undefined
                                    }}>
                                    <ListItemButton sx={{ pl: 5 }}>
                                        <ListItemIcon
                                            sx={{
                                                minWidth: '32px',
                                                color:
                                                    location.pathname === itemChild?.key.toString()
                                                        ? theme.palette.primary.main
                                                        : undefined
                                            }}>
                                            {itemChild?.icon}
                                        </ListItemIcon>
                                        {open[index] && (
                                            <ListItemText
                                                primary={itemChild.label}
                                                sx={{
                                                    '& .MuiTypography-root': {
                                                        fontWeight:
                                                            location.pathname === itemChild?.key.toString()
                                                                ? '600'
                                                                : undefined
                                                    }
                                                }}
                                            />
                                        )}
                                    </ListItemButton>
                                </List>
                            </Collapse>
                        ))}
                    </ListItem>
                ))}
            </List>
        </Drawer>
    );

    // return (
    //     <Box
    //         // onMouseEnter={collapsed ? undefined : handleMouseEnter}
    //         onMouseLeave={collapsed ? undefined : handleMouseLeave}
    //         sx={{
    //             overflowY: 'auto',
    //             overflowX: 'hidden',
    //             height: '100vh',
    //             position: 'fixed',
    //             transition: '.4s',
    //             left: '0',
    //             top: 0,
    //             bottom: 0,
    //             // bgcolor: '#fff',
    //             zIndex: '20',
    //             width: collapsed || OpenHover ? '240px' : '0px',
    //             boxShadow: OpenHover ? '0px 0px 40px -12px rgba(124, 51, 103,0.3);' : 'unset',
    //             '& .MuiList-root': {
    //                 display: 'flex',

    //                 flexDirection: 'column'
    //             },
    //             '::-webkit-scrollbar-track': {
    //                 background: '#f1f1f1'
    //             },

    //             '::-webkit-scrollbar': {
    //                 width: '0px'
    //             },
    //             '::-webkit-scrollbar-thumb': {
    //                 borderRadius: '8px',
    //                 bgcolor: 'rgba(124, 51, 103,0.1)'
    //             }
    //         }}>
    //         <Box
    //             className="side-menu"
    //             sx={{
    //                 overflow: 'hidden',
    //                 backgroundColor: 'background.default'
    //             }}>
    //             <List
    //                 //component="nav"
    //                 sx={{
    //                     minWidth: '218px',
    //                     marginTop: '80px',
    //                     display: 'flex',
    //                     flexDirection: 'column',
    //                     padding: '0px 8px',
    //                     gap: '4px',
    //                     '& .Mui-selected': {
    //                         bgcolor: 'transparent!important'
    //                     }
    //                 }}>
    //                 {itemMenus.map((itemMenu, index) => (
    //                     <ListItem
    //                         component={Box as React.ElementType}
    //                         onClick={() => {
    //                             itemMenu.children && itemMenu.children.length > 0
    //                                 ? undefined
    //                                 : navigate(itemMenu.key.toString());
    //                         }}
    //                         key={index}
    //                         selected={location.pathname === itemMenu.key}
    //                         sx={{
    //                             flexWrap: 'wrap',
    //                             padding: '0'
    //                         }}>
    //                         <ListItemButton
    //                             // component="button"
    //                             // sx={{
    //                             //     width: '100%',
    //                             //     border: '0',
    //                             //     display: 'flex',
    //                             //     padding: '8px 14px',
    //                             //     height: '40px',
    //                             //     transition: '.4s',
    //                             //     alignItems: 'center',
    //                             //     backgroundColor:
    //                             //         location.pathname === itemMenu.key ||
    //                             //         itemMenu.children?.some(
    //                             //             (dropdownItem) => location.pathname === dropdownItem.key
    //                             //         )
    //                             //             ? 'var(--color-bg)!important'
    //                             //             : 'transparent',
    //                             //     borderRadius: '8px',
    //                             //     maxWidth: collapsed || OpenHover ? '500px' : '51px',
    //                             //     maxHeight: collapsed || OpenHover ? '500px' : '51px',
    //                             //     ':hover': {
    //                             //         backgroundColor: 'var(--color-bg)!important'
    //                             //     }
    //                             // }}
    //                             onClick={itemMenu.children ? () => handleDropdown(index) : undefined}>
    //                             <ListItemIcon
    //                                 sx={{
    //                                     minWidth: '40px',
    //                                     transition: '.4s',
    //                                     filter:
    //                                         location.pathname === itemMenu.key ||
    //                                         itemMenu.children?.some(
    //                                             (dropdownItem) => location.pathname === dropdownItem.key
    //                                         )
    //                                             ? 'brightness(0) saturate(100%) invert(17%) sepia(0%) saturate(399%) hue-rotate(341deg) brightness(95%) contrast(87%)'
    //                                             : 'unset'
    //                                 }}>
    //                                 {location.pathname === itemMenu.key ||
    //                                 itemMenu.children?.some((dropdownItem) => location.pathname === dropdownItem.key)
    //                                     ? itemMenu.iconActive
    //                                     : itemMenu.icon}
    //                             </ListItemIcon>
    //                             {/* <ListItemText
    //                                 primary={itemMenu.label}
    //                                 sx={{
    //                                     flex: 'unset!important',
    //                                     '& a': {
    //                                         fontSize: '14px',
    //                                         fontFamily: 'Roboto',
    //                                         color:
    //                                             location.pathname === itemMenu.key
    //                                                 ? 'var(--color-main)'
    //                                                 : 'text.primary',
    //                                         fontWeight:
    //                                             location.pathname === itemMenu.key ||
    //                                             itemMenu.children?.some(
    //                                                 (dropdownItem) => location.pathname === dropdownItem.key
    //                                             )
    //                                                 ? '500'
    //                                                 : '400'
    //                                     },
    //                                     transition: '.4s',
    //                                     left: collapsed || OpenHover ? '20%' : '50%',
    //                                     position: 'absolute',

    //                                     marginY: 0,
    //                                     paddingY: '4px',
    //                                     '& span': {
    //                                         fontSize: '14px',
    //                                         fontFamily: 'Roboto !important',
    //                                         fontWeight:
    //                                             location.pathname === itemMenu.key ||
    //                                             itemMenu.children?.some(
    //                                                 (dropdownItem) => location.pathname === dropdownItem.key
    //                                             )
    //                                                 ? '500'
    //                                                 : '400'
    //                                     }
    //                                 }}
    //                             /> */}
    //                             <MyListItemParentText
    //                                 primary={itemMenu.label}
    //                                 isActive={location.pathname === itemMenu.key}
    //                                 collapsed={collapsed || OpenHover}
    //                             />
    //                             {itemMenu.children &&
    //                                 (open[index] ? (
    //                                     <ExpandLessIcon
    //                                         sx={{
    //                                             color: '#343234!important',
    //                                             ml: 'auto',
    //                                             transition: '.4s',
    //                                             position: 'relative',
    //                                             right: collapsed || OpenHover ? '0' : '-30px'
    //                                         }}
    //                                     />
    //                                 ) : (
    //                                     <ExpandMoreIcon
    //                                         sx={{
    //                                             color: '#343234!important',
    //                                             ml: 'auto',
    //                                             transition: '.4s',
    //                                             position: 'relative',
    //                                             right: collapsed || OpenHover ? '0' : '-30px'
    //                                         }}
    //                                     />
    //                                 ))}
    //                         </ListItemButton>
    //                         {itemMenu.children && (
    //                             <Box
    //                                 sx={{
    //                                     overflow: 'hidden',
    //                                     marginLeft: 'auto',
    //                                     width: '100%',
    //                                     position: 'relative',
    //                                     pl: '26px',
    //                                     left: collapsed || OpenHover ? ' 0' : '50px',
    //                                     transition: open[index]
    //                                         ? 'max-height 2.5s, left .4s,min-height .4s'
    //                                         : ' max-height 1s,left .4s,min-height .4s',
    //                                     maxHeight: open[index] == true ? '400px' : '0px',
    //                                     display: collapsed || OpenHover ? 'block' : 'none'
    //                                 }}>
    //                                 <List component="div" disablePadding>
    //                                     {itemMenu.children.map((dropdownItem) => (
    //                                         <ListItem
    //                                             key={dropdownItem.key}
    //                                             component={Box as React.ElementType}
    //                                             // to={dropdownItem.key}
    //                                             onClick={() => {
    //                                                 dropdownItem.children && dropdownItem.children.length > 0
    //                                                     ? undefined
    //                                                     : navigate(dropdownItem.key.toString());
    //                                             }}
    //                                             selected={
    //                                                 location.pathname === dropdownItem.key ||
    //                                                 itemMenu.children?.some(
    //                                                     (dropdownItem) => location.pathname === dropdownItem.key
    //                                                 )
    //                                             }
    //                                             sx={{
    //                                                 backgroundColor: 'transparent!important',
    //                                                 padding: '2px'
    //                                             }}>
    //                                             <ListItemIcon
    //                                                 sx={{
    //                                                     '& svg': {
    //                                                         filter:
    //                                                             location.pathname === dropdownItem.key
    //                                                                 ? 'var(--color-hoverIcon)'
    //                                                                 : 'black'
    //                                                     },
    //                                                     minWidth: '20px'
    //                                                 }}>
    //                                                 {dropdownItem.icon}
    //                                             </ListItemIcon>
    //                                             <ListItemText
    //                                                 primary={dropdownItem.label}
    //                                                 sx={{
    //                                                     '& a': {
    //                                                         fontSize: '14px',
    //                                                         color:
    //                                                             location.pathname === dropdownItem.key
    //                                                                 ? 'var(--color-main)'
    //                                                                 : 'text.primary'
    //                                                     },
    //                                                     ':hover a': {
    //                                                         color: '#319DFF'
    //                                                         //color: 'black'
    //                                                     }
    //                                                 }}
    //                                             />
    //                                         </ListItem>
    //                                     ))}
    //                                 </List>
    //                             </Box>
    //                         )}
    //                     </ListItem>
    //                 ))}
    //             </List>
    //         </Box>
    //     </Box>
    // );
};
export default observer(AppSiderMenu);
