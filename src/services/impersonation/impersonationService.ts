import Cookies from 'js-cookie';
import authenticationStore from '../../stores/authenticationStore';
import accountService from '../account/accountService';
import { AppUrlService } from '../appUrlService';

class ImpersonationService {
    public impersonate(userId: number, tenantId?: number) {
        accountService
            .impersonate({ tenantId: tenantId, userId: userId })
            .then((response) => {
                authenticationStore.logout(false);
                const appUrlService = new AppUrlService();
                let targetUrl =
                    appUrlService.getAppRootUrlOfTenant(response.tenancyName) +
                    '?impersonationToken=' +
                    response.impersonationToken;
                if (tenantId) {
                    targetUrl = targetUrl + '&tenantId=' + tenantId;
                    Cookies.set('Abp.TenantId', tenantId.toString());
                }

                location.href = targetUrl;
            })
            .catch((ex) => {
                console.log(ex);
            })
            .catch((ex) => console.log(ex));
    }

    public backToImpersonate() {
        accountService
            .backToImpersonator()
            .then((response) => {
                authenticationStore.logout(false);
                const appUrlService = new AppUrlService();
                let targetUrl =
                    appUrlService.getAppRootUrlOfTenant(response.tenancyName) +
                    '?impersonationToken=' +
                    response.impersonationToken;
                if (Cookies.get('Abp.TenantId')) {
                    targetUrl = targetUrl + '&tenantId=' + Cookies.get('Abp.TenantId');
                }

                location.href = targetUrl;
            })
            .catch((ex) => {
                console.log(ex);
            })
            .catch((ex) => console.log(ex));
    }
}
export default new ImpersonationService();
