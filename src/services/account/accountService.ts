import { IsTenantAvaibleInput } from './dto/isTenantAvailableInput';
import { RegisterInput } from './dto/registerInput';
import IsTenantAvaibleOutput from './dto/isTenantAvailableOutput';
import { RegisterOutput } from './dto/registerOutput';
import http from '../httpService';
import { resetPasswordInput } from './dto/resetPasswordInput';
import { ResetPasswordOutput } from './dto/resetPasswordOutput';

class AccountService {
    public async isTenantAvailable(
        isTenantAvaibleInput: IsTenantAvaibleInput
    ): Promise<IsTenantAvaibleOutput> {
        const result = await http.post(
            'api/services/app/Account/IsTenantAvailable',
            isTenantAvaibleInput
        );
        return result.data.result;
    }

    public async register(registerInput: RegisterInput): Promise<RegisterOutput> {
        const result = await http.post('api/services/app/Account/Register', registerInput);
        return result.data.result;
    }

    public async ResetPassword(
        resetPasswordInput: resetPasswordInput
    ): Promise<ResetPasswordOutput> {
        const result = await http.post(
            'api/services/app/Account/ResetPassword',
            resetPasswordInput
        );
        return result.data.result;
    }
    public async SendPasswordResetCode(emailAddress: string, tenantId?: number) {
        const responsive = await http.post('api/services/app/Account/SendPasswordResetCode', {
            emailAddress: emailAddress,
            tenantId: tenantId
        });
        return responsive.data.result;
    }
}

export default new AccountService();
