import { Api, Cookie } from '@mui/icons-material';
import axios from 'axios';
import Cookies from 'js-cookie';
import LoginModel from '../../models/Login/loginModel';
import qs from 'qs';
import { RolePermission } from './dto/RolePermission';
import http from '../httpService';
// const http = axios.create({
//     baseURL: process.env.REACT_APP_REMOTE_SERVICE_BASE_URL,
//     timeout: 30000,
//     paramsSerializer: function (params) {
//         return qs.stringify(params, {
//             encode: false
//         });
//     }
// });
class LoginService {
    public async CheckTenant(tenantName: string, isRemember?: boolean) {
        const tenancy = tenantName || 'default';

        const result = await http.post('api/services/app/Account/IsTenantAvailable', {
            tenancyName: tenancy
        });

        const tenantId = result.data.result['tenantId'] || 0;

        Cookies.set('Abp.TenantId', tenantName ? tenantId : 'null', {
            expires: isRemember === true ? 1 : undefined
        });

        return result.data.result;
    }

    async Login(loginModel: LoginModel): Promise<boolean> {
        try {
            this.CheckTenant(loginModel.tenancyName, loginModel.rememberMe);
            const requestBody = {
                userNameOrEmailAddress: loginModel.userNameOrEmailAddress,
                password: loginModel.password,
                rememberClient: loginModel.rememberMe
            };
            console.log(loginModel);
            let result = false;
            const tenantId = Cookies.get('Abp.TenantId');
            if (tenantId?.toString() !== '0') {
                const apiResult = await http.post('/api/TokenAuth/Authenticate', requestBody, {
                    headers: {
                        'Abp.TenantId': tenantId,
                        'Content-Type': 'application/json'
                    }
                });
                if (apiResult.status === 200) {
                    if (apiResult.data.success === true) {
                        const tokenExpireDate = loginModel.rememberMe
                            ? new Date(
                                  new Date().getTime() +
                                      1000 * apiResult.data.result.expireInSeconds
                              )
                            : undefined;
                        result = apiResult.data.success;
                        Cookies.set('accessToken', apiResult.data.result['accessToken'], {
                            expires: tokenExpireDate
                        });
                        Cookies.set(
                            'encryptedAccessToken',
                            apiResult.data.result['encryptedAccessToken'],
                            { expires: tokenExpireDate }
                        );
                        Cookies.set('userId', apiResult.data.result['userId'], {
                            expires: tokenExpireDate
                        });
                        Cookies.set('IdNhanVien', apiResult.data.result['idNhanVien'], {
                            expires: tokenExpireDate
                        });
                        loginModel.rememberMe
                            ? Cookies.set('isRememberMe', 'true', { expires: tokenExpireDate })
                            : Cookies.set('isRememberMe', 'false');
                    }
                }
            }
            return result;
        } catch (error) {
            // Handle the error here
            console.error('An error occurred during login:', error);
            return false;
        }
    }
    async GetPermissionByUserId(userId: number, isRemember: boolean) {
        const response = await http.post(
            `api/services/app/Permission/GetAllPermissionByRole?UserId=${userId}`
        );
        const tokenExpireDate =
            Cookies.get('isRememberMe') !== undefined &&
            Cookies.get('isRememberMe')?.toString() == 'true'
                ? new Date(new Date().getTime() + 1000 * 86400)
                : undefined;
        Cookies.set('permissions', JSON.stringify(response.data.result['permissions']), {
            expires: tokenExpireDate
        });
    }
}
export default new LoginService();
