import MainAppLayout from '../layouts/MainAppLayout';
import AnonymousLayout from '../layouts/AnonymousLayout';
import renderRoutes from './generate-routes';
import { lazy } from 'react';

import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import BallotOutlinedIcon from '@mui/icons-material/BallotOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import CottageIcon from '@mui/icons-material/Cottage';
// ico
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
                    path: '/',
                    name: 'home',
                    permission: '',
                    title: 'Home',
                    icon: null,
                    component: LoadableComponent(() => import('../../pages/dashboard')),
                    children: [],
                    isLayout: true,
                    showInMenu: false
                },
                {
                    path: '/',
                    name: 'dashboard',
                    permission: '',
                    title: 'Dashboard',
                    icon: <CottageIcon style={{ fontSize: 24 }} />,
                    children: [],
                    showInMenu: true,
                    isLayout: false,
                    component: LoadableComponent(() => import('../../pages/dashboard'))
                },
                {
                    path: '/lich-hens',
                    name: 'lich hen',
                    permission: '',
                    title: 'Lịch hẹn',
                    icon: <CalendarMonthOutlinedIcon style={{ fontSize: 24 }} />,
                    children: [],
                    showInMenu: true,
                    isLayout: false,
                    component: LoadableComponent(() => import('../../pages/dashboard'))
                },
                {
                    path: '/khach-hangs',
                    permission: '',
                    title: 'Khách hàng',
                    name: 'khachhang',
                    icon: <PermContactCalendarIcon style={{ fontSize: 24 }} />,
                    showInMenu: true,
                    isLayout: false,
                    children: [],
                    component: LoadableComponent(() => import('../../pages/customer'))
                },
                {
                    path: '/nhan-viens',
                    permission: '',
                    title: 'Nhân viên',
                    name: 'nhanvien',
                    icon: <PeopleAltIcon style={{ fontSize: 24 }} />,
                    showInMenu: true,
                    isLayout: false,
                    children: [],
                    component: LoadableComponent(() => import('../../pages/employee'))
                },
                {
                    path: '/dich-vus',
                    permission: '',
                    title: 'Dich vụ',
                    icon: <BallotOutlinedIcon style={{ fontSize: 24 }} />,
                    name: 'dichvu',
                    showInMenu: true,
                    isLayout: false,
                    children: [],
                    component: LoadableComponent(() => import('../../pages/product/PageProduct'))
                },
                {
                    path: '',
                    permission: '',
                    title: 'Quản trị',
                    icon: <LockPersonIcon style={{ fontSize: 24 }} />,
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
