/* eslint-disable @typescript-eslint/no-explicit-any */
import MainAppLayout from '../layouts/MainAppLayout';
import AnonymousLayout from '../layouts/AnonymousLayout';
import renderRoutes from './generate-routes';
// icon
import { BallotOutlined } from '@mui/icons-material';
import { IoCalendarOutline, IoStorefrontOutline } from 'react-icons/io5';
import {
    AiOutlineHome,
    AiOutlineIdcard,
    AiOutlineLineChart,
    AiOutlineSetting
} from 'react-icons/ai';
import { BsDot, BsPeople, BsPersonLock } from 'react-icons/bs';
import LoadableComponent from '../Loadable';
import { ReactNode } from 'react';
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
                    component: LoadableComponent(() => import('../../pages/Forgot_password')),
                    isLayout: true,
                    showInMenu: false
                },
                {
                    path: '/exception?:type',
                    permission: '',
                    title: 'exception',
                    icon: null,
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
                    icon: <AiOutlineHome style={{ fontSize: 20 }} />,
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
                    icon: <IoCalendarOutline style={{ fontSize: 20 }} />,
                    children: [],
                    showInMenu: true,
                    isLayout: false,
                    component: LoadableComponent(() => import('../../pages/lich-hen'))
                },
                {
                    path: '/ban-hangs',
                    name: 'banhang',
                    permission: '',
                    title: 'Bán hàng',
                    icon: <IoStorefrontOutline style={{ fontSize: 20 }} />,
                    children: [
                        {
                            path: '/page-ban-hang',
                            permission: '',
                            title: 'Thu ngân',
                            name: 'thungan',
                            icon: null,
                            children: [],
                            showInMenu: false,
                            isLayout: false,
                            component: LoadableComponent(
                                () => import('../../pages/ban_hang/main_page_ban_hang')
                            )
                        }
                    ],
                    showInMenu: true,
                    isLayout: false,
                    component: LoadableComponent(() => import('../../pages/dashboard'))
                },
                {
                    path: '/khach-hangs',
                    permission: '',
                    title: 'Khách hàng',
                    name: 'khachhang',
                    icon: <AiOutlineIdcard style={{ fontSize: 20 }} />,
                    showInMenu: true,
                    isLayout: false,
                    children: [],
                    component: LoadableComponent(() => import('../../pages/customer'))
                },
                {
                    path: '/dich-vus',
                    permission: '',
                    title: 'Dich vụ',
                    icon: <BallotOutlined style={{ fontSize: 20 }} />,
                    name: 'dichvu',
                    showInMenu: true,
                    isLayout: false,
                    children: [],
                    component: LoadableComponent(() => import('../../pages/product/PageProduct'))
                },
                {
                    path: 'employee',
                    permission: '',
                    title: 'Nhân viên',
                    name: 'nhanvien',
                    icon: <BsPeople style={{ fontSize: 20 }} />,
                    showInMenu: true,
                    isLayout: false,
                    children: [
                        {
                            path: '/nhan-viens',
                            permission: '',
                            title: 'Quản lý nhân viên',
                            name: 'nhanvien',
                            icon: <BsDot style={{ fontSize: 20 }} />,
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
                            showInMenu: true,
                            isLayout: false,
                            children: [],
                            component: LoadableComponent(
                                () => import('../../pages/employee/thoi-gian-nghi')
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
                    icon: <AiOutlineLineChart style={{ fontSize: 20 }} />,
                    showInMenu: true,
                    isLayout: false,
                    children: [],
                    component: LoadableComponent(() => import('../../pages/dashboard/indexNew'))
                },
                {
                    path: 'admin',
                    permission: '',
                    title: 'Quản trị',
                    icon: <BsPersonLock style={{ fontSize: 20 }} />,
                    name: 'QuanTri',
                    showInMenu: true,
                    isLayout: false,
                    children: [
                        {
                            path: '/users',
                            permission: 'Pages.Administration.Users',
                            title: 'Users',
                            name: 'user',
                            icon: null,
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
                            icon: null,
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
                            icon: null,
                            showInMenu: true,
                            children: [],

                            isLayout: false,
                            component: LoadableComponent(() => import('../../pages/tenant'))
                        }
                    ],
                    component: null
                },
                {
                    path: '/settings',
                    permission: '',
                    title: 'Cài đặt',
                    name: 'caidat',
                    icon: <AiOutlineSetting style={{ fontSize: 20 }} />,
                    showInMenu: true,
                    isLayout: false,
                    children: [],
                    component: LoadableComponent(() => import('../../pages/settings'))
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
