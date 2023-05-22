import * as React from 'react';
import {
    Box,
    Grid,
    Typography,
    ButtonGroup,
    Button,
    TextField,
    IconButton,
    List,
    ListItem,
    Avatar,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import arrowIcon from '../../images/arrow_back.svg';
import serviceIcon1 from '../../images/tocIcon.svg';
import serviceIcon2 from '../../images/hoachatIcon.svg';
import serviceIcon3 from '../../images/other.svg';
import serviceIcon4 from '../../images/combo.svg';
import productIcon1 from '../../images/goixa.svg';
import productIcon2 from '../../images/dactri.svg';
import productIcon3 from '../../images/duongtoc.svg';
import avatar from '../../images/avatar.png';
import searchIcon from '../../images/search-normal.svg';
import dotIcon from '../../images/dotssIcon.svg';
const PageBanHang: React.FC = () => {
    const Services = [
        {
            name: 'Chăm sóc tóc',
            icon: serviceIcon1,
            outline: '#009EF7',

            categorys: [
                {
                    name: 'Cắt tóc',
                    price: 500000
                },
                {
                    name: 'Gội đầu massage',
                    price: 500000
                },
                {
                    name: 'Hấp dầu',
                    price: 500000
                },
                {
                    name: 'Hấp phục hồi',
                    price: 500000
                },
                {
                    name: 'Hấp phục hồi chuyên sâu',
                    price: 500000
                }
            ]
        },
        {
            name: 'Hóa chất tóc',
            icon: serviceIcon2,
            outline: '#FFC700',

            categorys: [
                {
                    name: 'Uốn/ duỗi/ ép',
                    price: 500000
                },
                {
                    name: 'Nhuộm',
                    price: 500000
                },
                {
                    name: 'Dập phồng',
                    price: 500000
                },
                {
                    name: 'Nâng tone tóc',
                    price: 500000
                },
                {
                    name: 'Chấm chân tóc',
                    price: 500000
                },
                {
                    name: 'Bọc màu',
                    price: 500000
                }
            ]
        },
        {
            name: 'Dịch vụ khác',
            icon: serviceIcon3,
            outline: '#F1416C',

            categorys: [
                {
                    name: 'Nối tóc',
                    price: 500000
                },
                {
                    name: 'Gẩy light',
                    price: 500000
                },
                {
                    name: 'Uốn mái',
                    price: 500000
                },
                {
                    name: 'Nâng tone tóc',
                    price: 500000
                },
                {
                    name: 'Chấm chân tóc',
                    price: 500000
                },
                {
                    name: 'Bọc màu',
                    price: 500000
                }
            ]
        },
        {
            name: 'Combo',
            icon: serviceIcon4,
            outline: '#50CD89',

            categorys: [
                {
                    name: 'Nối tóc',
                    price: 500000
                },
                {
                    name: 'Gẩy light',
                    price: 500000
                },
                {
                    name: 'Uốn mái',
                    price: 500000
                },
                {
                    name: 'Nâng tone tóc',
                    price: 500000
                },
                {
                    name: 'Chấm chân tóc',
                    price: 500000
                },
                {
                    name: 'Bọc màu',
                    price: 500000
                }
            ]
        }
    ];
    const products = [
        {
            name: 'Dầu gội, dầu xả',
            icon: productIcon1,
            outline: '#FFB1C7',

            categorys: [
                {
                    name: 'Nối tóc',
                    price: 500000
                },
                {
                    name: 'Gẩy light',
                    price: 500000
                },
                {
                    name: 'Uốn mái',
                    price: 500000
                },
                {
                    name: 'Nâng tone tóc',
                    price: 500000
                },
                {
                    name: 'Chấm chân tóc',
                    price: 500000
                },
                {
                    name: 'Bọc màu',
                    price: 500000
                }
            ]
        },
        {
            name: 'Đặc trị',
            icon: productIcon2,
            outline: '#022ABA',

            categorys: [
                {
                    name: 'Nối tóc',
                    price: 500000
                },
                {
                    name: 'Gẩy light',
                    price: 500000
                },
                {
                    name: 'Uốn mái',
                    price: 500000
                },
                {
                    name: 'Nâng tone tóc',
                    price: 500000
                },
                {
                    name: 'Chấm chân tóc',
                    price: 500000
                },
                {
                    name: 'Bọc màu',
                    price: 500000
                }
            ]
        },
        {
            name: 'Dưỡng tóc',
            icon: productIcon3,
            outline: '#E613EB',

            categorys: [
                {
                    name: 'Nối tóc',
                    price: 500000
                },
                {
                    name: 'Gẩy light',
                    price: 500000
                },
                {
                    name: 'Uốn mái',
                    price: 500000
                },
                {
                    name: 'Nâng tone tóc',
                    price: 500000
                },
                {
                    name: 'Chấm chân tóc',
                    price: 500000
                },
                {
                    name: 'Bọc màu',
                    price: 500000
                }
            ]
        }
    ];
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };
    return (
        <>
            <Grid
                container
                spacing={3}
                marginTop="21px"
                paddingLeft="2.2222222222222223vw"
                paddingBottom="24px">
                <Grid item lg={3}>
                    <Box
                        sx={{
                            backgroundColor: '#fff',
                            borderRadius: '8px',
                            boxShadow: ' 0px 20px 100px 0px #0000000D',
                            padding: '16px 24px',
                            height: '100%',
                            maxHeight: '72.9492vh',
                            overflowY: 'auto'
                        }}>
                        <Box>
                            <Typography
                                variant="h3"
                                fontSize="18px"
                                color="#4C4B4C"
                                fontWeight="700">
                                Nhóm dịch vụ
                            </Typography>
                            <List>
                                {Services.map((Service) => (
                                    <ListItem
                                        sx={{
                                            gap: '6px',
                                            padding: '10px',
                                            borderWidth: '1px',
                                            borderStyle: 'solid',
                                            borderColor: Service.outline,
                                            borderRadius: '8px',
                                            marginTop: '12px'
                                        }}
                                        key={Service.name.replace(/\s/g, '')}>
                                        <ListItemIcon sx={{ minWidth: '0' }}>
                                            <img src={Service.icon} alt={Service.name} />
                                        </ListItemIcon>
                                        <ListItemText>{Service.name}</ListItemText>
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                        <Box>
                            <Typography
                                variant="h3"
                                fontSize="18px"
                                color="#4C4B4C"
                                fontWeight="700"
                                marginTop="12px">
                                Sản phẩm
                            </Typography>
                            <List>
                                {products.map((product) => (
                                    <ListItem
                                        sx={{
                                            gap: '6px',
                                            padding: '10px',
                                            borderWidth: '1px',
                                            borderStyle: 'solid',
                                            borderColor: product.outline,
                                            borderRadius: '8px',
                                            marginTop: '12px'
                                        }}
                                        key={product.name.replace(/\s/g, '')}>
                                        <ListItemIcon sx={{ minWidth: '0' }}>
                                            <img src={product.icon} alt={product.name} />
                                        </ListItemIcon>
                                        <ListItemText>{product.name}</ListItemText>
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    </Box>
                </Grid>
                <Grid item lg={5}>
                    <Box display="flex" flexDirection="column">
                        <TextField
                            fullWidth
                            sx={{
                                backgroundColor: '#fff',
                                borderColor: '#CDC9CD!important',
                                borderWidth: '1px!important',
                                maxWidth: 'calc(100% - 32px)',
                                boxShadow: ' 0px 20px 100px 0px #0000000D',

                                margin: 'auto'
                            }}
                            size="small"
                            className="search-field"
                            variant="outlined"
                            type="search"
                            placeholder="Tìm kiếm"
                            InputProps={{
                                startAdornment: (
                                    <IconButton type="submit">
                                        <img src={searchIcon} />
                                    </IconButton>
                                )
                            }}
                        />
                        <Box
                            display="flex"
                            flexDirection="column"
                            gap="24px"
                            padding="16px"
                            marginTop="12px"
                            sx={{
                                backgroundColor: '#fff',
                                borderRadius: '8px',
                                maxHeight: '67.0898vh',
                                overflowY: 'auto'
                            }}>
                            {Services.map((Service) => (
                                <Box key={Service.name.replace(/\s/g, '')}>
                                    <Typography
                                        variant="h4"
                                        fontSize="16px"
                                        color="#000"
                                        fontWeight="700"
                                        marginBottom="16px">
                                        {Service.name}
                                    </Typography>

                                    <Grid container spacing={1.5}>
                                        {Service.categorys.map((category) => (
                                            <Grid item lg={4}>
                                                <Box
                                                    height="104px"
                                                    padding="8px 12px 9px 12px"
                                                    display="flex"
                                                    flexDirection="column"
                                                    justifyContent="space-between"
                                                    borderRadius="4px"
                                                    style={{
                                                        backgroundColor: Service.outline + '1a'
                                                    }}>
                                                    <Typography
                                                        variant="h5"
                                                        fontSize="14px"
                                                        fontWeight="700"
                                                        color="#333233">
                                                        {category.name}
                                                    </Typography>
                                                    <Typography
                                                        variant="body1"
                                                        fontSize="14px"
                                                        color="#333233">
                                                        {formatCurrency(category.price)}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>
                            ))}
                            {products.map((product) => (
                                <Box key={product.name.replace(/\s/g, '')}>
                                    <Typography
                                        variant="h4"
                                        fontSize="16px"
                                        color="#000"
                                        fontWeight="700"
                                        marginBottom="16px">
                                        {product.name}
                                    </Typography>

                                    <Grid container spacing={1.5}>
                                        {product.categorys.map((category) => (
                                            <Grid item lg={4}>
                                                <Box
                                                    height="104px"
                                                    padding="8px 12px 9px 12px"
                                                    display="flex"
                                                    flexDirection="column"
                                                    justifyContent="space-between"
                                                    borderRadius="4px"
                                                    style={{
                                                        backgroundColor: product.outline + '1a'
                                                    }}>
                                                    <Typography
                                                        variant="h5"
                                                        fontSize="14px"
                                                        fontWeight="700"
                                                        color="#333233">
                                                        {category.name}
                                                    </Typography>
                                                    <Typography
                                                        variant="body1"
                                                        fontSize="14px"
                                                        color="#333233">
                                                        {formatCurrency(category.price)}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </Grid>
                <Grid item lg={4}>
                    <Box
                        sx={{
                            backgroundColor: '#fff',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            height: '100%',
                            maxHeight: '72.9492vh',
                            overflowY: 'auto',
                            padding: '24px 16px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                        }}>
                        <Box sx={{ backgroundColor: '#fff', radius: '8px' }}>
                            <Box display="flex" gap="8px" alignItems="start">
                                <Avatar src={avatar} sx={{ width: 40, height: 40 }} />
                                <Box>
                                    <Typography variant="body2" fontSize="14px" color="#666466">
                                        Đinh Tuấn Tài
                                    </Typography>
                                    <Typography variant="body2" fontSize="12px" color="#999699">
                                        0911290476
                                    </Typography>
                                </Box>
                                <Button sx={{ marginLeft: 'auto' }}>
                                    <img
                                        src={dotIcon}
                                        style={{
                                            filter: 'brightness(0) saturate(100%) invert(11%) sepia(2%) saturate(2336%) hue-rotate(295deg) brightness(93%) contrast(94%)'
                                        }}
                                    />
                                </Button>
                            </Box>
                        </Box>
                        <Box display="flex" flexDirection="column" gap="32px">
                            <Box display="flex" justifyContent="space-between">
                                <Typography variant="h6" fontSize="14px" color="#3B4758">
                                    Tổng tiền hàng
                                </Typography>
                                <Typography variant="caption" fontSize="12px" color="#3B4758">
                                    700.000 đ
                                </Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between">
                                <Typography variant="h6" fontSize="14px" color="#3B4758">
                                    Giảm giá
                                </Typography>
                                <Typography variant="caption" fontSize="12px" color="#3B4758">
                                    700.000 đ
                                </Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between">
                                <Typography variant="h6" fontSize="14px" color="#3B4758">
                                    Tổng giảm giá
                                </Typography>
                                <Typography variant="caption" fontSize="12px" color="#3B4758">
                                    700.000 đ
                                </Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between">
                                <Typography
                                    variant="h5"
                                    fontWeight="700"
                                    fontSize="18px"
                                    color="#3B4758">
                                    Tổng thanh toán
                                </Typography>
                                <Typography
                                    variant="body1"
                                    fontWeight="700"
                                    fontSize="16px"
                                    color="#3B4758">
                                    2.100.000 đ
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
            <Box
                sx={{
                    width: '100%',
                    justifyContent: 'space-between',
                    display: 'flex',
                    padding: '28px 32px',
                    backgroundColor: '#fff'
                }}>
                <Button
                    variant="outlined"
                    sx={{
                        display: 'flex',
                        gap: '6px',
                        borderColor: '#3B4758',
                        textTransform: 'unset!important'
                    }}>
                    <img src={arrowIcon} />
                    <Typography
                        color="#3B4758"
                        variant="button"
                        fontSize="14px"
                        fontWeight="400"
                        sx={{ textTransform: 'unset!important' }}>
                        Quay trở lại
                    </Typography>
                </Button>
                <Button
                    variant="contained"
                    sx={{
                        fontSize: '14px',
                        fontWeight: '400',
                        color: '#fff',
                        textTransform: 'unset!important',
                        backgroundColor: '#7C3367!important',
                        width: 'calc(33.33333% - 75px)'
                    }}>
                    Thanh Toán
                </Button>
            </Box>
        </>
    );
};
export default PageBanHang;
