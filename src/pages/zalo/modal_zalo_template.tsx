import { useEffect, useState } from 'react';
import {
    Grid,
    Stack,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    Checkbox,
    Button,
    Typography,
    Tab
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CreditScoreOutlinedIcon from '@mui/icons-material/CreditScoreOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import CakeOutlinedIcon from '@mui/icons-material/CakeOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { Add, Close, VoiceChatRounded } from '@mui/icons-material';
import SnackbarAlert from '../../components/AlertDialog/SnackbarAlert';
import { PropConfirmOKCancel } from '../../utils/PropParentToChild';
import ConfirmDelete from '../../components/AlertDialog/ConfirmDelete';
import SelectWithData from '../../components/Select/SelectWithData';
import DialogButtonClose from '../../components/Dialog/ButtonClose';
import abpCustom from '../../components/abp-custom';
import utils from '../../utils/utils';
import { Guid } from 'guid-typescript';
import { ISelect, LoaiTin } from '../../lib/appconst';
import { ZaloConst } from '../../lib/zaloConst';
import ZaloService from '../../services/zalo/ZaloService';
import { IZaloButtonDetail, IZaloElement, IZaloTableDetail, IZaloTemplate } from '../../services/zalo/ZaloTemplateDto';
import uploadFileService from '../../services/uploadFileService';
import { ZaloTemplateView } from './zalo_template_view';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import TokenZalo, { ListZaloToken_CuaHang, ListZaloToken_HoaDon, ListZaloToken_KhachHang } from './ToKenZalo';
import AutocompleteWithData from '../../components/Autocomplete/AutocompleteWithData';
import { IDataAutocomplete } from '../../services/dto/IDataAutocomplete';
import { util } from 'prettier';

export interface IPropModal<T> {
    idUpdate?: string;
    isShowModal: boolean;
    lstData?: T[];
    onClose: () => void;
}

export const ZaloTemp_tabActive = {
    SYSTEM: '1',
    USER: '2'
};

export function BtnRemoveElement({ isShow, elementType, handleClick }: any) {
    const removeElement = () => {
        handleClick(elementType);
    };
    return (
        <>
            <DeleteOutlinedIcon className="btnRemove" onClick={removeElement} sx={{ display: isShow ? '' : 'none' }} />
        </>
    );
}

export default function ModalZaloTemplate(props: IPropModal<IZaloTemplate>) {
    const { idUpdate, isShowModal, lstData, onClose } = props;
    const [inforObjDelete, setInforObjDelete] = useState<PropConfirmOKCancel>(new PropConfirmOKCancel({ show: false }));
    const [objAlert, setObjAlert] = useState({ show: false, type: 1, mes: '' });
    const [isShowToken, setIsShowToken] = useState(false);
    const [tabActive, setTabActive] = useState(ZaloTemp_tabActive.SYSTEM);
    const [idMauTinChosed, setIdMauTinChosed] = useState('');
    const [allMauTinDB, setAllMauTinDB] = useState<IZaloTemplate[]>([]);

    // thông tin mẫu tin zalo cần phải có
    const [tenMauTin, setTenMauTin] = useState('');
    const [isCheckMauMacDinh, setIsCheckMauMacDinh] = useState(false);
    const [imageUrl, setImageUrl] = useState(''); // url of imge
    const [imageFile, setImageFile] = useState<File>({} as File);
    const [idLoaiTin, setIdLoaiTin] = useState(LoaiTin.TIN_GIAO_DICH);
    const [zaloTemplateType, setZaloTemplateType] = useState('');

    const [lstButton, setLstButton] = useState<IZaloButtonDetail[]>([]);
    const [tblDetail, setTblDetail] = useState<IZaloTableDetail[]>([]);

    const [bannerElm, setBannerElm] = useState<IZaloElement | null>();
    const [headerElm, setHeaderElm] = useState<IZaloElement | null>();
    const [textElm, setTextElm] = useState<IZaloElement | null>();
    const [tableElm, setTableElm] = useState<IZaloElement | null>();
    const [lenElement, setLenElement] = useState(0);
    const [arrElmChosed, setArrElmChosed] = useState<string[]>([]);
    const [lstElmType_Filter, setLstElmType_Filter] = useState<ISelect[]>(ZaloConst.ListElementType);

    useEffect(() => {
        setTabActive(ZaloTemp_tabActive.SYSTEM);
        ResetDataModal();

        if (!utils.checkNull(idUpdate)) {
            setIdMauTinChosed(idUpdate as unknown as string);
        } else {
            if (lstData !== undefined && (lstData?.length ?? 0) > 0) {
                GetSetData_fromTemplate(lstData[0]?.id);
                setIdMauTinChosed(lstData[0]?.id);
            }
        }
        console.log('mautinzalo');
    }, [isShowModal]);

    const ResetDataModal = () => {
        setImageUrl('');
        setArrElmChosed([]);
        setTenMauTin('');
        setLenElement(0);

        setLstButton([]);
        setTblDetail([]);
        setBannerElm(null);
        setHeaderElm(null);
        setTextElm(null);
        setTableElm(null);
    };

    const GetSetData_fromTemplate = async (idMauTin: string, isDefaultSystem = true) => {
        let itemDefault: IZaloTemplate | null = null;
        if (isDefaultSystem) {
            const itemFind = lstData?.filter((x) => x.id === idMauTin);
            if (itemFind != undefined && itemFind?.length > 0) {
                itemDefault = itemFind[0];
            }
        } else {
            itemDefault = await ZaloService.GetZaloTemplate_byId(idMauTin);
        }

        if (itemDefault != null && itemDefault != undefined) {
            if (itemDefault?.elements !== undefined) {
                setLenElement(itemDefault?.elements?.length);

                setIdMauTinChosed(itemDefault?.id);
                setTenMauTin(itemDefault?.tenMauTin);
                setIdLoaiTin(itemDefault?.idLoaiTin);
                setZaloTemplateType(itemDefault?.template_type);

                const banner = itemDefault?.elements?.filter((x) => x.elementType === ZaloConst.ElementType.BANNER);
                if (banner !== undefined && banner.length > 0) {
                    setBannerElm(banner[0]);

                    if (banner[0].isImage) {
                        setImageUrl(banner[0].content);
                    }
                } else {
                    setImageUrl('');
                    setBannerElm(null);
                }
                const header = itemDefault?.elements?.filter((x) => x.elementType === ZaloConst.ElementType.HEADER);
                if (header !== undefined && header.length > 0) {
                    setHeaderElm(header[0]);
                } else {
                    setHeaderElm(null);
                }
                const text = itemDefault?.elements?.filter((x) => x.elementType === ZaloConst.ElementType.TEXT);
                if (text !== undefined && text.length > 0) {
                    setTextElm(text[0]);
                } else {
                    setTextElm(null);
                }

                const tblElm = itemDefault?.elements?.filter((x) => x.elementType === ZaloConst.ElementType.TABLE);
                if (tblElm !== undefined && tblElm?.length > 0) {
                    setTableElm(tblElm[0]);
                } else {
                    setTableElm(null);
                }

                const tbl = itemDefault?.elements
                    ?.filter((x) => x.elementType === ZaloConst.ElementType.TABLE)
                    ?.map((x) => {
                        return x?.tables;
                    });
                if (tbl !== undefined && tbl?.length > 0) {
                    setTblDetail(tbl[0]);
                } else {
                    setTblDetail([]);
                }
            } else {
                setLenElement(0);
            }
            if (itemDefault?.buttons !== undefined) {
                setLstButton(itemDefault?.buttons);
            } else {
                setLstButton([]);
            }
        }
    };

    const handleChangeTab = async (event: React.SyntheticEvent, newValue: string) => {
        setTabActive(newValue);
        if (newValue === ZaloTemp_tabActive.USER) {
            ResetDataModal();
            setZaloTemplateType('');
        } else {
            if (lstData !== undefined && lstData?.length > 0) {
                GetSetData_fromTemplate(lstData[0].id, true);
            }
        }
    };

    const removeElement = (elementType: string) => {
        switch (elementType) {
            case ZaloConst.ElementType.BANNER:
                {
                    setBannerElm(null);
                }
                break;
            case ZaloConst.ElementType.HEADER:
                {
                    setHeaderElm(null);
                }
                break;
            case ZaloConst.ElementType.TEXT:
                {
                    setTextElm(null);
                }
                break;
            case ZaloConst.ElementType.TABLE:
                {
                    setTableElm(null);
                }
                break;
            case ZaloConst.ElementType.BUTTON:
                {
                    setLstButton([]);
                }
                break;
        }
        setArrElmChosed(arrElmChosed?.filter((x) => x !== elementType));
    };

    const AddNew_ZaloElement = (item: ISelect, isAddThuCong = false) => {
        const newValue = item?.value as string;
        if (isAddThuCong) {
            if (arrElmChosed.includes(newValue)) {
                setObjAlert({ ...objAlert, show: true, mes: `Thành phần ${item?.text} đã được thêm`, type: 2 });
                return;
                //todo: nếu là Text: được phép thêm 2 lần
            }
            setArrElmChosed([...arrElmChosed, newValue]);
        }

        const idTemplate = Guid.create().toString();
        const newElm: IZaloElement = {
            id: Guid.create().toString(),
            idTemplate: idTemplate,
            elementType: newValue,
            thuTuSapXep: 0,
            isImage: false,
            content: '',
            tables: []
        };
        setLenElement(() => lenElement + 1);
        switch (item.value) {
            case ZaloConst.ElementType.BANNER:
                {
                    newElm.thuTuSapXep = 1;
                    setBannerElm(newElm);
                }
                break;
            case ZaloConst.ElementType.HEADER:
                {
                    newElm.thuTuSapXep = 2;
                    setHeaderElm(newElm);
                }
                break;
            case ZaloConst.ElementType.TEXT:
                {
                    newElm.thuTuSapXep = 3;
                    setTextElm(newElm);
                }
                break;
            case ZaloConst.ElementType.TABLE:
                {
                    newElm.thuTuSapXep = 4;
                    setTableElm(newElm);

                    setTblDetail([
                        {
                            id: Guid.create().toString(),
                            idElement: Guid.create().toString(),
                            thuTuSapXep: tblDetail?.length + 1,
                            value: '<MaHoaDon>',
                            key: 'Mã hóa đơn'
                        } as IZaloTableDetail
                    ]);
                }
                break;
            case ZaloConst.ElementType.BUTTON:
                {
                    const newBtn: IZaloButtonDetail = {
                        id: Guid.create().toString(),
                        idTemplate: idTemplate,
                        thuTuSapXep: lstButton?.length + 1,
                        type: ZaloConst.ButtonType.URL,
                        title: 'Xem chi tiết đơn hàng',
                        payload: `${process.env.REACT_APP_APP_BASE_URL}/giao-dich-thanh-toan`,
                        image_icon: ''
                    };
                    setLstButton([newBtn]);
                }
                break;
        }
    };

    const FindElem_andAdd = (elmType: string) => {
        const elm = ZaloConst.ListElementType.filter((x) => x.value === elmType);
        if (elm?.length > 0) {
            AddNew_ZaloElement(elm[0]);
        }
    };

    const changeLoaiTin = (loaiTin: string) => {
        setZaloTemplateType(loaiTin);

        switch (loaiTin) {
            case ZaloConst.TemplateType.MEDIA: // tin nhắn kèm ảnh
                {
                    setHeaderElm(null);
                    setTableElm(null);
                    setLstButton([]);
                    setTblDetail([]);
                    FindElem_andAdd(ZaloConst.ElementType.BANNER);
                    FindElem_andAdd(ZaloConst.ElementType.TEXT);

                    setArrElmChosed([ZaloConst.ElementType.BANNER, ZaloConst.ElementType.TEXT]);
                    setLstElmType_Filter(
                        ZaloConst.ListElementType.filter(
                            (x) => x.value === ZaloConst.ElementType.BANNER || x.value === ZaloConst.ElementType.TEXT
                        )
                    );
                }
                break;
            case ZaloConst.TemplateType.MESSAAGE: // tin nhắn thuần văn bản
                {
                    setBannerElm(null);
                    setHeaderElm(null);
                    setTableElm(null);
                    setLstButton([]);
                    setTblDetail([]);
                    FindElem_andAdd(ZaloConst.ElementType.TEXT);

                    setArrElmChosed([ZaloConst.ElementType.TEXT]);
                    setLstElmType_Filter(
                        ZaloConst.ListElementType.filter((x) => x.value === ZaloConst.ElementType.TEXT)
                    );
                }
                break;
            case ZaloConst.TemplateType.PARTNERSHIP:
                {
                    setTableElm(null);
                    setLstButton([]);
                    setTblDetail([]);

                    FindElem_andAdd(ZaloConst.ElementType.BANNER);
                    FindElem_andAdd(ZaloConst.ElementType.HEADER);
                    FindElem_andAdd(ZaloConst.ElementType.TEXT);

                    setArrElmChosed([
                        ZaloConst.ElementType.BANNER,
                        ZaloConst.ElementType.HEADER,
                        ZaloConst.ElementType.TEXT
                    ]);
                    setLstElmType_Filter(ZaloConst.ListElementType);
                }
                break;
            default:
                {
                    setLstElmType_Filter(ZaloConst.ListElementType);

                    FindElem_andAdd(ZaloConst.ElementType.BANNER);
                    FindElem_andAdd(ZaloConst.ElementType.HEADER);
                    FindElem_andAdd(ZaloConst.ElementType.TEXT);
                    FindElem_andAdd(ZaloConst.ElementType.TABLE);
                    FindElem_andAdd(ZaloConst.ElementType.BUTTON);

                    setArrElmChosed([
                        ZaloConst.ElementType.BANNER,
                        ZaloConst.ElementType.HEADER,
                        ZaloConst.ElementType.TEXT,
                        ZaloConst.ElementType.TABLE,
                        ZaloConst.ElementType.BUTTON
                    ]);
                }
                break;
        }
    };

    const table_removeBtn = (item: IZaloTableDetail) => {
        setTblDetail(tblDetail?.filter((x) => x.id !== item.id));
    };

    const table_addNewRow = (idElement: string) => {
        setTblDetail([
            ...tblDetail,
            {
                id: Guid.create().toString(),
                idElement: idElement,
                thuTuSapXep: tblDetail?.length + 1,
                value: '<MaHoaDon>',
                key: 'Mã hóa đơn'
            } as IZaloTableDetail
        ]);
    };

    const choseImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file: File = e.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                setImageUrl(reader.result?.toString() ?? '');
            };
            setImageFile(file);
        }
    };
    const closeImage = async () => {
        setImageUrl('');
        if (!utils.checkNull(imageUrl)) {
            const fileId = uploadFileService.GoogleApi_GetFileIdfromLink(imageUrl);
            if (!utils.checkNull(fileId)) {
                await uploadFileService.GoogleApi_RemoveFile_byId(fileId);
            }
        }
    };

    const changeMauTin = async (idMauTin: string, isDefaultSystem = true) => {
        GetSetData_fromTemplate(idMauTin, isDefaultSystem);
    };
    const deleteMauTin = async () => {
        const data = await ZaloService.XoaMauTinZalo(idMauTinChosed);
        if (data) {
            setObjAlert({ ...objAlert, show: true, mes: 'Xóa mẫu tin thành công', type: 1 });
            setInforObjDelete({ ...inforObjDelete, show: false });
            onClose();
        }
    };

    const checkSave = () => {
        if (utils.checkNull(tenMauTin)) {
            setObjAlert({ ...objAlert, show: true, mes: 'Vui lòng nhập tên mẫu tin', type: 2 });
            return false;
        }

        let check = true;

        switch (zaloTemplateType) {
            case ZaloConst.TemplateType.MEDIA: // tin nhắn kèm ảnh
                {
                    if (utils.checkNull(textElm?.content)) {
                        setObjAlert({ ...objAlert, show: true, mes: 'Vui lòng nhập nội dung tin nhắn', type: 2 });
                        check = false;
                    }
                }
                break;
            case ZaloConst.TemplateType.MESSAAGE: // tin nhắn thuần văn bản
                {
                    if (utils.checkNull(textElm?.content)) {
                        setObjAlert({ ...objAlert, show: true, mes: 'Vui lòng nhập nội dung tin nhắn', type: 2 });
                        check = false;
                    }
                }
                break;
            default:
                {
                    if (bannerElm !== null && bannerElm !== undefined) {
                        if (utils.checkNull(imageUrl)) {
                            setObjAlert({ ...objAlert, show: true, mes: 'Vui lòng chọn logo', type: 2 });
                            return false;
                        }
                    }
                    // bắt buộc phải có tiêu đề
                    if (headerElm === null || headerElm === undefined) {
                        setObjAlert({ ...objAlert, show: true, mes: 'Vui lòng thêm tiêu đề cho mẫu tin', type: 2 });
                        return false;
                    }

                    if (utils.checkNull(headerElm?.content)) {
                        setObjAlert({ ...objAlert, show: true, mes: 'Vui lòng nhập tiêu đề mẫu tin', type: 2 });
                        return false;
                    }
                    if (textElm !== null && textElm !== undefined) {
                        if (utils.checkNull(textElm?.content)) {
                            setObjAlert({ ...objAlert, show: true, mes: 'Vui lòng nhập nội dung tin nhắn', type: 2 });
                            return false;
                        }
                    }

                    if (tableElm !== null && tableElm !== undefined) {
                        if (tblDetail?.length === 0) {
                            setObjAlert({ ...objAlert, show: true, mes: 'Vui lòng thêm nội dung vào bảng', type: 2 });
                            return false;
                        }

                        const rowEmpty_TieuDe = tblDetail?.filter((x) => utils.checkNull(x.key));
                        if (rowEmpty_TieuDe?.length > 0) {
                            setObjAlert({
                                ...objAlert,
                                show: true,
                                mes: 'Tiêu đề các dòng trong bảng không được để trống',
                                type: 2
                            });
                            return false;
                        }

                        const rowEmpty_noiDung = tblDetail?.filter((x) => utils.checkNull(x.value));
                        if (rowEmpty_noiDung?.length > 0) {
                            setObjAlert({
                                ...objAlert,
                                show: true,
                                mes: 'Nội dung các dòng trong bảng không được để trống',
                                type: 2
                            });
                            return false;
                        }

                        const allToken = [
                            ...ListZaloToken_CuaHang,
                            ...ListZaloToken_KhachHang,
                            ...ListZaloToken_HoaDon
                        ];

                        const allKey = allToken?.map((x) => {
                            return x.value;
                        });
                        // check value exists in token
                        const keyNotExists = tblDetail?.filter((x) => !allKey.includes(x.value));
                        if (keyNotExists?.length > 0) {
                            setObjAlert({
                                ...objAlert,
                                show: true,
                                mes: 'Nội dung các dòng phải thuộc zalo token',
                                type: 2
                            });
                            return false;
                        }
                        // check same key (todo)
                    }

                    if (lstButton?.length > 0) {
                        for (let index = 0; index < lstButton?.length; index++) {
                            const element = lstButton[index];
                            switch (element?.type) {
                                case ZaloConst.ButtonType.SHOW:
                                    {
                                        if (utils.checkNull(element?.title)) {
                                            setObjAlert({
                                                ...objAlert,
                                                show: true,
                                                mes: 'Vui lòng nhập tiêu đề cho Nút thao tác',
                                                type: 2
                                            });
                                            return false;
                                        }
                                    }
                                    break;
                                default:
                                    {
                                        if (utils.checkNull(element?.title)) {
                                            setObjAlert({
                                                ...objAlert,
                                                show: true,
                                                mes: 'Vui lòng nhập tiêu đề cho Nút thao tác',
                                                type: 2
                                            });
                                            return false;
                                        }
                                        if (utils.checkNull(element?.payload)) {
                                            setObjAlert({
                                                ...objAlert,
                                                show: true,
                                                mes: 'Vui lòng nhập nội dung cho Nút thao tác',
                                                type: 2
                                            });
                                            return false;
                                        }
                                    }
                                    break;
                            }
                        }
                    }
                }
                break;
        }
        return check;
    };
    const saveMauTin = async () => {
        const check = checkSave();
        console.log('checkSave ', check);
        if (!check) {
            return;
        }

        const googleDrive_fileId = await uploadFileService.GoogleApi_UploaFileToDrive(imageFile, 'Zalo');

        const newMauTin: IZaloTemplate = {
            id: Guid.EMPTY,
            tenMauTin: tenMauTin,
            idLoaiTin: idLoaiTin,
            isDefault: isCheckMauMacDinh,
            language: 'VI',
            template_type: zaloTemplateType,
            elements: [],
            buttons: []
        };
        if (bannerElm != null && bannerElm !== undefined) {
            bannerElm.isImage = true;
            bannerElm.content = !utils.checkNull(googleDrive_fileId)
                ? `https://lh3.googleusercontent.com/d/${googleDrive_fileId}`
                : '';
            newMauTin.elements?.push(bannerElm);
        }
        if (headerElm != null && headerElm !== undefined) {
            newMauTin.elements?.push(headerElm);
        }
        if (textElm != null && textElm !== undefined) {
            newMauTin.elements?.push(textElm);
        }
        if (tblDetail !== undefined && tblDetail?.length > 0) {
            const tblElm: IZaloElement = {
                id: Guid.create().toString(),
                idTemplate: Guid.create().toString(),
                elementType: ZaloConst.ElementType.TABLE,
                thuTuSapXep: 4,
                isImage: false,
                content: '',
                tables: tblDetail
            };
            newMauTin.elements?.push(tblElm);
        }
        if (lstButton != undefined && lstButton?.length > 0) {
            newMauTin.buttons = lstButton;
        }

        if (utils.checkNull(idUpdate)) {
            const data = await ZaloService.InsertMauTinZalo(newMauTin);
            setIdMauTinChosed(data?.id);
        } else {
            newMauTin.id = idMauTinChosed;
            const data = await ZaloService.UpdateMauTinZalo(newMauTin);
            setIdMauTinChosed(data?.id);
        }

        setObjAlert({ ...objAlert, show: true, mes: 'Lưu mẫu tin thành công', type: 1 });
        onClose();
    };

    return (
        <>
            <TokenZalo isShow={isShowToken} onClose={() => setIsShowToken(false)} />
            <ConfirmDelete
                isShow={inforObjDelete.show}
                title={inforObjDelete.title}
                mes={inforObjDelete.mes}
                onOk={deleteMauTin}
                onCancel={() => setInforObjDelete({ ...inforObjDelete, show: false })}></ConfirmDelete>
            <SnackbarAlert
                showAlert={objAlert.show}
                type={objAlert.type}
                title={objAlert.mes}
                handleClose={() => setObjAlert({ show: false, mes: '', type: 1 })}></SnackbarAlert>
            <Dialog
                disableEnforceFocus
                open={isShowModal}
                onClose={onClose}
                fullWidth
                maxWidth="lg"
                className="zalo-template">
                <DialogTitle>
                    <Stack spacing={1} direction={'row'} alignItems={'center'}>
                        <span> {utils.checkNull(idUpdate) ? 'Thêm' : 'Cập nhật'} mẫu tin zalo</span>
                        <InfoOutlinedIcon
                            titleAccess="Danh sách token"
                            sx={{ color: 'chocolate' }}
                            onClick={() => setIsShowToken(true)}
                        />
                    </Stack>
                    <DialogButtonClose onClose={onClose} />
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TabContext value={tabActive}>
                                <Stack>
                                    <TabList onChange={handleChangeTab}>
                                        <Tab label="Mẫu hệ thống" value={ZaloTemp_tabActive.SYSTEM} />
                                        <Tab label="Mẫu tự tạo" value={ZaloTemp_tabActive.USER} />
                                    </TabList>
                                </Stack>
                            </TabContext>
                            <TabContext value={tabActive}>
                                <TabPanel value={ZaloTemp_tabActive.SYSTEM} sx={{ paddingLeft: 0 }}>
                                    <Grid container spacing={1}>
                                        {lstData?.map((x) => (
                                            <Grid item xs={3} key={x.id}>
                                                <Box
                                                    padding={2}
                                                    sx={{ position: 'relative' }}
                                                    className="zalo-template-default"
                                                    onClick={() => changeMauTin(x.id, true)}>
                                                    <Stack spacing={1}>
                                                        <Stack spacing={1} alignItems={'center'} direction={'row'}>
                                                            {x?.idLoaiTin === LoaiTin.TIN_SINH_NHAT && (
                                                                <CakeOutlinedIcon />
                                                            )}
                                                            {x?.idLoaiTin === LoaiTin.TIN_GIAO_DICH && (
                                                                <CreditScoreOutlinedIcon />
                                                            )}
                                                            {x?.idLoaiTin === LoaiTin.TIN_LICH_HEN && (
                                                                <AccessTimeOutlinedIcon />
                                                            )}
                                                            <Typography variant="body1" fontWeight={600}>
                                                                {x.tenMauTin}
                                                            </Typography>
                                                        </Stack>

                                                        {x?.elements
                                                            ?.filter(
                                                                (elm) => elm.elementType == ZaloConst.ElementType.TEXT
                                                            )
                                                            ?.map((elm, index2) => (
                                                                <Typography variant="body2" key={index2}>
                                                                    {elm.content}
                                                                </Typography>
                                                            ))}
                                                    </Stack>
                                                    {idMauTinChosed == x.id && (
                                                        <CheckOutlinedIcon
                                                            sx={{
                                                                position: 'absolute',
                                                                right: 0,
                                                                top: 0,
                                                                color: 'var(--color-main)'
                                                            }}
                                                        />
                                                    )}
                                                </Box>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </TabPanel>
                            </TabContext>
                        </Grid>
                        <Grid item xs={12} sm={8} md={8} lg={8}>
                            <Grid container>
                                <Grid item lg={8}>
                                    <Stack spacing={2}>
                                        <Stack direction={'row'} alignItems={'end'} spacing={2}>
                                            <Typography variant="body2" fontWeight={500}>
                                                Tên mẫu tin
                                            </Typography>
                                            <Stack width={'60%'}>
                                                <TextField
                                                    size="small"
                                                    variant="standard"
                                                    fullWidth
                                                    value={tenMauTin}
                                                    onChange={(e) => {
                                                        setTenMauTin(e.target.value);
                                                    }}
                                                />
                                            </Stack>
                                        </Stack>
                                        <Stack direction={'row'} alignItems={'center'} spacing={2}>
                                            <Typography variant="body2" fontWeight={500}>
                                                Loại tin
                                            </Typography>
                                            <Stack width={'60%'}>
                                                <SelectWithData
                                                    idChosed={zaloTemplateType ?? ''}
                                                    data={ZaloConst.ListTemplateType}
                                                    handleChange={(item: ISelect) =>
                                                        changeLoaiTin(item?.value as string)
                                                    }
                                                />
                                            </Stack>
                                        </Stack>
                                    </Stack>
                                </Grid>
                                <Grid item lg={4}>
                                    <Stack justifyContent={'space-between'} direction={'row'}>
                                        <Stack spacing={1} direction={'row'} alignItems={'center'}>
                                            <Checkbox
                                                checked={isCheckMauMacDinh}
                                                onChange={(e) => setIsCheckMauMacDinh(e.target.checked)}
                                            />
                                            <Typography variant="body2">Là mẫu mặc định</Typography>
                                        </Stack>
                                    </Stack>
                                </Grid>
                            </Grid>

                            <Grid container spacing={2} paddingTop={3}>
                                {bannerElm && (
                                    <Grid item xs={5}>
                                        <Stack spacing={1}>
                                            <Stack spacing={1} direction={'row'}>
                                                <BtnRemoveElement
                                                    isShow={tabActive === ZaloTemp_tabActive.USER}
                                                    elementType={ZaloConst.ElementType.BANNER}
                                                    handleClick={removeElement}
                                                />
                                                <Typography className="zoa-element-lable">Logo, hình ảnh</Typography>
                                            </Stack>

                                            <Stack height={80}>
                                                <Box
                                                    sx={{
                                                        border: '1px solid #cccc',
                                                        p: 1,
                                                        height: '100%',
                                                        textAlign: 'center',
                                                        position: 'relative'
                                                    }}>
                                                    {!utils.checkNull(imageUrl) ? (
                                                        <Box sx={{ position: 'relative', height: '100%' }}>
                                                            <img
                                                                src={imageUrl}
                                                                style={{ width: '100%', height: '100%' }}
                                                            />
                                                            <Close
                                                                onClick={closeImage}
                                                                sx={{
                                                                    left: 0,
                                                                    color: 'red',
                                                                    position: 'absolute'
                                                                }}
                                                            />
                                                        </Box>
                                                    ) : (
                                                        <>
                                                            <TextField
                                                                type="file"
                                                                sx={{
                                                                    position: 'absolute',
                                                                    top: 0,
                                                                    left: 0,
                                                                    width: '100%',
                                                                    height: '100%',
                                                                    opacity: 0,
                                                                    '& input': {
                                                                        height: '100%'
                                                                    },
                                                                    '& div': {
                                                                        height: '100%'
                                                                    }
                                                                }}
                                                                onChange={choseImage}
                                                            />
                                                            <Stack spacing={1} paddingTop={2}>
                                                                <Typography variant="caption">
                                                                    File định dạng jpeg, png
                                                                </Typography>
                                                            </Stack>
                                                        </>
                                                    )}
                                                </Box>
                                            </Stack>
                                        </Stack>
                                    </Grid>
                                )}
                                {headerElm && (
                                    <Grid item xs={12}>
                                        <Stack spacing={1}>
                                            <Stack spacing={1} direction={'row'}>
                                                <BtnRemoveElement
                                                    isShow={tabActive === ZaloTemp_tabActive.USER}
                                                    elementType={ZaloConst.ElementType.HEADER}
                                                    handleClick={removeElement}
                                                />

                                                <Typography className="zoa-element-lable">Tiêu đề</Typography>
                                            </Stack>

                                            <TextField
                                                variant="outlined"
                                                fullWidth
                                                size="small"
                                                value={headerElm?.content ?? ''}
                                                onChange={(e) =>
                                                    setHeaderElm({ ...headerElm, content: e.target.value })
                                                }
                                            />
                                        </Stack>
                                    </Grid>
                                )}
                                {textElm && (
                                    <Grid item xs={12}>
                                        <Stack spacing={1}>
                                            <Stack spacing={1} direction={'row'}>
                                                <BtnRemoveElement
                                                    isShow={tabActive === ZaloTemp_tabActive.USER}
                                                    elementType={ZaloConst.ElementType.TEXT}
                                                    handleClick={removeElement}
                                                />

                                                <Typography className="zoa-element-lable">Văn bản</Typography>
                                            </Stack>

                                            <TextField
                                                size="small"
                                                variant="outlined"
                                                fullWidth
                                                multiline
                                                rows={3}
                                                value={textElm?.content ?? ''}
                                                onChange={(e) => setTextElm({ ...textElm, content: e.target.value })}
                                            />
                                        </Stack>
                                    </Grid>
                                )}
                                {tableElm && (
                                    <Grid item xs={12}>
                                        <Stack spacing={1}>
                                            <Stack spacing={1} direction={'row'} alignItems={'center'}>
                                                <BtnRemoveElement
                                                    isShow={tabActive === ZaloTemp_tabActive.USER}
                                                    elementType={ZaloConst.ElementType.TABLE}
                                                    handleClick={removeElement}
                                                />

                                                <Typography className="zoa-element-lable">Bảng</Typography>
                                            </Stack>

                                            <Typography variant="caption">
                                                Vui lòng thêm tiêu đề và nội dung từng hàng của bảng, nhấn nút “Thêm
                                                hàng” để thêm hàng mới (Tối đa 5 hàng)
                                            </Typography>

                                            <Stack spacing={1}>
                                                <Stack direction={'row'} spacing={2} alignItems={'center'}>
                                                    <Stack flex={1}>
                                                        <Typography variant="body2" fontWeight={500}>
                                                            Tiêu đề
                                                        </Typography>
                                                    </Stack>
                                                    <Stack flex={1}>
                                                        <Typography variant="body2" fontWeight={500}>
                                                            Nội dung
                                                        </Typography>
                                                    </Stack>
                                                </Stack>
                                                {tblDetail?.map((tbl, indexTbl) => (
                                                    <Stack
                                                        direction={'row'}
                                                        key={indexTbl}
                                                        spacing={2}
                                                        alignItems={'center'}>
                                                        <Stack flex={1}>
                                                            <TextField
                                                                size="small"
                                                                fullWidth
                                                                value={tbl?.key}
                                                                onChange={(e) =>
                                                                    setTblDetail(
                                                                        tblDetail.map((x) => {
                                                                            if (x.id === tbl.id) {
                                                                                return {
                                                                                    ...x,
                                                                                    key: e.target.value
                                                                                };
                                                                            } else {
                                                                                return x;
                                                                            }
                                                                        })
                                                                    )
                                                                }
                                                            />
                                                        </Stack>
                                                        <Stack flex={1.5}>
                                                            <TextField
                                                                size="small"
                                                                fullWidth
                                                                value={tbl?.value}
                                                                onChange={(e) =>
                                                                    setTblDetail(
                                                                        tblDetail.map((x) => {
                                                                            if (x.id === tbl.id) {
                                                                                return {
                                                                                    ...x,
                                                                                    value: e.target.value
                                                                                };
                                                                            } else {
                                                                                return x;
                                                                            }
                                                                        })
                                                                    )
                                                                }
                                                            />
                                                        </Stack>
                                                        <Close
                                                            sx={{ color: 'red' }}
                                                            onClick={() => table_removeBtn(tbl)}
                                                        />
                                                    </Stack>
                                                ))}
                                            </Stack>
                                            <Button
                                                variant="outlined"
                                                startIcon={<Add />}
                                                sx={{ width: '25%' }}
                                                onClick={() => table_addNewRow(tableElm?.id)}>
                                                Thêm hàng
                                            </Button>
                                        </Stack>
                                    </Grid>
                                )}

                                {lstButton?.length > 0 && (
                                    <Grid item xs={12}>
                                        <Stack spacing={1}>
                                            <Stack spacing={1} direction={'row'}>
                                                <BtnRemoveElement
                                                    isShow={tabActive === ZaloTemp_tabActive.USER}
                                                    elementType={ZaloConst.ElementType.BUTTON}
                                                    handleClick={removeElement}
                                                />
                                                <Typography className="zoa-element-lable">Nút thao tác</Typography>
                                            </Stack>

                                            {lstButton?.map((btn, indexBtn) => (
                                                <Stack spacing={1} direction={'row'} key={indexBtn}>
                                                    <Stack flex={1}>
                                                        <SelectWithData
                                                            idChosed={btn?.type ?? ''}
                                                            data={ZaloConst.ListButtonType}
                                                            handleChange={(item: ISelect) =>
                                                                setLstButton(
                                                                    lstButton.map((x) => {
                                                                        if (x.id === btn.id) {
                                                                            return {
                                                                                ...x,
                                                                                type: item.value.toString()
                                                                            };
                                                                        } else {
                                                                            return x;
                                                                        }
                                                                    })
                                                                )
                                                            }
                                                            label={'Loại nút'}
                                                        />
                                                    </Stack>
                                                    <Stack flex={1}>
                                                        <TextField
                                                            size="small"
                                                            variant={'outlined'}
                                                            label="Tiêu đề"
                                                            value={btn?.title}
                                                            onChange={(e) =>
                                                                setLstButton(
                                                                    lstButton.map((x) => {
                                                                        if (x.id === btn.id) {
                                                                            return {
                                                                                ...x,
                                                                                title: e.target.value
                                                                            };
                                                                        } else {
                                                                            return x;
                                                                        }
                                                                    })
                                                                )
                                                            }
                                                        />
                                                    </Stack>
                                                    {btn?.type !== ZaloConst.ButtonType.SHOW && (
                                                        <Stack flex={1}>
                                                            <TextField
                                                                size="small"
                                                                variant={'outlined'}
                                                                label={
                                                                    btn?.type === ZaloConst.ButtonType.PHONE
                                                                        ? 'Số điện thoại'
                                                                        : 'Đường dẫn liên kết'
                                                                }
                                                                value={btn?.payload}
                                                                onChange={(e) =>
                                                                    setLstButton(
                                                                        lstButton.map((x) => {
                                                                            if (x.id === btn.id) {
                                                                                return {
                                                                                    ...x,
                                                                                    payload: e.target.value
                                                                                };
                                                                            } else {
                                                                                return x;
                                                                            }
                                                                        })
                                                                    )
                                                                }
                                                            />
                                                        </Stack>
                                                    )}
                                                </Stack>
                                            ))}
                                        </Stack>
                                    </Grid>
                                )}
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={12} md={4} lg={4}>
                            {tabActive === ZaloTemp_tabActive.USER && (
                                <Stack spacing={2}>
                                    <Stack spacing={1} direction={'row'}>
                                        <Add />
                                        <Typography fontWeight={500}>Chọn để thêm thành phần mong muốn</Typography>
                                    </Stack>
                                    <Stack>
                                        <SelectWithData
                                            idChosed={''}
                                            data={lstElmType_Filter}
                                            handleChange={(item: ISelect) => AddNew_ZaloElement(item, true)}
                                        />
                                    </Stack>
                                </Stack>
                            )}
                            <Stack spacing={2} paddingTop={2}>
                                <Stack direction={'row'} spacing={1} justifyContent={'flex-end'}>
                                    <Button variant="outlined" fullWidth onClick={saveMauTin}>
                                        {utils.checkNull(idUpdate) ? 'Thêm mẫu tin' : 'Cập nhật mẫu'}
                                    </Button>
                                    {!utils.checkNull(idUpdate) && (
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            fullWidth
                                            onClick={() => {
                                                setInforObjDelete(
                                                    new PropConfirmOKCancel({
                                                        show: true,
                                                        title: 'Xác nhận xóa',
                                                        mes: `Bạn có chắc chắn muốn xóa mẫu tin ${tenMauTin} không?`
                                                    })
                                                );
                                            }}
                                            // sx={{
                                            //     display: abpCustom.isGrandPermission('Pages.Zalo_Template.Delete')
                                            //         ? ''
                                            //         : 'none'
                                            // }}
                                        >
                                            Xóa mẫu tin
                                        </Button>
                                    )}
                                </Stack>
                                <Stack>
                                    <ZaloTemplateView
                                        logoBanner={imageUrl}
                                        headerText={headerElm?.content ?? ''}
                                        contentText={textElm?.content ?? ''}
                                        tables={tblDetail}
                                        buttons={lstButton}
                                    />
                                </Stack>
                            </Stack>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        </>
    );
}
