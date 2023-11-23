import axios from 'axios';
import qs from 'qs';
import { InforZOA } from './zalo_dto';

class ZaloService {
    dec2hex = (dec: any) => {
        return ('0' + dec.toString(16)).substring(-2);
    };

    CreateCodeVerifier = (): string => {
        // Tạo một chuỗi ngẫu nhiên có độ dài 32 byte
        let array = new Uint8Array(32);
        array = globalThis.crypto.getRandomValues(array);
        return Array.from(array, this.dec2hex).join('');
        // const xx = String.fromCharCode.apply(null, Array.from(array));
        // return xx;
        // return this.base64URLEncode(xx);
    };
    base64URLEncode = (str: string): string => {
        const b64 = btoa(str);
        const encoded = b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
        return encoded;
    };
    GenerateCodeChallenge = async (code_verifier: string) => {
        const hashArray = await crypto.subtle.digest({ name: 'SHA-256' }, new TextEncoder().encode(code_verifier));
        // const endcode = Buffer.from(code_verifier, 'utf8').toString('base64');
        const uIntArray = new Uint8Array(hashArray);
        const numberArray = Array.from(uIntArray);
        const hashString = String.fromCharCode.apply(null, numberArray);
        return this.base64URLEncode(hashString);
    };
    CreateAcccesToken = async () => {
        const param = {
            secret_key: process.env.REACT_APP_ZALO_APP_SECRET,
            app_id: process.env.REACT_APP_ZALO_APP_ID,
            grant_type: 'authorization_code'
        };
        const xx = await axios.post(`https://oauth.zaloapp.com/v4/oa/access_token`, param, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        return xx;
    };
    GetNewToken_fromRefreshToken = async (refresh_token = process.env.REACT_APP_ZALO_REFRESH_TOKEN) => {
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
        const xx = await axios.get(`https://openapi.zalo.me/v2.0/oa/getoa?access_token=${access_token}`);
        console.log('GetInfor_ZaloOfficialAccount ', xx);

        if (xx.status === 200) {
            return {
                oaid: xx.data.oaid,
                name: xx.data.name,
                description: xx.data.description,
                oa_alias: xx.data.oa_alias,
                oa_type: xx.data.oa_type,
                num_follower: xx.data.num_follower,
                avatar: xx.data.avatar,
                package_valid_through_date: xx.data.package_valid_through_date,
                package_auto_renew_date: xx.data.package_auto_renew_date,
                linked_ZCA: xx.data.linked_ZCA
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
        if (xx.status === 200) {
            return {
                access_token: xx.data.access_token,
                refresh_token: xx.data.refresh_token,
                expires_in: xx.data.expires_in
            };
        }
        return null;
    };
    GuiTinNhanTruyenThuong = async (params: any) => {
        const dataPost = `{
            "recipient": {
                "user_id": "4356639876691778517"
            },
            "message": {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "promotion",
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

        // const result = await axios.post('https://openapi.zalo.me/v3.0/oa/message/promotion', param, {
        //     headers: {
        //         access_token: process.env.REACT_APP_ZALO_ACCESS_TOKEN,
        //         'Content-Type': 'application/json'
        //     }
        // });
        // console.log('zalo test ', result);
    };
    GetDanhSach_KhachHang_QuanTamOA = async (newToken: string) => {
        const xx = await axios.get(`https://openapi.zalo.me/v2.0/oa/getfollowers?data={"offset":0,"count":50}`, {
            headers: {
                access_token: newToken,
                'Content-Type': 'application/json'
            }
        });
    };
    GuiTinTuVan = async () => {
        const param = {
            recipient: {
                user_id: '6441788310775550433'
            },
            message: {
                text: 'test send mes nhuongdt from app lucky beauty'
            }
        };
        const result = await axios.post('https://openapi.zalo.me/v3.0/oa/message/cs', param, {
            headers: {
                access_token: process.env.REACT_APP_ZALO_ACCESS_TOKEN,
                'Content-Type': 'application/json'
            }
        });
        console.log('GuiTinTuVan ', result);
    };
}

export default new ZaloService();
