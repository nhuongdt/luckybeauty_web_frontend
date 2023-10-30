/* eslint-disable @typescript-eslint/no-explicit-any */
import MainAppLayout from '../layouts/MainAppLayout';
import AnonymousLayout from '../layouts/AnonymousLayout';
import renderRoutes from './generate-routes';
import { BsDot } from 'react-icons/bs';
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
import { ReactComponent as MoneyIcon } from '../../images/moneys.svg';
import { ReactComponent as MoneyActive } from '../../images/moneysActive.svg';
import { ReactComponent as BankIcon } from '../../images/icons/bankMenuIcon.svg';
import { ReactComponent as BankIconActive } from '../../images/icons/bankMenuIconActive.svg';
import SettingRoutes from '../../pages/admin/settings/settingRoutes';
type RenderRouteProps = {
    layout: React.ElementType;
    name: string;
    routes: RouteProps[];
};
export type RouteProps = {
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

export const userRouter: RouteProps[] = [
    {
        path: '/login',
        name: 'login',
        permission: '',
        children: [],
        title: 'Login',
        iconActive: null,
        icon: '',
        component: LoadableComponent(() => import('../../pages/account/login')),
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
        component: LoadableComponent(() => import('../../pages/account/register')),
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
        component: LoadableComponent(() => import('../../pages/account/Forgot_password')),
        isLayout: true,
        showInMenu: false
    },
    {
        path: '/account/changepassword',
        permission: '',
        title: 'Đổi mật khẩu',
        name: 'khachhang',
        icon: <ClientIcon width="20px" />,
        iconActive: <ClientActive width="20px" />,
        showInMenu: false,
        isLayout: false,
        children: [],
        component: LoadableComponent(() => import('../../pages/account/Change_Password'))
    },
    {
        path: 'exception401',
        permission: '',
        title: 'exception',
        name: 'exception',
        showInMenu: false,
        icon: null,
        iconActive: null,
        isLayout: false,
        children: [],
        component: LoadableComponent(() => import('../../pages/Exception/Exception401'))
    },
    {
        path: '/exception404',
        permission: '',
        title: 'exception',
        name: 'exception',
        showInMenu: false,
        icon: null,
        iconActive: null,
        isLayout: false,
        children: [],
        component: LoadableComponent(() => import('../../pages/Exception/Exception404'))
    },
    {
        path: '/exception500',
        permission: '',
        title: 'exception',
        name: 'exception',
        showInMenu: false,
        icon: null,
        iconActive: null,
        isLayout: false,
        children: [],
        component: LoadableComponent(() => import('../../pages/Exception/Exception500'))
    }
];

export const appRouters: AppRouteProps = {
    mainRoutes: [
        {
            layout: AnonymousLayout,
            name: 'AnonymousLayout',
            routes: [
                {
                    path: '/ban-hang',
                    permission: '',
                    title: 'Thu ngân',
                    name: 'thungan',
                    icon: null,
                    iconActive: null,
                    children: [],
                    showInMenu: true,
                    isLayout: false,
                    component: LoadableComponent(() => import('../../pages/ban_hang/thu_ngan/main_page_ban_hang'))
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
                    title: 'Trang chủ',
                    icon: null,
                    iconActive: null,
                    children: [],
                    showInMenu: false,
                    isLayout: false,
                    component: LoadableComponent(() => import('../../pages/dashboard'))
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
                    component: LoadableComponent(() => import('../../pages/dashboard'))
                },
                {
                    path: '/lich-hens',
                    name: 'lich hen',
                    permission: 'Pages.Booking',
                    title: 'Lịch hẹn',
                    icon: <CalendarIcon2 width="20px" />,
                    children: [],
                    iconActive: <LichActive width="20px" />,
                    showInMenu: true,
                    isLayout: false,
                    component: LoadableComponent(() => import('../../pages/appoinments'))
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

                            showInMenu: true,
                            isLayout: false,
                            component: LoadableComponent(() => import('../../pages/ban_hang/thu_ngan/index'))
                        },
                        {
                            path: '/giao-dich-thanh-toan',
                            permission: 'Pages.QuyHoaDon',
                            title: 'Giao dịch thanh toán',
                            name: 'giaoDichThanhToan',
                            icon: <BsDot style={{ fontSize: 20 }} />,
                            iconActive: null,
                            children: [],
                            showInMenu: true,
                            isLayout: false,
                            component: LoadableComponent(
                                () => import('../../pages/ban_hang/Giao_dich_thanh_toan/index')
                            )
                        }
                    ],
                    showInMenu: true,
                    isLayout: false,
                    component: LoadableComponent(() => import('../../pages/dashboard'))
                },
                {
                    path: '/khach-hangs',
                    permission: 'Pages.KhachHang',
                    title: 'Khách hàng',
                    name: 'khachhang',
                    icon: <ClientIcon width="20px" />,
                    iconActive: <ClientActive width="20px" />,
                    showInMenu: true,
                    isLayout: false,
                    children: [
                        {
                            path: '/khach-hangs',
                            permission: 'Pages.KhachHang',
                            title: 'Quản lý khách hàng',
                            name: 'khachhang',
                            icon: <BsDot width="20px" />,
                            iconActive: null,
                            showInMenu: true,
                            isLayout: false,
                            children: [],
                            component: LoadableComponent(() => import('../../pages/customer'))
                        },
                        {
                            path: '/khach-hang/tin-nhan',
                            permission: 'Pages.KhachHang',
                            title: 'Tin nhắn',
                            name: 'khachhang',
                            icon: <BsDot width="20px" />,
                            iconActive: null,
                            showInMenu: true,
                            isLayout: false,
                            children: [],
                            component: LoadableComponent(() => import('../../pages/sms/index'))
                        },
                        {
                            path: '/khach-hang-chi-tiet/:khachHangId',
                            permission: 'Pages.KhachHang',
                            title: 'Khách hàng',
                            name: 'khachhang',
                            icon: <ClientIcon width="20px" />,
                            iconActive: <ClientActive width="20px" />,
                            showInMenu: false,
                            isLayout: false,
                            children: [],
                            component: LoadableComponent(() => import('../../pages/customer/components/CustomerInfo'))
                        }
                    ],
                    component: null
                },

                {
                    path: '/dich-vus',
                    permission: 'Pages.DM_HangHoa',
                    title: 'Dịch vụ',
                    icon: <ServicesIcon width="20px" />,
                    iconActive: <ServiceActive width="20px" />,
                    name: 'dichvu',
                    showInMenu: true,
                    isLayout: false,
                    children: [
                        {
                            path: '/danh-sach-dich-vus',
                            permission: 'Pages.DM_HangHoa',
                            title: 'Dịch vụ',
                            icon: <BsDot style={{ fontSize: 20 }} />,
                            iconActive: null,
                            name: 'dichvu',
                            showInMenu: true,
                            isLayout: false,
                            children: [],
                            component: LoadableComponent(() => import('../../pages/product/index'))
                        },
                        {
                            path: '/cai-dat-dich-vu-nhan-vien',
                            permission: 'Pages.NhanVienDichVu',
                            title: 'Dịch vụ - Nhân viên',
                            icon: <BsDot style={{ fontSize: 20 }} />,
                            iconActive: null,
                            name: 'dichvunhanvien',
                            showInMenu: true,
                            isLayout: false,
                            children: [],
                            component: LoadableComponent(() => import('../../pages/dichvu_nhanvien'))
                        }
                    ],
                    component: null
                },
                {
                    path: '/thu-chi',
                    permission: 'Pages.QuyHoaDon',
                    title: 'Thu chi',
                    icon: <MoneyIcon width="20px" />,
                    iconActive: <MoneyActive width="20px" />,
                    name: 'thuChi',
                    showInMenu: true,
                    isLayout: false,
                    children: [
                        {
                            path: '/so-quy',
                            permission: 'Pages.QuyHoaDon',
                            title: 'Sổ quỹ',
                            icon: <BsDot style={{ fontSize: 20 }} />,
                            iconActive: null,
                            name: 'thuChi',
                            showInMenu: true,
                            isLayout: false,
                            children: [],
                            component: LoadableComponent(() => import('../../pages/thu_chi/so_quy'))
                        }
                    ],
                    component: null
                },
                {
                    path: '/employee',
                    permission: 'Pages.NhanSu',
                    title: 'Nhân viên',
                    name: 'nhanvien',
                    icon: <EmployeeIcon width="20px" />,
                    iconActive: <EmployeeActive width="20px" />,
                    showInMenu: true,
                    isLayout: false,
                    children: [
                        {
                            path: '/nhan-viens',
                            permission: 'Pages.NhanSu',
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
                            permission: 'Pages.NhanSu_NgayNghiLe',
                            title: 'Thời gian nghỉ',
                            name: 'nhanvien',
                            icon: <BsDot style={{ fontSize: 20 }} />,
                            iconActive: null,
                            showInMenu: true,
                            isLayout: false,
                            children: [],
                            component: LoadableComponent(() => import('../../pages/employee/thoi-gian-nghi'))
                        },
                        {
                            path: '/lich-lam-viec',
                            permission: 'Pages.NhanSu_TimeOff',
                            title: 'Lịch làm việc',
                            name: 'lichlamviec',
                            icon: <BsDot style={{ fontSize: 20 }} />,
                            iconActive: null,
                            showInMenu: true,
                            isLayout: false,
                            children: [],
                            component: LoadableComponent(() => import('../../pages/employee/lich-lam-viec'))
                        },
                        {
                            path: '/ca-lam-viec',
                            permission: 'Pages.NhanSu_CaLamViec',
                            title: 'Ca làm việc',
                            name: 'caLamViec',
                            icon: <BsDot style={{ fontSize: 20 }} />,
                            iconActive: null,
                            showInMenu: true,
                            isLayout: false,
                            children: [],
                            component: LoadableComponent(() => import('../../pages/employee/ca-lam-viec'))
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
                    children: [
                        {
                            path: '/bao-cao/bao-cao-ban-hang',
                            permission: 'Pages',
                            title: 'Báo cáo bán hàng',
                            name: 'baoCaoBanHang',
                            icon: <BsDot style={{ fontSize: 20 }} />,
                            iconActive: null,
                            showInMenu: true,
                            isLayout: false,
                            children: [],
                            component: LoadableComponent(() => import('../../pages/bao_cao/bao_cao_ban_hang'))
                        },
                        {
                            path: '/bao-cao/bao-cao-tai-chinh',
                            permission: 'Pages',
                            title: 'Báo cáo tài chính',
                            name: 'baoCaoBanHang',
                            icon: <BsDot style={{ fontSize: 20 }} />,
                            iconActive: null,
                            showInMenu: true,
                            isLayout: false,
                            children: [],
                            component: LoadableComponent(() => import('../../pages/bao_cao/bao_cao_tai_chinh'))
                        },
                        {
                            path: '/bao-cao/bao-cao-dat-lich',
                            permission: 'Pages',
                            title: 'Báo cáo đặt lịch',
                            name: 'baoCaoBanHang',
                            icon: <BsDot style={{ fontSize: 20 }} />,
                            iconActive: null,
                            showInMenu: true,
                            isLayout: false,
                            children: [],
                            component: LoadableComponent(() => import('../../pages/bao_cao/Bao_cao_dat_lich'))
                        }
                    ],
                    component: null
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
                            title: 'Người dùng',
                            name: 'user',
                            icon: <BsDot style={{ fontSize: 20 }} />,
                            iconActive: null,
                            children: [],
                            showInMenu: true,
                            isLayout: false,
                            component: LoadableComponent(() => import('../../pages/admin/user'))
                        },
                        {
                            path: '/roles',
                            permission: 'Pages.Administration.Roles',
                            title: 'Vai trò',
                            name: 'role',
                            iconActive: null,
                            icon: <BsDot style={{ fontSize: 20 }} />,
                            showInMenu: true,
                            isLayout: false,
                            children: [],
                            component: LoadableComponent(() => import('../../pages/admin/role'))
                        },
                        {
                            path: '/tenants',
                            permission: 'Pages.Tenants',
                            title: 'Tenant',
                            name: 'tenant',
                            iconActive: null,
                            icon: <BsDot style={{ fontSize: 20 }} />,
                            showInMenu: true,
                            children: [],

                            isLayout: false,
                            component: LoadableComponent(() => import('../../pages/admin/tenant/index'))
                        },
                        {
                            path: '/Brandname',
                            permission: 'Pages.Tenants',
                            title: 'Brandname',
                            name: 'Brandname',
                            iconActive: null,
                            icon: <BsDot style={{ fontSize: 20 }} />,
                            showInMenu: true,
                            children: [],

                            isLayout: false,
                            component: LoadableComponent(() => import('../../pages/sms/brandname/index'))
                        }
                    ],
                    component: null
                },
                {
                    path: '/tai-khoan-ngan-hang',
                    permission: 'Pages.Administration',
                    title: 'Tài khoản ngân hàng',
                    name: 'taiKhoanNganHang',
                    icon: <BankIcon width="20px" />,
                    iconActive: <BankIconActive width="20px" />,
                    showInMenu: true,
                    isLayout: false,
                    children: [],
                    component: LoadableComponent(() => import('../../pages/tai_khoan_ngan_hang'))
                },
                ...SettingRoutes,
                {
                    path: '/account',
                    permission: '',
                    title: 'Profile',
                    name: 'profile',
                    icon: null,
                    iconActive: null,
                    showInMenu: false,
                    isLayout: false,
                    children: [
                        {
                            path: '/account/profile',
                            permission: '',
                            title: 'Profile',
                            name: 'profile',
                            icon: null,
                            iconActive: null,
                            showInMenu: false,
                            isLayout: false,
                            children: [],
                            component: LoadableComponent(() => import('../../pages/account/profile'))
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
