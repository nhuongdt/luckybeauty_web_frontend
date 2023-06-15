import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Box,
    Typography,
    Button
} from '@mui/material';
import { useState } from 'react';
import { OpenInNew, LocalOffer } from '@mui/icons-material';
import { ModelNhomHangHoa } from '../../services/product/dto';

export default function AccordionNhomHangHoa({ dataNhomHang, clickTreeItem }: any) {
    const [rowHover, setRowHover] = useState<ModelNhomHangHoa>(new ModelNhomHangHoa({ id: '' }));
    const [isHover, setIsHover] = useState(false);
    const [isClick, setIsClick] = useState(false);

    const handleHover = (event: any, rowData: any, index: number) => {
        switch (event.type) {
            case 'mouseenter': // enter
                setIsHover(true);
                break;
            case 'mouseleave': //leave
                setIsHover(false);
                break;
        }
        setRowHover(rowData);
    };
    const handleClickTreeItem = (isEdit = false) => {
        clickTreeItem(isEdit, rowHover);
        setIsClick(true);
    };
    return (
        <>
            {dataNhomHang.map((item: any, index: any) => (
                <Accordion
                    disableGutters
                    key={index}
                    sx={{
                        border: 'none!important',
                        boxShadow: 'unset',
                        '&.MuiAccordion-root::before': { content: 'none' }
                    }}>
                    <AccordionSummary
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            backgroundColor: isClick && rowHover.id === item.id ? 'red' : ''
                        }}
                        onMouseLeave={(event: any) => {
                            handleHover(event, item, index);
                        }}
                        onMouseEnter={(event: any) => {
                            handleHover(event, item, index);
                        }}>
                        <LocalOffer sx={{ color: item.color }} />
                        <Typography
                            variant="subtitle1"
                            color="#333233"
                            fontWeight="700"
                            sx={{
                                marginLeft: '9px',
                                display: 'flex',
                                alignItems: 'center'
                            }}
                            onClick={() => handleClickTreeItem(false)}>
                            {item.tenNhomHang}
                        </Typography>
                        {isHover && item.id !== '' && rowHover.id === item.id && (
                            <OpenInNew
                                onClick={() => handleClickTreeItem(true)}
                                sx={{ position: 'absolute', right: 16 }}
                            />
                        )}
                    </AccordionSummary>

                    {item.children?.map((child: any, index2: any) => (
                        <AccordionDetails
                            key={index2}
                            sx={{ display: 'flex', paddingLeft: '30px' }}
                            onMouseLeave={(event: any) => {
                                handleHover(event, child, index2);
                            }}
                            onMouseEnter={(event: any) => {
                                handleHover(event, child, index2);
                            }}>
                            <LocalOffer sx={{ color: item.color }} />
                            <Typography
                                variant="subtitle1"
                                color="#333233"
                                sx={{
                                    marginLeft: '9px'
                                }}
                                onClick={() => handleClickTreeItem(false)}>
                                {child.tenNhomHang}
                            </Typography>
                            {isHover && rowHover.id === child.id && (
                                <OpenInNew
                                    onClick={() => handleClickTreeItem(true)}
                                    sx={{ position: 'absolute', right: 16 }}
                                />
                            )}
                        </AccordionDetails>
                    ))}
                </Accordion>
            ))}
        </>
    );
}
