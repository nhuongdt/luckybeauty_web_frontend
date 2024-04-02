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
    Typography
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CreditScoreOutlinedIcon from '@mui/icons-material/CreditScoreOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import CakeOutlinedIcon from '@mui/icons-material/CakeOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import { Add, Close } from '@mui/icons-material';
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

export interface IPropModal<T> {
    idUpdate?: string;
    isShowModal: boolean;
    lstData?: T[];
    onClose: () => void;
}

export default function ModalZaloTemplate(props: IPropModal<IZaloTemplate>) {
    const { idUpdate, isShowModal, lstData, onClose } = props;
    const [tenMauTin, setTenMauTin] = useState('');
    const [idMauTinChosed, setIdMauTinChosed] = useState('');
    const [isCheckMauMacDinh, setIsCheckMauMacDinh] = useState(false);
    const [inforObjDelete, setInforObjDelete] = useState<PropConfirmOKCancel>(new PropConfirmOKCancel({ show: false }));
    const [objAlert, setObjAlert] = useState({ show: false, type: 1, mes: '' });
    const [imageUrl, setImageUrl] = useState(''); // url of imge
    const [imageFile, setImageFile] = useState<File>({} as File);

    const [lstElement, setLstElement] = useState<IZaloElement[]>([]);
    const [lstButton, setLstButton] = useState<IZaloButtonDetail[]>([]);
    const [tblDetail, setTblDetail] = useState<IZaloTableDetail[]>([]);

    const [bannerElm, setBannerElm] = useState<IZaloElement>();
    const [headerElm, setHeaderElm] = useState<IZaloElement>();
    const [textElm, setTextElm] = useState<IZaloElement>();

    useEffect(() => {
        // find tempDefault
        if (lstData !== undefined && (lstData?.length ?? 0) > 0) {
            GetData_fromTempSystem(lstData[0]?.id);
        }
    }, [isShowModal]);

    const GetData_fromTempSystem = (idMauTin: string) => {
        const itemDefault = lstData?.filter((x) => x.id === idMauTin);
        if (itemDefault != undefined && itemDefault.length > 0) {
            if (itemDefault[0]?.elements !== undefined) {
                setIdMauTinChosed(itemDefault[0]?.id);
                setLstElement(itemDefault[0]?.elements);

                const banner = itemDefault[0]?.elements?.filter((x) => x.elementType === ZaloConst.ElementType.BANNER);
                if (banner !== undefined && banner.length > 0) {
                    setBannerElm(banner[0]);
                }
                const header = itemDefault[0]?.elements?.filter((x) => x.elementType === ZaloConst.ElementType.HEADER);
                if (header !== undefined && header.length > 0) {
                    setHeaderElm(header[0]);
                }
                const text = itemDefault[0]?.elements?.filter((x) => x.elementType === ZaloConst.ElementType.TEXT);
                if (text !== undefined && text.length > 0) {
                    setTextElm(text[0]);
                }

                const tbl = itemDefault[0]?.elements
                    ?.filter((x) => x.elementType === ZaloConst.ElementType.TABLE)
                    ?.map((x) => {
                        return x?.tables;
                    });
                if (tbl !== undefined && tbl?.length > 0) {
                    setTblDetail(tbl[0]);
                    console.log('tbl ', tbl[0]);
                } else {
                    setTblDetail([]);
                }
            } else {
                setLstElement([]);
            }
            if (itemDefault[0]?.buttons !== undefined) {
                setLstButton(itemDefault[0]?.buttons);
            } else {
                setLstButton([]);
            }
        }
    };

    const lenElement = (lstElement?.length ?? 0) + 1;

    const table_removeBtn = (item: IZaloTableDetail) => {
        setTblDetail(tblDetail?.filter((x) => x.id !== item.id));
    };

    const table_addNewRow = (ele: IZaloElement) => {
        setTblDetail([
            ...tblDetail,
            { id: '', idElement: ele?.id, thuTuSapXep: tblDetail?.length + 1, key: '', value: '' } as IZaloTableDetail
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
        if (isDefaultSystem) {
            GetData_fromTempSystem(idMauTin);
        }
    };
    const deleteMauTin = async () => {
        //
    };
    const saveMauTin = async () => {
        let tenMau = tenMauTin;
        if (tenMauTin == '') tenMau = headerElm?.content ?? '';
        if (utils.checkNull(headerElm?.content)) {
            setObjAlert({ ...objAlert, show: true, mes: 'Vui lòng nhập tiêu đề', type: 2 });
            return;
        }
        const googleDrive_fileId = await uploadFileService.GoogleApi_UploaFileToDrive(imageFile, 'Zalo');

        const newMauTin: IZaloTemplate = {
            id: Guid.EMPTY,
            tenMauTin: tenMau,
            idLoaiTin: LoaiTin.TIN_GIAO_DICH,
            isDefault: true,
            language: 'VI',
            template_type: ZaloConst.TemplateType.TRANSACTION,
            elements: [],
            buttons: []
        };
        if (bannerElm !== undefined) {
            bannerElm.isImage = true;
            bannerElm.content = !utils.checkNull(googleDrive_fileId)
                ? `https://lh3.googleusercontent.com/d/${googleDrive_fileId}`
                : '';
            newMauTin.elements?.push(bannerElm);
        }
        if (headerElm !== undefined) {
            newMauTin.elements?.push(headerElm);
        }
        if (textElm !== undefined) {
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

        const data = await ZaloService.InsertMauTinZalo(newMauTin);
        console.log('InsertMauTinZalo ', data);
        setObjAlert({ ...objAlert, show: true, mes: 'Lưu mẫu tin thành công', type: 1 });
        onClose();
    };

    return (
        <>
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
                    </Stack>
                    <DialogButtonClose onClose={onClose} />
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
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
                                                    {x?.idLoaiTin === LoaiTin.TIN_SINH_NHAT && <CakeOutlinedIcon />}
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
                                                    ?.filter((elm) => elm.elementType == ZaloConst.ElementType.TEXT)
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
                        </Grid>
                        <Grid item xs={12} sm={8} md={8} lg={8}>
                            <Grid container paddingTop={2}>
                                <Grid item lg={8}>
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
                            <Grid container spacing={2}>
                                {bannerElm && (
                                    <Grid item xs={5}>
                                        <Stack spacing={1}>
                                            <Typography className="zoa-element-lable">
                                                {bannerElm?.thuTuSapXep} {'. '}Logo, hình ảnh
                                            </Typography>

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
                                            <Typography className="zoa-element-lable">
                                                {headerElm?.thuTuSapXep} {'. '}Tiêu đề
                                            </Typography>

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
                                            <Typography className="zoa-element-lable">
                                                {textElm?.thuTuSapXep}
                                                {'.'} Văn bản
                                            </Typography>

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
                                {lstElement
                                    ?.filter((elm) => elm.elementType == ZaloConst.ElementType.TABLE)
                                    ?.map((elm, index2) => (
                                        <Grid item xs={12} key={index2}>
                                            <Stack spacing={1}>
                                                <Stack spacing={1} direction={'row'} alignItems={'center'}>
                                                    <Typography className="zoa-element-lable">
                                                        {elm.thuTuSapXep}
                                                        {'.'} Bảng
                                                    </Typography>
                                                    <InfoOutlinedIcon
                                                        titleAccess="Danh sách token"
                                                        sx={{ color: 'chocolate' }}
                                                    />
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
                                                    onClick={() => table_addNewRow(elm)}>
                                                    Thêm hàng
                                                </Button>
                                            </Stack>
                                        </Grid>
                                    ))}

                                {lstButton?.length > 0 && (
                                    <Grid item xs={12}>
                                        <Stack spacing={1}>
                                            <Typography className="zoa-element-lable">
                                                {lenElement} {'. '}Nút thao tác
                                            </Typography>

                                            {lstButton?.map((btn, indexBtn) => (
                                                <Stack spacing={1} direction={'row'} key={indexBtn}>
                                                    <Stack flex={1}>
                                                        <SelectWithData
                                                            idChosed={btn?.type}
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
                                                            label="Nội dung nút"
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
                            <Stack spacing={2} paddingTop={2}>
                                <Stack direction={'row'} spacing={1} justifyContent={'flex-end'}>
                                    <Button variant="contained" fullWidth onClick={saveMauTin}>
                                        Lưu mẫu tin
                                    </Button>
                                    {!utils.checkNull(idUpdate) && (
                                        <Stack spacing={1} direction={'row'}>
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                onClick={() => {
                                                    setInforObjDelete(
                                                        new PropConfirmOKCancel({
                                                            show: true,
                                                            title: 'Xác nhận xóa',
                                                            mes: `Bạn có chắc chắn muốn xóa mẫu tin ${tenMauTin} không?`
                                                        })
                                                    );
                                                }}
                                                sx={{
                                                    display: abpCustom.isGrandPermission('Pages.MauIn.Delete')
                                                        ? ''
                                                        : 'none'
                                                }}>
                                                Xóa mẫu tin
                                            </Button>
                                            <Button variant="contained" sx={{ display: 'none' }}>
                                                Sao chép
                                            </Button>
                                        </Stack>
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
