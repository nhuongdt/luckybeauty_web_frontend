/* eslint-disable @typescript-eslint/no-explicit-any */
import MainAppLayout from '../layouts/MainAppLayout';
import AnonymousLayout from '../layouts/AnonymousLayout';
import renderRoutes from './generate-routes';
// icon
import { BallotOutlined } from '@mui/icons-material';
import { IoCalendarOutline, IoStorefrontOutline } from 'react-icons/io5';

import { BsDot, BsPeople, BsPersonLock } from 'react-icons/bs';
import LoadableComponent from '../Loadable';
import { ReactNode } from 'react';
import { ReactComponent as HomeIcon2 } from '../../images/home-2.svg';
import { ReactComponent as CalendarIcon2 } from '../../images/calendarMenu.svg';
import { ReactComponent as ServicesIcon } from '../../images/serviceMenuIcon.svg';
import { ReactComponent as ShopIcon } from '../../images/shopMenu.svg';
import { ReactComponent as ClientIcon } from '../../images/personalcardIcon.svg';
import { ReactComponent as EmployeeIcon } from '../../images/employeeIcon.svg';
import { ReactComponent as ReportIcon } from '../../images/reportIcon.svg';
import { ReactComponent as SettingIcon } from '../../images/settingIcon.svg';
import { ReactComponent as AdminIcon } from '../../images/admin77.svg';
import { ReactComponent as HomeActive } from '../../images/homeActive.svg';
import { ReactComponent as LichActive } from '../../images/calendarActive.svg';
import { ReactComponent as ShopActive } from '../../images/shopActive.svg';
import { ReactComponent as ClientActive } from '../../images/clientActive.svg';
import { ReactComponent as ServiceActive } from '../../images/serviceActive.svg';
import { ReactComponent as EmployeeActive } from '../../images/employeeActive.svg';
import { ReactComponent as ReportActive } from '../../images/reportActive.svg';
import { ReactComponent as SetingActive } from '../../images/settingActive.svg';
import { ReactComponent as AdminActive } from '../../images/admin2.svg';
type RenderRouteProps = {
    layout: React.ElementType;
    name: string;
    routes: RouteProps[];
};
type RouteProps = {
    path: string;
    name: string;
    permission: string;
    title: string;
    icon: ReactNode;
    iconActive: ReactNode;
    children: RouteProps[];
    showInMenu: boolean;
    isLayout: boolean;
    component: any;
};
export type AppRouteProps = {
    mainRoutes: RenderRouteProps[];
};

