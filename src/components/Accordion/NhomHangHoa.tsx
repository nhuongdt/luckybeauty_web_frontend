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
        console.log('handleClickTreeItem ', rowHover);
        clickTreeItem(isEdit, rowHover);
    };
    return (
        <>
            {dataNhomHang.map((item: any, index: any) => (
                <Accordion
                    key={index}
                    sx={{
                        border: 'none!important',
                        boxShadow: 'unset',
                        '&.MuiAccordion-root::before': { content: 'none' }
                    }}>
                    <AccordionSummary
                        sx={{ display: 'flex', alignItems: 'center' }}
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
                        {isHover && rowHover.id === item.id && (
                            <OpenInNew
                                onClick={() => handleClickTreeItem(true)}
                                sx={{ position: 'absolute', right: 16 }}
                            />
                        )}
                    </AccordionSummary>

                    <AccordionDetails sx={{ padding: '0', paddingLeft: '30px' }}>
                        {item.children?.map((child: any, index2: any) => (
                            <Button
                                key={index2}
                                sx={{
                                    display: 'block',
                                    color: '#4C4B4C',

                                    textTransform: 'unset',
                                    textAlign: 'left',
                                    fontWeight: '400'
                                }}
                                onClick={() => handleClickTreeItem(false)}>
                                {item.tenNhomHang}
                            </Button>
                        ))}
                    </AccordionDetails>
                </Accordion>
            ))}
        </>
    );
}
