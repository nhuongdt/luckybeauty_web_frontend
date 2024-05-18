import * as React from 'react';
import { Typography, TextField, Stack } from '@mui/material';
import { OpenInNew, LocalOffer, Search } from '@mui/icons-material';
import TreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';
import utils from '../../utils/utils';
import { IList } from '../../services/dto/IList';

interface IPropsTreeView {
    roleEdit: boolean;
    defaultId?: string;
    lstData: IList[];
    clickTreeItem: (isEdit?: boolean, itemChosed?: IList | null) => void;
}

export default function TreeViewGroupProduct({ roleEdit, defaultId, lstData, clickTreeItem }: IPropsTreeView) {
    const [rowHover, setRowHover] = React.useState<IList | null>();
    const [isHover, setIsHover] = React.useState(false);
    const [textSearch, setTextSearch] = React.useState('');

    const iconThis = lstData?.length > 0 ? lstData[0].icon : <LocalOffer />;

    const handleHover = (event: React.MouseEvent<HTMLElement>, rowData: IList) => {
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
    const handleClickAll = () => {
        setRowHover(null);
        clickTreeItem(false, null);
    };

    const dataTreeSearch = lstData?.filter((x: IList) => {
        const txt = textSearch.trim().toLowerCase();
        const txtUnsign = utils.strToEnglish(txt);
        return (
            (x?.text !== null && x?.text !== undefined && x?.text?.trim().toLowerCase().indexOf(txt) > -1) ||
            (x?.text2 !== null && x?.text2 !== undefined && x.text2.trim().toLowerCase().indexOf(txt) > -1) ||
            (x?.text !== null && x?.text !== undefined && utils.strToEnglish(x?.text).indexOf(txtUnsign) > -1) ||
            (x?.text2 !== null && x?.text2 !== undefined && utils.strToEnglish(x?.text2).indexOf(txtUnsign) > -1)
        );
    });

    return (
        <>
            <Stack spacing={1}>
                <TextField
                    variant="standard"
                    fullWidth
                    placeholder="Tìm nhóm dịch vụ"
                    InputProps={{ startAdornment: <Search /> }}
                    onChange={(e) => setTextSearch(e.target.value)}
                />
                <Stack
                    direction="row"
                    padding={'6px 3px '}
                    onClick={handleClickAll}
                    spacing={1}
                    sx={{
                        cursor: 'pointer',
                        backgroundColor: utils.checkNull(defaultId) ? 'var(--color-bg)' : '',
                        '&:hover': {
                            bgcolor: 'var(--color-bg)'
                        }
                    }}>
                    {iconThis}
                    <Typography variant="body2">Tất cả</Typography>
                </Stack>
            </Stack>

            <TreeView
                sx={{ flexGrow: 1, minWidth: 200, overflowY: 'auto' }}
                defaultCollapseIcon={iconThis}
                defaultExpandIcon={iconThis}>
                {dataTreeSearch.map((item: IList) => (
                    <TreeItem
                        key={item.id}
                        nodeId={item?.id ?? ''}
                        sx={{ backgroundColor: defaultId == item.id ? 'var(--color-bg)' : '' }}
                        label={
                            <Stack direction="row" padding={'6px 3px '}>
                                <Typography variant="body2">{item.text}</Typography>
                                {isHover && rowHover?.id === item.id && roleEdit && (
                                    <OpenInNew onClick={() => handleClickTreeItem(true)} />
                                )}
                            </Stack>
                        }
                        onMouseLeave={(event: any) => {
                            handleHover(event, item);
                        }}
                        onMouseEnter={(event: any) => {
                            handleHover(event, item);
                        }}
                        onClick={() => handleClickTreeItem(false)}>
                        {item?.children?.map((child: IList) => (
                            <TreeItem
                                key={child.id}
                                nodeId={child.id ?? ''}
                                onClick={() => handleClickTreeItem(false)}
                                sx={{ backgroundColor: defaultId == item.id ? 'var(--color-bg)' : '' }}
                                label={
                                    <Stack direction="row" padding={'6px 3px '}>
                                        <Typography variant="body2">{child.text}</Typography>
                                        {isHover && rowHover?.id === child.id && roleEdit && (
                                            <OpenInNew onClick={() => handleClickTreeItem(true)} />
                                        )}
                                    </Stack>
                                }
                                onMouseLeave={(event: any) => {
                                    handleHover(event, child);
                                }}
                                onMouseEnter={(event: any) => {
                                    handleHover(event, child);
                                }}></TreeItem>
                        ))}
                    </TreeItem>
                ))}
            </TreeView>
        </>
    );
}
