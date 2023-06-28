import { Api, Cookie } from '@mui/icons-material';
import axios from 'axios';
import Cookies from 'js-cookie';
import LoginModel from '../../models/Login/loginModel';
import qs from 'qs';
import { RolePermission } from './dto/RolePermission';
const http = axios.create({
    baseURL: process.env.REACT_APP_REMOTE_SERVICE_BASE_URL,
    timeout: 30000,
    paramsSerializer: function (params) {
        return qs.stringify(params, {
            encode: false
        });
    }
});
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
                        result = apiResult.data.success;
                        Cookies.set('accessToken', apiResult.data.result['accessToken'], {
                            expires: loginModel.rememberMe ? 1 : undefined
                        });
                        Cookies.set(
                            'encryptedAccessToken',
                            apiResult.data.result['encryptedAccessToken'],
                            { expires: loginModel.rememberMe ? 1 : undefined }
                        );
                        Cookies.set('userId', apiResult.data.result['userId'], {
                            expires: loginModel.rememberMe ? 1 : undefined
                        });
                        Cookies.set('IdNhanVien', apiResult.data.result['idNhanVien'], {
                            expires: loginModel.rememberMe ? 1 : undefined
                        });
                        loginModel.rememberMe
                            ? Cookies.set('isRemberMe', 'true', { expires: 1 })
                            : Cookies.set('isRemberMe', 'false');
                        // await this.GetPermissionByUserId(
                        //     apiResult.data.result['userId'],
                        //     loginModel.rememberMe
                        // );
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
        //localStorage.setItem('permissions', JSON.stringify(response.data.result['permissions']));
        Cookies.set('permissions', JSON.stringify(response.data.result['permissions']), {
            expires: isRemember === true ? 1 : undefined
        });
    }
}
export default new LoginService();
