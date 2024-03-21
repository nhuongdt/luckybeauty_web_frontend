import axios from 'axios';
import qs from 'qs';
import { IInforUserZOA, IMemberZOA, ITemplateZNS, IZalo_InforHoaDon, InforZOA, ZaloAuthorizationDto } from './zalo_dto';
import http from '../../httpService';
import { LoaiTin } from '../../../lib/appconst';
import { AnyKindOfDictionary } from 'lodash';

class ZaloService {
    Zalo_GetInforHoaDon = async (arr: string[]): Promise<IZalo_InforHoaDon[] | null> => {
        if (arr.length == 0) return null;
        const result = await http.post('api/services/app/HoaDon/Zalo_GetInforHoaDon?arrIdHoaDon=', arr);
        return result.data.result;
    };
    CreateCodeVerifier_andCodeChallenge = async (): Promise<ZaloAuthorizationDto> => {
        // use c#
        const result = await http.get(`api/services/app/ZaloAuthorization/CreateCodeVerifier_andCodeChallenge`);
        return result.data.result;
    };
    GenerateCodeVerifier = () => {
        /**
         * This function generates a random code verifier for PKCE (Proof Key for Code Exchange).
         * It generates a random string of 43 characters using the characters A-Z, a-z, 0-9, "-", and "_".
         *
         * Returns:
         * string: The generated code verifier
         */
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.';
        let codeVerifier = '';

        for (let i = 0; i < 43; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            codeVerifier += characters[randomIndex];
        }

        return codeVerifier;
    };

    CreateCodeVerifier = (): string => {
        // Tạo một chuỗi ngẫu nhiên có độ dài 40 byte
        let array = new Uint8Array(40);
        array = globalThis.crypto.getRandomValues(array);
        // fromCharCode: chuyen thanh ky tu Unicode
        const xx = String.fromCharCode.apply(null, Array.from(array));
        return this.base64URLEncode(xx);
    };
    base64URLEncode = (str: string): string => {
        const b64 = btoa(str);
        const encoded = b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
        return encoded;
    };
    sha256 = async (input: string): Promise<string> => {
        const encodedInput = new TextEncoder().encode(input);
        const hashedArrayBuffer = await globalThis.crypto.subtle.digest('SHA-256', encodedInput);
        const hashedString = Array.prototype.map
            .call(new Uint8Array(hashedArrayBuffer), (x) => ('00' + x.toString(16)).slice(-2))
            .join('');
        return hashedString;
    };
    GenerateCodeChallenge = async (code_verifier: string) => {
        // hàm này chỉ áp dụng cho https
        // nên đã viết thêm hàm cho code verifier + challenge trong c#
        const hashArray = await globalThis.crypto.subtle.digest(
            { name: 'SHA-256' },
            new TextEncoder().encode(code_verifier)
        );
        const uIntArray = new Uint8Array(hashArray);
        const numberArray = Array.from(uIntArray);
        const hashString = String.fromCharCode.apply(null, numberArray);
        return this.base64URLEncode(hashString);
    };

