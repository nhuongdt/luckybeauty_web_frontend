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
    Divider
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Add, Close } from '@mui/icons-material';

import { useEffect, useState } from 'react';
import { PropConfirmOKCancel } from '../../utils/PropParentToChild';
import ConfirmDelete from '../../components/AlertDialog/ConfirmDelete';
import abpCustom from '../../components/abp-custom';
import utils from '../../utils/utils';
import { IZaloTableDetail, IZaloTemplate } from '../../services/zalo/ZaloTemplateDto';
import AppConsts, { LoaiTin } from '../../lib/appconst';
import SelectWithData from '../../components/Select/SelectWithData';
import DialogButtonClose from '../../components/Dialog/ButtonClose';
import CreditScoreOutlinedIcon from '@mui/icons-material/CreditScoreOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import CakeOutlinedIcon from '@mui/icons-material/CakeOutlined';
import { ZaloConst } from '../../lib/zaloConst';

export interface IPropModal<T> {
    idUpdate?: string;
    isShowModal: boolean;
    lstData?: T[];
    onClose: () => void;
}

export default function ModalZaloTemplate(props: IPropModal<IZaloTemplate>) {
    const { idUpdate, isShowModal, lstData, onClose } = props;
    const [isCheckMauMacDinh, setIsCheckMauMacDinh] = useState(false);
    const [inforObjDelete, setInforObjDelete] = useState<PropConfirmOKCancel>(new PropConfirmOKCancel({ show: false }));
    const [objMauTin, setObjMauTin] = useState<IZaloTemplate>({ idLoaiTin: LoaiTin.TIN_GIAO_DICH } as IZaloTemplate);
    const [imageUrl, setImageUrl] = useState(''); // url of imge

    useEffect(() => {
        // find tempDefault
        const itemDefault = lstData?.filter((x) => x.isDefault && x.idLoaiTin === objMauTin.idLoaiTin);
        if (itemDefault != undefined && itemDefault.length > 0) {
            setObjMauTin({
                ...objMauTin,
                isDefault: true,
                id: itemDefault[0].id,
                tenMauTin: itemDefault[0].tenMauTin,
                elements: itemDefault[0]?.elements,
                buttons: itemDefault[0]?.buttons
            });
        }
    }, [isShowModal]);

    const lenElement = (objMauTin?.elements?.length ?? 0) + 1;
    const header_text = objMauTin?.elements
        ?.filter((x) => x.elementType === ZaloConst.ElementType.HEADER)
        ?.map((x) => {
            return x.content;
        })
        ?.toString();
    const noiDungVanBan = objMauTin?.elements
        ?.filter((x) => x.elementType === ZaloConst.ElementType.TEXT)
        ?.map((x) => {
            return x.content;
        })
        ?.toString();

    const table_removeBtn = (item: IZaloTableDetail) => {
        setObjMauTin({
            ...objMauTin,
            elements: objMauTin?.elements?.map((x) => {
                if (x.elementType === ZaloConst.ElementType.TABLE) {
                    return {
                        ...x,
                        tables: x?.tables?.filter((o) => o.id !== item.id)
                    };
                } else {
                    return x;
                }
            })
        });
    };

    const choseImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file: File = e.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(file);
            // reader.onload = () => {
            //     setProductImage(reader.result?.toString() ?? '');
            // };
            // setFileImage(file);
        }
    };
    const closeImage = async () => {
        // setProductImage('');
        // if (!utils.checkNull(googleDrive_fileId)) {
        //     await uploadFileService.GoogleApi_RemoveFile_byId(googleDrive_fileId);
        //     setgoogleDrive_fileId('');
        // }
    };

    const changeLoaiTin = async () => {
        //
    };
    const deleteMauIn = async () => {
        //
    };
    const saveMauIn = async () => {
        //
    };

    return (
        <>
            <ConfirmDelete
                isShow={inforObjDelete.show}
                title={inforObjDelete.title}
                mes={inforObjDelete.mes}
                onOk={deleteMauIn}
                onCancel={() => setInforObjDelete({ ...inforObjDelete, show: false })}></ConfirmDelete>
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
                                            sx={{ border: '1px solid #ccc' }}
                                            className="zalo-template-default">
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
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={8} md={8} lg={8}>
                            <Divider textAlign="left">MÔ TẢ CHI TIẾT</Divider>
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
                                                value={objMauTin.tenMauTin}
                                                onChange={(e) => {
                                                    setObjMauTin({ ...objMauTin, tenMauTin: e.target.value });
                                                }}
                                            />
                                        </Stack>
                                    </Stack>
                                </Grid>
                                <Grid item lg={4}>
                                    <Stack spacing={1} direction={'row'} alignItems={'center'}>
                                        <Checkbox
                                            checked={objMauTin?.isDefault}
                                            onChange={(e) => setIsCheckMauMacDinh(e.target.checked)}
                                        />
                                        <Typography variant="body2">Là mẫu mặc định</Typography>
                                    </Stack>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                {objMauTin?.elements
                                    ?.filter((elm) => elm.elementType == ZaloConst.ElementType.BANNER)
                                    ?.map((elm, index2) => (
                                        <Grid item xs={5} key={index2}>
                                            <Stack spacing={1}>
                                                <Typography className="zoa-element-lable">
                                                    {elm.thuTuSapXep} {'. '}Logo, hình ảnh
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
                                                                    {/* <Box>
                                                <InsertDriveFileIcon className="icon-size" />
                                            </Box>

                                            <Box>
                                                <CloudDoneIcon
                                                    style={{
                                                        paddingRight: '5px',
                                                        color: 'var(--color-main)'
                                                    }}
                                                />
                                                <Link underline="always" fontSize={'13px'}>
                                                    Tải ảnh lên
                                                </Link>
                                            </Box> */}
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
                                    ))}
                                {objMauTin?.elements
                                    ?.filter((elm) => elm.elementType == ZaloConst.ElementType.HEADER)
                                    ?.map((elm, index2) => (
                                        <Grid item xs={12} key={index2}>
                                            <Stack spacing={1}>
                                                <Typography className="zoa-element-lable">
                                                    {elm.thuTuSapXep} {'. '}Tiêu đề
                                                </Typography>

                                                <TextField
                                                    variant="outlined"
                                                    fullWidth
                                                    size="small"
                                                    value={header_text ?? ''}
                                                />
                                            </Stack>
                                        </Grid>
                                    ))}
                                {objMauTin?.elements
                                    ?.filter((elm) => elm.elementType == ZaloConst.ElementType.TEXT)
                                    ?.map((elm, index2) => (
                                        <Grid item xs={12} key={index2}>
                                            <Stack spacing={1}>
                                                <Typography className="zoa-element-lable">
                                                    {elm.thuTuSapXep}
                                                    {'.'} Văn bản
                                                </Typography>

                                                <TextField
                                                    size="small"
                                                    variant="outlined"
                                                    fullWidth
                                                    multiline
                                                    rows={3}
                                                    value={noiDungVanBan ?? ''}
                                                />
                                            </Stack>
                                        </Grid>
                                    ))}
                                {objMauTin?.elements
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
                                                    {elm?.tables?.map((tbl, indexTbl) => (
                                                        <Stack
                                                            direction={'row'}
                                                            key={indexTbl}
                                                            spacing={2}
                                                            alignItems={'center'}>
                                                            <Stack flex={1}>
                                                                <TextField size="small" fullWidth value={tbl?.key} />
                                                            </Stack>
                                                            <Stack flex={1.5}>
                                                                <TextField size="small" fullWidth value={tbl?.value} />
                                                            </Stack>
                                                            <Close
                                                                sx={{ color: 'red' }}
                                                                onClick={() => table_removeBtn(tbl)}
                                                            />
                                                        </Stack>
                                                    ))}
                                                </Stack>
                                                <Button variant="outlined" startIcon={<Add />} sx={{ width: '25%' }}>
                                                    Thêm hàng
                                                </Button>
                                            </Stack>
                                        </Grid>
                                    ))}

                                {objMauTin?.buttons && (
                                    <Grid item xs={12}>
                                        <Stack spacing={1}>
                                            <Typography className="zoa-element-lable">
                                                {lenElement} {'. '}Nút thao tác
                                            </Typography>

                                            {objMauTin?.buttons?.map((btn, indexBtn) => (
                                                <Stack spacing={1} direction={'row'} key={indexBtn}>
                                                    <Stack flex={1}>
                                                        <SelectWithData
                                                            idChosed={btn?.type}
                                                            data={ZaloConst.ListButtonType}
                                                            handleChange={() => console.log(22)}
                                                            label={'Loại nút'}
                                                        />
                                                    </Stack>
                                                    <Stack flex={1}>
                                                        <TextField
                                                            size="small"
                                                            variant={'outlined'}
                                                            label="Nội dung nút"
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
                            <Divider textAlign="right">XEM TRƯỚC MẪU</Divider>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={5} lg={5}>
                                    <Stack direction={'row'} spacing={1} justifyContent={'flex-end'}>
                                        {/* <Button variant="contained" onClick={saveMauIn}>
                                            Lưu mẫu tin
                                        </Button> */}
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
                                                                mes: `Bạn có chắc chắn muốn xóa mẫu tin ${objMauTin?.tenMauTin} không?`
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
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        </>
    );
}
