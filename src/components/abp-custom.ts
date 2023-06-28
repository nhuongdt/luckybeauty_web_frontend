import Cookies from 'js-cookie';

class abpClient {
    public isGrandPermission(permission: string) {
        const permissions = Cookies.get('permissions') ?? [''];
        if (permissions.includes(permission) || permission === '') {
            return true;
        }
        return false;
    }
}
export default new abpClient();