export const appRouters: AppRouteProps = {
    mainRoutes: [
        {
            layout: AnonymousLayout,
            name: 'AnonymousLayout',
            routes: [
                {
                    path: '/login',
                    name: 'login',
                    permission: '',
                    children: [],
                    title: 'Login',
                    iconActive: null,
                    icon: '',
                    component: LoadableComponent(() => import('../../pages/login')),
                    isLayout: true,
                    showInMenu: false
                },
                {
                    path: '/',
                    name: 'login',
                    permission: '',
                    children: [],
                    title: 'Login',
                    iconActive: null,
                    icon: '',
                    component: LoadableComponent(() => import('../../pages/login')),
                    isLayout: true,
                    showInMenu: false
                },
                {
                    path: '/register',
                    name: 'register',
                    permission: '',
                    children: [],
                    title: 'Register',
                    iconActive: null,
                    icon: null,
                    component: LoadableComponent(() => import('../../pages/register')),
                    isLayout: true,
                    showInMenu: false
                },
                {
                    path: '/forgot-password',
                    name: 'forgotPassword',
                    permission: '',
                    children: [],
                    title: 'Forgot password',
                    icon: null,
                    iconActive: null,
                    component: LoadableComponent(() => import('../../pages/Forgot_password')),
                    isLayout: true,
                    showInMenu: false
                },
                {
                    path: '/exception?:type',
                    permission: '',
                    title: 'exception',
                    icon: null,
                    iconActive: null,
                    name: 'exception',
                    showInMenu: false,
                    isLayout: false,
                    children: [],
                    component: LoadableComponent(() => import('../../pages/Exception'))
                }
            ]
        },
        {
            layout: MainAppLayout,
            name: 'MainAppLayout',
            routes: [
                {
                    path: '/home',
                    name: 'home',
                    permission: '',
                    title: 'Home',
                    icon: null,
                    iconActive: null,
                    component: LoadableComponent(() => import('../../pages/dashboard/indexNew')),
                    children: [],
                    isLayout: true,
                    showInMenu: false
                },
                {
                    path: '/home',
                    name: 'dashboard',
                    permission: '',
                    title: 'Trang chủ',
                    icon: <HomeIcon2 width="20px" />,
                    iconActive: <HomeActive width="20px" />,
                    children: [],
                    showInMenu: true,
                    isLayout: false,
                    component: LoadableComponent(() => import('../../pages/dashboard/indexNew'))
                },
                {
                    path: '/lich-hens',
                    name: 'lich hen',
                    permission: '',
                    title: 'Lịch hẹn',
                    icon: <CalendarIcon2 width="20px" />,
                    children: [],
                    iconActive: <LichActive width="20px" />,
                    showInMenu: true,
                    isLayout: false,
                    component: LoadableComponent(() => import('../../pages/lich-hen/'))
                },
                {
                    path: '/ban-hangs',
                    name: 'banhang',
                    permission: '',
                    title: 'Bán hàng',
                    iconActive: <ShopActive width="20px" />,
                    icon: <ShopIcon width="20px" />,
                    children: [
                        {
                            path: '/page-ban-hang',
                            permission: '',
                            title: 'Thu ngân',
                            name: 'thungan',
                            icon: <BsDot style={{ fontSize: 20 }} />,
                            iconActive: null,
                            children: [],

                            showInMenu: false,
                            isLayout: false,
                            component: LoadableComponent(
                                () => import('../../pages/ban_hang/main_page_ban_hang')
                            )
                        },
                        {
                            path: '/giao-dich-thanh-toan',
                            permission: '',
                            title: 'Giao dịch thanh toán',
                            name: 'giaoDichThanhToan',
                            icon: <BsDot style={{ fontSize: 20 }} />,
                            iconActive: null,
                            children: [],
                            showInMenu: false,
                            isLayout: false,
                            component: LoadableComponent(
                                () => import('../../pages/ban_hang/Giao_dich_thanh_toan')
                            )
                        },
                        {
                            path: '/hoa-don',
                            permission: '',
                            title: 'Hoá đơn',
                            name: 'HoaDon',
                            icon: <BsDot style={{ fontSize: 20 }} />,
                            iconActive: null,
                            children: [],
                            showInMenu: false,
                            isLayout: false,
                            component: LoadableComponent(
                                () => import('../../pages/ban_hang/Hoa_don')
                            )
                        }
                    ],
                    showInMenu: true,
                    isLayout: false,
                    component: LoadableComponent(() => import('../../pages/dashboard/indexNew'))
                },
                {
                    path: '/khach-hangs',
                    permission: '',
                    title: 'Khách hàng',
                    name: 'khachhang',
                    icon: <ClientIcon width="20px" />,
                    iconActive: <ClientActive width="20px" />,
                    showInMenu: true,
                    isLayout: false,
                    children: [],
                    component: LoadableComponent(() => import('../../pages/customer'))
                },
                {
                    path: '/dich-vus',
                    permission: '',
                    title: 'Dịch vụ',
                    icon: <ServicesIcon width="20px" />,
                    iconActive: <ServiceActive width="20px" />,
                    name: 'dichvu',
                    showInMenu: true,
                    isLayout: false,
                    children: [],
                    component: LoadableComponent(() => import('../../pages/product/pageProductNew'))
                },
                {
                    path: 'employee',
                    permission: '',
                    title: 'Nhân viên',
                    name: 'nhanvien',
                    icon: <EmployeeIcon width="20px" />,
                    iconActive: <EmployeeActive width="20px" />,
                    showInMenu: true,
                    isLayout: false,
                    children: [
                        {
                            path: '/nhan-viens',
                            permission: '',
                            title: 'Quản lý nhân viên',
                            name: 'nhanvien',
                            icon: <BsDot style={{ fontSize: 20 }} />,
                            iconActive: null,
                            showInMenu: true,
                            isLayout: false,
                            children: [],
                            component: LoadableComponent(() => import('../../pages/employee'))
                        },
                        {
                            path: '/nghi-le-nhan-viens',
                            permission: '',
                            title: 'Thời gian nghỉ',
                            name: 'nhanvien',
                            icon: <BsDot style={{ fontSize: 20 }} />,
                            iconActive: null,
                            showInMenu: true,
                            isLayout: false,
                            children: [],
                            component: LoadableComponent(
                                () => import('../../pages/employee/thoi-gian-nghi')
                            )
                        },
                        {
                            path: '/lich-lam-viec',
                            permission: '',
                            title: 'Lịch làm việc',
                            name: 'lichlamviec',
                            icon: <BsDot style={{ fontSize: 20 }} />,
                            iconActive: null,
                            showInMenu: true,
                            isLayout: false,
                            children: [],
                            component: LoadableComponent(
                                () => import('../../pages/employee/lich-lam-viec')
                            )
                        }
                    ],
                    component: null
                },
                {
                    path: '/bao-cao',
                    permission: '',
                    title: 'Báo cáo',
                    name: 'baocao',
                    icon: <ReportIcon width="20px" />,
                    iconActive: <ReportActive width="20px" />,
                    showInMenu: true,
                    isLayout: false,
                    children: [],
                    component: LoadableComponent(() => import('../../pages/dashboard/indexNew'))
                },
                {
                    path: 'admin',
                    permission: 'Pages.Administration',
                    title: 'Quản trị',
                    icon: <AdminIcon width="20px" />,
                    iconActive: <AdminActive width="20px" />,
                    name: 'QuanTri',
                    showInMenu: true,
                    isLayout: false,
                    children: [
                        {
                            path: '/users',
                            permission: 'Pages.Administration.Users',
                            title: 'Users',
                            name: 'user',
                            icon: <BsDot style={{ fontSize: 20 }} />,
                            iconActive: null,
                            children: [],
                            showInMenu: true,
                            isLayout: false,
                            component: LoadableComponent(() => import('../../pages/user'))
                        },
                        {
                            path: '/roles',
                            permission: 'Pages.Administration.Roles',
                            title: 'Roles',
                            name: 'role',
                            iconActive: null,
                            icon: <BsDot style={{ fontSize: 20 }} />,
                            showInMenu: true,
                            isLayout: false,
                            children: [],
                            component: LoadableComponent(() => import('../../pages/role'))
                        },
                        {
                            path: '/tenants',
                            permission: 'Pages.Tenants',
                            title: 'Tenants',
                            name: 'tenant',
                            iconActive: null,
                            icon: <BsDot style={{ fontSize: 20 }} />,
                            showInMenu: true,
                            children: [],

                            isLayout: false,
                            component: LoadableComponent(() => import('../../pages/tenant/index'))
                        }
                    ],
                    component: null
                },
                {
                    path: '/settings',
                    permission: 'Pages.CongTy',
                    title: 'Cài đặt',
                    name: 'caidat',
                    icon: <SettingIcon width="20px" />,
                    iconActive: <SetingActive width="20px" />,
                    showInMenu: true,
                    isLayout: false,
                    children: [],
                    component: LoadableComponent(() => import('../../pages/settings/indexNew'))
                }
            ]
        }
    ]
};

function flattenRoutes(routes: RouteProps[], flatList: RouteProps[] = []) {
    routes.forEach((route) => {
        flatList.push(route);
        if (route.children) {
            flattenRoutes(route.children, flatList);
        }
    });
    return flatList;
}

export const flatRoutes = flattenRoutes(appRouters.mainRoutes.flatMap((r: any) => r.routes));
export const Routes = renderRoutes();
