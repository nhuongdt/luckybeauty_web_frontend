import { Button, Grid, Stack, Typography } from '@mui/material';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import CakeOutlinedIcon from '@mui/icons-material/CakeOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { IOSSwitch } from '../../../../components/Switch/IOSSwitch';
import { ReactComponentElement, useEffect, useState } from 'react';
import { Dataset, SvgIconComponent } from '@mui/icons-material';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import { LoaiTin, TypeAction } from '../../../../lib/appconst';
import ModalCaiDatNhacNho from './modal_cai_dat_nhac_nho';
import { MauTinSMSDto } from '../../../../services/sms/mau_tin_sms/mau_tin_dto';
import MauTinSMService from '../../../../services/sms/mau_tin_sms/MauTinSMService';
import { Guid } from 'guid-typescript';
import {
    CaiDatNhacNhoChiTietDto,
    CaiDatNhacNhoDto
} from '../../../../services/sms/cai_dat_nhac_nho/cai_dat_nhac_nho_dto';
import CaiDatNhacNhoService from '../../../../services/sms/cai_dat_nhac_nho/CaiDatNhacNhoService';
import SnackbarAlert from '../../../../components/AlertDialog/SnackbarAlert';

interface ICaiDatNhacNho {
    id: string;
    type: number;
    icon?: ReactComponentElement<SvgIconComponent>;
    title?: string;
    text: string;
    trangThai: number;
    listButton?: IButtonCaiDatNhacNho[];
}
interface IButtonCaiDatNhacNho {
    id: string;
    text: string;
    value: number;
    trangThai: number;
}