    GetNewAccessToken_fromRefreshToken = async (refresh_token = '') => {
        const param = {
            refresh_token: refresh_token,
            app_id: process.env.REACT_APP_ZALO_APP_ID,
            grant_type: 'refresh_token'
        };
        const xx = await axios.post(`https://oauth.zaloapp.com/v4/oa/access_token`, param, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                secret_key: process.env.REACT_APP_ZALO_APP_SECRET
            }
        });
        console.log(xx);
        return xx.data;
    };
    GetInfor_ZaloOfficialAccount = async (access_token = ''): Promise<InforZOA> => {
        const xx = await axios.get(`https://openapi.zalo.me/v2.0/oa/getoa`, {
            headers: {
                access_token: access_token
            }
        });
        if (xx.data.error === 0) {
            const dataOA = xx.data.data;
            return {
                oaid: dataOA?.oaid,
                name: dataOA?.name,
                description: xx.data.description,
                oa_alias: dataOA?.oa_alias,
                oa_type: dataOA?.oa_type,
                num_follower: dataOA?.num_follower,
                avatar: dataOA?.avatar,
                package_valid_through_date: dataOA?.package_valid_through_date,
                package_auto_renew_date: dataOA?.package_auto_renew_date,
                linked_ZCA: dataOA?.linked_ZCA
            } as InforZOA;
        }
        return {} as InforZOA;
    };
    GetAccessToken_fromAuthorizationCode = async (athorization_code = '', code_verifier = '') => {
        const param = {
            code: athorization_code,
            app_id: process.env.REACT_APP_ZALO_APP_ID,
            code_verifier: code_verifier,
            grant_type: 'authorization_code'
        };
        const xx = await axios.post(`https://oauth.zaloapp.com/v4/oa/access_token`, param, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                secret_key: process.env.REACT_APP_ZALO_APP_SECRET
            }
        });
        console.log('GetAccessToken_fromAuthorizationCode ', xx, param);
        return {
            access_token: xx.data.access_token,
            refresh_token: xx.data.refresh_token,
            expires_in: xx.data.expires_in
        };
    };
    // danh sách các mẫu template
    GetList_TempFromZNS = async (access_token: string): Promise<ITemplateZNS[]> => {
        const result = await axios.get(`https://business.openapi.zalo.me/template/all?offset=0&limit=100&status=2`, {
            headers: {
                access_token: access_token,
                'Content-Type': 'application/json'
            }
        });
        return result.data.data;
    };
    GetZNSTemplate_byId = async (access_token: string, zns_template_id = '320131') => {
        const result = await axios.get(
            `https://business.openapi.zalo.me/template/info?template_id=${zns_template_id}`,
            {
                headers: {
                    access_token: access_token,
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log('GetZNSTemplate_byId', result.data);
        return result.data.data;
    };
    AssignData_toZNSTemplete = async (access_token: string, zns_template_id = '320131', dataSend: any = null) => {
        const dataTemp = await this.GetZNSTemplate_byId(access_token, zns_template_id);
        const tempdata: any = {};
        for (let i = 0; i < dataTemp?.listParams?.length; i++) {
            const key = dataTemp?.listParams[i]?.name;
            tempdata[key] = '';

            switch (key) {
                case 'TenKhachHang':
                    tempdata[key] = dataSend?.TenKhachHang ?? 'nhuongdt';
                    break;
                case 'MaHoaDon':
                    tempdata[key] = dataSend?.MaHoaDon ?? 'HD001';
                    break;
                case 'NgayLapHoaDon':
                    tempdata[key] = dataSend?.NgayLapHoaDon ?? '15:00 20/03/2024';
                    break;
                case 'TongTienHang':
                    tempdata[key] = dataSend?.TongTienHang ?? '5000000';
                    break;
                case 'BookingDate':
                    tempdata[key] = dataSend?.BookingDate ?? '15:45 19/03/2024';
                    break;
                case 'TenDichVu':
                    tempdata[key] = dataSend?.TenDichVu ?? 'Nhuộm + gội test';
                    break;
                case 'DiaChiCuaHang':
                    tempdata[key] = dataSend?.DiaChiCuaHang ?? '31 Lê Văn Lương';
                    break;
            }
        }
        return tempdata;
    };
    DevMode_GuiTinNhanGiaoDich_ByTempId = async (
        access_token: string,
        zns_template_id = '320131',
        dataSend: any = null
    ) => {
        // lấy mẫu zns
        const tempdata = await this.AssignData_toZNSTemplete(access_token, zns_template_id, dataSend);
        const param = {
            // mode: 'development',
            phone: dataSend?.soDienThoai,
            template_id: zns_template_id,
            template_data: tempdata
        };
        const result = await axios.post(`https://business.openapi.zalo.me/message/template`, param, {
            headers: {
                access_token: access_token,
                'Content-Type': 'application/json'
            }
        });
        console.log('DevMode_GuiTinNhan_ByTempId', result.data);
        return {
            msg_id: result.data.msg_id,
            sent_time: result.data.sent_time,
            error: result.data.error
        };
    };
    GuiTinNhan_HasPhone = async (access_token: string, zns_template_id = '320131') => {
        const tempdata = await this.AssignData_toZNSTemplete(access_token, zns_template_id);
        const hasPhone = await this.sha256('+84355599770');
        console.log('hasphobne ', hasPhone);
        const param = {
            phone: hasPhone,
            template_id: zns_template_id,
            template_data: tempdata
        };
        const result = await axios.post(`https://business.openapi.zalo.me/message/template/hashphone`, param, {
            headers: {
                access_token: access_token,
                'Content-Type': 'application/json'
            }
        });
        console.log('GuiTinNhan_HasPhone', result.data);
    };

    GuiTinNhanGiaoDich_WithMyTemp = async (access_token: string, user_id: string) => {
        const dataPost = `{
            "recipient": {
                "user_id": ${user_id}
            },
            "message": {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "transaction_transaction",
                        "elements": [
                            {
                                "attachment_id":"aERC3A0iYGgQxim8fYIK6fxzsXkaFfq7ZFRB3RCyZH6RyziRis3RNydebK3iSPCJX_cJ3k1nW1EQufjN_pUL1f6Ypq3rTef5nxp6H_HnXKFDiyD5y762HS-baqRpQe5FdA376lTfq1sRyPr8ypd74ecbaLyA-tGmuJ-97W",
                                "type": "banner"
                            },
                            {
                                "type": "header",
                                "content": "💥💥Ưu đãi thành viên Platinum💥💥"
                            },
                            {
                                "type": "text",
                                "align": "left",
                                "content": "Ưu đãi dành riêng cho khách hàng Nguyen Van A hạng thẻ Platinum<br>Voucher trị giá 150$"
                            },
                            {
                                "type": "table",
                                "content": [
                                    {
                                        "value": "VC09279222",
                                        "key": "Voucher"
                                    },
                                    {
                                        "value": "30/12/2023",
                                        "key": "Hạn sử dụng"
                                    }
                                ]
                            },
                            {
                                "type": "text",
                                "align": "center",
                                "content": "Áp dụng tất cả cửa hàng trên toàn quốc"
                            }
                        ],
                        "buttons": [
                            {
                                "title": "Tham khảo chương trình",
                                "image_icon": "",
                                "type": "oa.open.url", 
                                "payload": { 
                                   "url": "https://oa.zalo.me/home" 
                                           }
                                },
                                {
                                "title": "Liên hệ chăm sóc viên",
                                "image_icon": "aeqg9SYn3nIUYYeWohGI1fYRF3V9f0GHceig8Ckq4WQVcpmWb-9SL8JLPt-6gX0QbTCfSuQv40UEst1imAm53CwFPsQ1jq9MsOnlQe6rIrZOYcrlWBTAKy_UQsV9vnfGozCuOvFfIbN5rcXddFKM4sSYVM0D50I9eWy3",
                                "type": "oa.query.hide",
                                "payload": "#tuvan"
                                
                            }
                        ]
                    }
                    }
                }
            }
        }`;
        const param = qs.stringify(dataPost);
        console.log('Zalo_GuiTinNhanTruyenThuong ', param);

        const result = await axios.post('https://openapi.zalo.me/v3.0/oa/message/transaction', param, {
            headers: {
                access_token: access_token,
                'Content-Type': 'application/json'
            }
        });
        return result.data;
        // console.log('zalo test ', result);
    };
    GetDanhSach_KhachHang_QuanTamOA = async (access_token: string) => {
        const xx = await axios.get(`https://openapi.zalo.me/v2.0/oa/getfollowers?data={"offset":0,"count":50}`, {
            headers: {
                access_token: access_token,
                'Content-Type': 'application/json'
            }
        });
        if (xx.data.error == 0) {
            return xx.data.data;
        }
        return {
            total: 0,
            followers: []
        };
    };
    GetInforUser_ofOA = async (access_token: string, user_id: string): Promise<IInforUserZOA | null> => {
        const xx = await axios.get(`https://openapi.zalo.me/v2.0/oa/getprofile?data={"user_id":"${user_id}"}`, {
            headers: {
                access_token: access_token
            }
        });
        if (xx.data.error === 0) {
            return xx.data.data;
        }
        return null;
    };
    async ZaloWebhook_UserSendMessage() {
        const res = await http.get(`/api/zalo/webhook/user-send-message`);
        return res.data;
    }
    GuiTinTuVan = async (access_token: string, userId = '6441788310775550433', noiDungTin = '') => {
        const param = {
            recipient: {
                user_id: userId
            },
            message: {
                text: noiDungTin
            }
        };
        const result = await axios.post('https://openapi.zalo.me/v3.0/oa/message/cs', param, {
            headers: {
                access_token: access_token,
                'Content-Type': 'application/json'
            }
        });
        return result.data;
    };
    NguoiDung_ChiaSeThongTin_ChoOA = async (
        accountZOA: InforZOA,
        access_token: string,
        userId = '6441788310775550433'
    ) => {
        const param = {
            recipient: {
                user_id: userId
            },
            message: {
                attachment: {
                    type: 'template',
                    payload: {
                        template_type: 'request_user_info',
                        elements: [
                            {
                                title: `Chào mừng bạn đến với ${accountZOA?.name} trên Zalo`,
                                subtitle: 'Đăng ký thành viên để nhận thông tin ưu đãi hấp dẫn',
                                image_url: `https://s160-ava-talk.zadn.vn/5/e/8/3/1/160/8d29e3e630fce223d73a577f693e1235.jpg`
                            }
                        ]
                    }
                }
            }
        };
        const result = await axios.post('https://openapi.zalo.me/v3.0/oa/message/cs', param, {
            headers: {
                access_token: access_token,
                'Content-Type': 'application/json'
            }
        });
        console.log('NguoiDung_ChiaSeThongTin_ChoOA ', result);
    };

    /// Db
    GetTokenfromDB = async (): Promise<ZaloAuthorizationDto> => {
        const xx = await http.get(`api/services/app/ZaloAuthorization/GetForEdit`);
        return xx.data.result;
    };
    InsertCodeVerifier = async (input: ZaloAuthorizationDto): Promise<ZaloAuthorizationDto> => {
        console.log('InsertCodeVerifier ', input);
        const result = await http.post(`api/services/app/ZaloAuthorization/Insert`, input);
        return result.data.result;
    };
    UpdateZaloToken = async (input: ZaloAuthorizationDto): Promise<ZaloAuthorizationDto> => {
        console.log('UpdateZaloToken ', input);
        const result = await http.post(`api/services/app/ZaloAuthorization/Update`, input);
        return result.data.result;
    };
    XoaKetNoi = async (id: string): Promise<string> => {
        const result = await http.get(`api/services/app/ZaloAuthorization/XoaKetNoi?id=${id}`);
        return result.data.result;
    };

    DangKyThanhVienZOA = async (input: IMemberZOA): Promise<IMemberZOA> => {
        const result = await http.post(`api/services/app/Zalo_KhachHangThanhVien/DangKyThanhVienZOA`, input);
        return result.data.result;
    };
}

export default new ZaloService();
