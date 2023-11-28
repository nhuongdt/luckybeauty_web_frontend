import { Guid } from 'guid-typescript';

export class PageResultCustomerCareOA {
    total!: number;
    followers!: [];
}

export interface InforZOA {
    oaid: string;
    name: string;
    description: string;
    oa_alias: string;
    oa_type: string;
    num_follower: string;
    avatar: string;
    package_valid_through_date: string;
    package_auto_renew_date: string;
    linked_ZCA: string;
}
export interface IInforUserZOA {
    avatar: string;
    display_name: string;
    birth_date: number;
    user_gender: number;
    user_id: string;
    user_id_by_app: string;
    idKhachHang?: string;
}

export interface IMemberZOA {
    idKhachHang: string;
    memberName: string;
    memberPhone: string;
    zoaUserId: string;
}

export class ZaloAuthorizationDto {
    id = Guid.EMPTY;
    codeVerifier: string;
    codeChallenge: string;
    authorizationCode: string;
    accessToken: string;
    refreshToken: string;
    expiresToken: string;
    isExpiresAccessToken: boolean;

    constructor({
        id = Guid.EMPTY,
        codeVerifier = '',
        codeChallenge = '',
        authorizationCode = '',
        accessToken = '',
        refreshToken = '',
        expiresToken = '0',
        isExpiresAccessToken = false
    }) {
        this.id = id;
        this.codeVerifier = codeVerifier;
        this.codeChallenge = codeChallenge;
        this.authorizationCode = authorizationCode;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.expiresToken = expiresToken;
        this.isExpiresAccessToken = isExpiresAccessToken;
    }
}