export default function PageCaiDatNhacTuDong({ aa }: any) {
    const lstButton: IButtonCaiDatNhacNho[] = [
        {
            id: Guid.EMPTY,
            text: '', // nút xóa
            value: 0,
            trangThai: 0
        },
        {
            id: Guid.EMPTY,
            text: 'Sms',
            value: 1,
            trangThai: 0 // 1.active, 0.no active
        },
        {
            id: Guid.EMPTY,
            text: 'Zalo',
            value: 2,
            trangThai: 0
        }
    ];
    const [arrSetup, setArrSetup] = useState<ICaiDatNhacNho[]>([
        {
            id: Guid.EMPTY,
            type: LoaiTin.TIN_SINH_NHAT,
            icon: <CakeOutlinedIcon sx={{ color: '#800AC7' }} />,
            title: 'Sinh nhật',
            text: 'Gửi lời chúc mừng vào ngày sinh nhật của khách hàng',
            trangThai: 0,
            listButton: lstButton
        },
        {
            id: Guid.EMPTY,
            type: LoaiTin.TIN_LICH_HEN,
            icon: <NotificationsNoneOutlinedIcon sx={{ color: '#FF7DA1', width: 30, height: 30 }} />,
            title: 'Nhắc nhở cuộc hẹn',
            text: 'Gửi để nhắc nhở khách hàng về cuộc hẹn sắp tới',
            trangThai: 0,
            listButton: lstButton
        },

        {
            id: Guid.EMPTY,
            type: LoaiTin.TIN_GIAO_DICH,
            icon: <ReceiptOutlinedIcon sx={{ color: '#50CD89' }} />,
            title: 'Giao dịch',
            text: 'Gửi thông báo cho khách hàng sau khi thực hiện giao dịch',
            trangThai: 0,
            listButton: lstButton
        }
    ]);

    const [isShowModalSetup, setIsShowModalSetup] = useState(false);
    const [idLoaiTin, setIdLoaiTin] = useState(0);
    const [idSetup, setIdSetup] = useState('');
    const [lstAllMauTinSMS, setLstAllMauTinSMS] = useState<MauTinSMSDto[]>([]);
    const [objAlert, setObjAlert] = useState({ show: false, type: 1, mes: '' });

    const GetAllMauTinSMS = async () => {
        const data = await MauTinSMService.GetAllMauTinSMS();
        if (data !== null) {
            setLstAllMauTinSMS(data);
        }
    };
    const GetAllCaiDatNhacNho = async () => {
        const data = await CaiDatNhacNhoService.GetAllCaiDatNhacNho();
        if (data !== null) {
            // setLstSetupNhacNhoDB(data);
            // get data was settup
            const arr = data?.map((x: CaiDatNhacNhoDto) => {
                return x.idLoaiTin;
            });
            setArrSetup(
                arrSetup.map((x: ICaiDatNhacNho) => {
                    if (arr.includes(x.type)) {
                        const itEx = data.filter((o: CaiDatNhacNhoDto) => o.idLoaiTin == x.type);
                        if (itEx.length > 0) {
                            return {
                                ...x,
                                id: itEx[0].id,
                                trangThai: itEx[0].trangThai,
                                listButton: x.listButton?.map((oo: IButtonCaiDatNhacNho) => {
                                    const itHinhThuc = itEx[0].caiDatNhacNhoChiTiets?.filter(
                                        (o: CaiDatNhacNhoChiTietDto) => o.hinhThucGui == oo.value
                                    );
                                    if (itHinhThuc !== undefined && itHinhThuc?.length > 0) {
                                        return { ...oo, id: itHinhThuc[0].id, trangThai: itHinhThuc[0].trangThai };
                                    } else {
                                        return oo;
                                    }
                                })
                            };
                        } else {
                            return x;
                        }
                    } else {
                        return x;
                    }
                })
            );
        }
    };

    useEffect(() => {
        GetAllMauTinSMS();
        GetAllCaiDatNhacNho();
    }, []);

    const showModalSetup = (item: ICaiDatNhacNho) => {
        setIsShowModalSetup(true);
        setIdLoaiTin(item.type);
        setIdSetup(item.id);
    };

    const saveDataSetup = async (item: ICaiDatNhacNho, trangThai = 0): Promise<CaiDatNhacNhoDto> => {
        if (item.id === Guid.EMPTY) {
            const objSetUp: CaiDatNhacNhoDto = new CaiDatNhacNhoDto({
                id: Guid.EMPTY,
                idLoaiTin: item.type,
                idMauTin: null,
                noiDungTin: '',
                nhacTruocKhoangThoiGian: 0,
                loaiThoiGian: 0,
                trangThai: trangThai
            });
            const data = await CaiDatNhacNhoService.CreateCaiDatNhacNho(objSetUp);
            return data;
        } else {
            // get data from DB
            const data = await CaiDatNhacNhoService.CaiDatNhacNho_UpdateTrangThai(item.id, trangThai);
            return data;
        }
    };

    const changeTrangThai = async (item: ICaiDatNhacNho, event: React.ChangeEvent<HTMLInputElement>) => {
        const check = event.target.checked;
        const trangThai = check ? 1 : 0;

        const dataSetup = await saveDataSetup(item, trangThai);
        setObjAlert({
            ...objAlert,
            show: true,
            mes: `Bạn vừa ${trangThai == 1 ? 'kích hoạt' : 'tắt'} tự động gửi tin cho ${item.title}`
        });

        // turn on/off details
        const idSetup = dataSetup.id;
        const arrDetail: CaiDatNhacNhoChiTietDto[] = [];
        if (item.listButton != undefined) {
            for (let i = 0; i < item.listButton?.length; i++) {
                const itDetail = item.listButton[i];
                if (itDetail.value !== 0) {
                    // = 0: nut xoa
                    const objDetail = {
                        id: itDetail.id,
                        idCaiDatNhacTuDong: idSetup,
                        hinhThucGui: itDetail.value,
                        trangThai: trangThai
                    } as CaiDatNhacNhoChiTietDto;

                    const dataDetail = await CaiDatNhacNhoService.CreateOrUpdateCaiDatNhacNhoChiTiet(
                        idSetup,
                        objDetail
                    );
                    arrDetail.push(dataDetail);
                }
            }
            setArrSetup(
                arrSetup?.map((o: ICaiDatNhacNho) => {
                    if (o.type === item.type) {
                        return {
                            ...o,
                            id: idSetup, // !important: assign again idnew for parent
                            trangThai: trangThai,
                            listButton: o.listButton?.map((xx: IButtonCaiDatNhacNho) => {
                                const ex = arrDetail.filter((x: CaiDatNhacNhoChiTietDto) => x.hinhThucGui == xx.value);
                                if (ex.length > 0) {
                                    return { ...xx, id: ex[0].id, trangThai: trangThai };
                                } else {
                                    return xx;
                                }
                            })
                        };
                    } else {
                        return o;
                    }
                })
            );
        }
    };

    const saveCaiDatOK = (objSetup: CaiDatNhacNhoDto, typeAction: number) => {
        setArrSetup(
            arrSetup?.map((o: ICaiDatNhacNho) => {
                if (o.type === objSetup.idLoaiTin) {
                    return { ...o, id: objSetup.id, trangThai: objSetup.trangThai };
                } else {
                    return o;
                }
            })
        );
        setIsShowModalSetup(false);
    };

    const saveCaiDatNhacNhoChiTiet = async (
        itemSetup: ICaiDatNhacNho,
        itemHinhThuc: IButtonCaiDatNhacNho,
        trangthai = 0
    ) => {
        const trangThaiNew = trangthai == 0 ? 1 : 0;
        let idSetup = itemSetup.id;
        if (idSetup === Guid.EMPTY) {
            const dataSetup = await saveDataSetup(itemSetup, itemSetup.trangThai);
            idSetup = dataSetup.id;
        }
        // save detail
        const objDetail = {
            id: itemHinhThuc.id,
            idCaiDatNhacTuDong: idSetup,
            hinhThucGui: itemHinhThuc.value,
            trangThai: trangThaiNew
        } as CaiDatNhacNhoChiTietDto;

        const dataDetail = await CaiDatNhacNhoService.CreateOrUpdateCaiDatNhacNhoChiTiet(idSetup, objDetail);

        setArrSetup(
            arrSetup?.map((o: ICaiDatNhacNho) => {
                if (o.type === itemSetup.type) {
                    return {
                        ...o,
                        id: idSetup,
                        listButton: o.listButton?.map((xx: IButtonCaiDatNhacNho) => {
                            if (xx.value === itemHinhThuc.value) {
                                return { ...xx, id: dataDetail.id, trangThai: trangThaiNew }; // assign again id for detail
                            } else {
                                return xx;
                            }
                        })
                    };
                } else {
                    return o;
                }
            })
        );
        setObjAlert({
            ...objAlert,
            show: true,
            mes: `Bạn vừa ${trangThaiNew == 1 ? 'bật' : 'tắt'}  ${itemHinhThuc.text} cho ${itemSetup.title}`
        });
    };
    return (
        <>
            <ModalCaiDatNhacNho
                visiable={isShowModalSetup}
                onCancel={() => setIsShowModalSetup(false)}
                lstMauTinSMS={lstAllMauTinSMS}
                idLoaiTin={idLoaiTin}
                idSetup={idSetup}
                onOK={saveCaiDatOK}
            />
            <SnackbarAlert
                showAlert={objAlert.show}
                type={objAlert.type}
                title={objAlert.mes}
                handleClose={() => setObjAlert({ show: false, mes: '', type: 1 })}></SnackbarAlert>
            <Grid container spacing={3} paddingTop={2}>
                <Grid item xs={12}>
                    <Typography fontSize={18} fontWeight={600}>
                        Tin nhắn tự động
                    </Typography>
                </Grid>
                {arrSetup?.map((item: ICaiDatNhacNho, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={4} key={index}>
                        <Stack
                            spacing={4}
                            padding={'20px 24px'}
                            sx={{ border: '1px solid #ccc', borderRadius: '8px', backgroundColor: 'white' }}>
                            <Stack spacing={1.5}>
                                <Stack direction={'row'} justifyContent={'space-between'}>
                                    <Stack spacing={1} direction={'row'} alignItems={'center'}>
                                        {item.icon}

                                        <Typography fontWeight={600} fontSize={16} onClick={() => showModalSetup(item)}>
                                            {item?.title}
                                        </Typography>
                                    </Stack>
                                    <IOSSwitch
                                        sx={{ m: 1 }}
                                        value={item?.trangThai}
                                        checked={item?.trangThai == 1 ? true : false}
                                        onChange={(e) => changeTrangThai(item, e)}
                                    />
                                </Stack>
                                <Typography fontSize={14}> {item?.text}</Typography>
                            </Stack>

                            <Stack direction={'row'} spacing={1} justifyContent={'end'} alignItems={'center'}>
                                {item.listButton?.map((itemButton: IButtonCaiDatNhacNho, indexButton) => (
                                    <div key={indexButton}>
                                        {itemButton?.text == '' ? (
                                            <div></div>
                                        ) : (
                                            // <Button
                                            //     variant="outlined"
                                            //     sx={{
                                            //         border: '1px solid #ccc',
                                            //         bgcolor: '#fff',
                                            //         minWidth: 'unset',
                                            //         width: '36.5px',
                                            //         height: '36.5px',
                                            //         borderRadius: '4px'
                                            //     }}>
                                            //     <DeleteOutlinedIcon sx={{ color: '#cccc' }} />
                                            // </Button>
                                            <Button
                                                variant="outlined"
                                                onClick={() =>
                                                    saveCaiDatNhacNhoChiTiet(item, itemButton, itemButton?.trangThai)
                                                }
                                                startIcon={
                                                    itemButton?.trangThai == 1 ? (
                                                        <CheckOutlinedIcon sx={{ color: '#50CD89' }} />
                                                    ) : (
                                                        <CloseOutlinedIcon sx={{ color: 'red' }} />
                                                    )
                                                }
                                                sx={{ color: 'black', borderColor: '#ccc' }}>
                                                {itemButton.text}
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </Stack>
                        </Stack>
                    </Grid>
                ))}
            </Grid>
        </>
    );
}
