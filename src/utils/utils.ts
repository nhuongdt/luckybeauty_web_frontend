/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable prefer-const */
// import * as abpTypings from '../lib/abp'

// import { L } from '../lib/abpUtility'
import { flatRoutes } from '../components/routers/index';

declare let abp: any;

class Utils {
    GuidEmpty = '00000000-0000-0000-0000-000000000000';
    pageOption = [10, 20, 30, 40, 50];
    loadScript(url: string) {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        document.body.appendChild(script);
    }

    extend(...args: any[]) {
        let options,
            name,
            src,
            srcType,
            copy,
            copyIsArray,
            clone,
            target = args[0] || {},
            i = 1,
            length = args.length,
            deep = false;
        if (typeof target === 'boolean') {
            deep = target;
            target = args[i] || {};
            i++;
        }
        if (typeof target !== 'object' && typeof target !== 'function') {
            target = {};
        }
        if (i === length) {
            target = this;
            i--;
        }
        for (; i < length; i++) {
            if ((options = args[i]) !== null) {
                for (name in options) {
                    src = target[name];
                    copy = options[name];
                    if (target === copy) {
                        continue;
                    }
                    srcType = Array.isArray(src) ? 'array' : typeof src;
                    if (
                        deep &&
                        copy &&
                        ((copyIsArray = Array.isArray(copy)) || typeof copy === 'object')
                    ) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && srcType === 'array' ? src : [];
                        } else {
                            clone = src && srcType === 'object' ? src : {};
                        }
                        target[name] = this.extend(deep, clone, copy);
                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }

        return target;
    }

    getPageTitle = (pathname: string) => {
        const route = flatRoutes.filter((route: { path: string }) => route.path === pathname);
        const localizedAppName = 'AppName';
        if (!route || route.length === 0) {
            return localizedAppName;
        }

        return route[0].title + ' | ' + localizedAppName;
    };

    getRoute = (path: string): any => {
        return flatRoutes.filter((route: { path: string }) => route.path === path)[0];
    };

    setLocalization() {
        if (!abp.utils.getCookieValue('Abp.Localization.CultureName')) {
            const language = navigator.language;
            abp.utils.setCookieValue(
                'Abp.Localization.CultureName',
                language,
                new Date(new Date().getTime() + 5 * 365 * 86400000),
                abp.appPath
            );
        }
    }
    strToEnglish = (word: string) => {
        if (!word) return '';
        let str = word.trim();
        str = str.toLowerCase();
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
        str = str.replace(/đ/g, 'd');
        str = str.replace(/^\\-+|\\-+$/g, '');

        // Some system encode vietnamese combining accent as individual utf-8 characters
        str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ''); // Huyền sắc hỏi ngã nặng
        str = str.replace(/\u02C6|\u0306|\u031B/g, ''); // Â, Ê, Ă, Ơ, Ư

        return str;
    };
    getFirstLetter = (str = '') => {
        return str
            ?.match(/(?<=(\s|^))[a-z]/gi)
            ?.join('')
            ?.toUpperCase();
    };
    Remove_LastComma = (str: string | null | undefined) => {
        if (str !== null && str !== undefined && str.length > 1) {
            return str.replace(/(^[,\s]+)|([,\s]+$)/g, '');
        } else {
            return '';
        }
    };
    checkNull = (input: string | null | undefined) => {
        return input === null || input === undefined || input.toString().replace(/\s+/g, '') === '';
    };
    formatNumberToFloat = (objVal: any) => {
        if (objVal === undefined || objVal === null) {
            return 0;
        } else {
            const value = parseFloat(objVal.toString().replace(/,/g, ''));
            if (isNaN(value)) {
                return 0;
            } else {
                return value;
            }
        }
    };
    formatNumber = (number: string | number) => {
        if (number === undefined || number === null) {
            return 0;
        } else {
            const toFloat = number.toString().replace(/,/g, '');
            return toFloat.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
    };
    keypressNumber_limitNumber = (event: any) => {
        const keyCode = event.keyCode || event.which;
        const val = event.target.value;

        // 46(.), 48(0), 57(9)
        if ((keyCode !== 46 || val.indexOf('.') !== -1) && (keyCode < 48 || keyCode > 57)) {
            if (event.which !== 46 || val.indexOf('.') !== -1) {
                //alert('Chỉ được nhập một dấu .');
            }
            event.preventDefault();
        }
    };
}

export default new Utils();
