import { action, makeAutoObservable, makeObservable, observable, observe } from 'mobx';

// import AppConsts from './../lib/appconst'
import LoginModel from '../models/Login/loginModel';
import tokenAuthService from '../services/tokenAuth/tokenAuthService';
import Cookies from 'js-cookie';
import { AuthenticationResultModel } from '../services/tokenAuth/dto/authenticationResultModel';
import loginService from '../services/login/loginService';
import http from '../services/httpService';

//declare let abp: any

class AuthenticationStore {
    loginModel: LoginModel = new LoginModel();
    loginResultModel!: AuthenticationResultModel;
    get isAuthenticated(): boolean {
        if (!Cookies.get('userId')) {
            return false;
        }

        return true;
    }

    public async login(model: LoginModel, tenantName: string) {
        await loginService.CheckTenant(tenantName);
        const LoginResult = await tokenAuthService.authenticate({
            userNameOrEmailAddress: model.userNameOrEmailAddress,
            password: model.password,
            rememberClient: model.rememberMe
        });
        this.loginResultModel = LoginResult;
        const tokenExpireDate = model.rememberMe
            ? new Date(new Date().getTime() + 1000 * LoginResult.expireInSeconds)
            : undefined;
        Cookies.set('accessToken', LoginResult.accessToken, { expires: tokenExpireDate });
        Cookies.set('encryptedAccessToken', LoginResult.encryptedAccessToken, {
            expires: tokenExpireDate,
            path: '/'
        });
        Cookies.set('userId', LoginResult.userId.toString(), {
            expires: tokenExpireDate
        });
        Cookies.set('IdNhanVien', LoginResult.idNhanVien, {
            expires: tokenExpireDate
        });
        model.rememberMe
            ? Cookies.set('isRememberMe', 'true', { expires: tokenExpireDate })
            : Cookies.set('isRememberMe', 'false');
    }

    async logout(reload?: boolean, returnUrl?: string) {
        await http
            .get('api/TokenAuth/LogOut', {
                headers: {
                    'Abp.TenantId': Cookies.get('Abp.TenantId'),
                    Authorization: 'Bearer ' + Cookies.get('accessToken')
                }
            })
            .then((result) => {
                localStorage.clear();
                sessionStorage.clear();
                // get an array of all cookie names
                Object.keys(Cookies.get()).forEach((cookieName) => {
                    Cookies.remove(cookieName);
                });
                if (reload !== false) {
                    if (returnUrl) {
                        location.href = returnUrl;
                    } else {
                        location.href = '';
                    }
                }
            })
            .catch((ex) => console.error(ex));
    }

    constructor() {
        makeAutoObservable(this);
    }
}
export default new AuthenticationStore();
