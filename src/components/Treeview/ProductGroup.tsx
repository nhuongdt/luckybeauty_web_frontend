import * as React from 'react';
import { Typography, Box, TextField, InputAdornment, Stack } from '@mui/material';
import TreeView from '@mui/lab/TreeView';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import AddIcon from '@mui/icons-material/Add';
import TreeItem from '@mui/lab/TreeItem';
import '../../App.css';
import { ModelNhomHangHoa } from '../../services/product/dto';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { ThemeProvider, createTheme } from '@mui/material/styles';

export default function TreeViewGroupProduct({ dataNhomHang, clickTreeItem }: any) {
    const [rowHover, setRowHover] = React.useState<ModelNhomHangHoa>(
        new ModelNhomHangHoa({ id: '' })
    );
    const [isHover, setIsHover] = React.useState(false);

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
    };
    return (
        <TreeView
            aria-label="file system navigator"
            sx={{ height: 350, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}>
            {dataNhomHang.map((item: any, index: any) => (
                <TreeItem
                    key={item.id}
                    nodeId={item.id}
                    label={
                        <Stack direction="row">
                            <Typography sx={{ width: 8 / 10 }}>{item.tenNhomHang}</Typography>
                            {isHover && rowHover.id === item.id && (
                                <OpenInNewIcon onClick={() => handleClickTreeItem(true)} />
                            )}
                        </Stack>
                    }
                    icon={<LocalOfferIcon />}
                    onMouseLeave={(event) => {
                        handleHover(event, item, index);
                    }}
                    onMouseEnter={(event) => {
                        handleHover(event, item, index);
                    }}
                    onClick={() => handleClickTreeItem(false)}>
                    {item.children.map((child: any, index2: any) => (
                        <TreeItem
                            key={child.id}
                            nodeId={child.id}
                            label={
                                <Stack direction="row">
                                    <Typography sx={{ width: 7.9 / 10 }}>
                                        {child.tenNhomHang}
                                    </Typography>
                                    {isHover && rowHover.id === child.id && (
                                        <OpenInNewIcon onClick={() => handleClickTreeItem(true)} />
                                    )}
                                </Stack>
                            }
                            onMouseLeave={(event) => {
                                handleHover(event, child, index2);
                            }}
                            onMouseEnter={(event) => {
                                handleHover(event, child, index2);
                            }}></TreeItem>
                    ))}
                </TreeItem>
            ))}
        </TreeView>
    );
}
