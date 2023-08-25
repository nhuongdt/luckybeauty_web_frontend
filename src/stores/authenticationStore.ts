import { action, makeAutoObservable, makeObservable, observable, observe } from 'mobx';

// import AppConsts from './../lib/appconst'
import LoginModel from '../models/Login/loginModel';
import tokenAuthService from '../services/tokenAuth/tokenAuthService';
import Cookies from 'js-cookie';
import { AuthenticationResultModel } from '../services/tokenAuth/dto/authenticationResultModel';
import loginService from '../services/login/loginService';

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

    logout() {
        localStorage.clear();
        sessionStorage.clear();
        // get an array of all cookie names
        const cookieNames = Object.keys(Cookies.get());

        // loop through each cookie name and remove the cookie
        cookieNames.forEach((cookieName) => {
            Cookies.remove(cookieName);
        });
    }

    constructor() {
        makeAutoObservable(this);
    }
}
export default AuthenticationStore;
