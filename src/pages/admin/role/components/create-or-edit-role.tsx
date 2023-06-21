import { Component, ReactNode } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormGroup,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Tab,
    TextField,
    Typography
} from '@mui/material';
import { Form, Formik } from 'formik';
import CloseIcon from '@mui/icons-material/Close';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import roleService from '../../../../services/role/roleService';
import { PermissionTree } from '../../../../services/role/dto/permissionTree';
import { CreateOrEditRoleDto } from '../../../../services/role/dto/createOrEditRoleDto';
import { enqueueSnackbar } from 'notistack';
import { observer } from 'mobx-react';
import rules from './createOrUpdateRole.validation';
export interface ICreateOrEditRoleProps {
    visible: boolean;
    onCancel: () => void;
    modalType: string;
    onOk: () => void;
    permissionTree: PermissionTree[];
    formRef: CreateOrEditRoleDto;
}

interface ICreateOrEditRoleState {
    selectedPermissions: string[];
    expandedPermissions: string[];
    tabIndex: string;
}
class CreateOrEditRoleModal extends Component<ICreateOrEditRoleProps, ICreateOrEditRoleState> {
    state = {
        selectedPermissions: this.props.formRef.grantedPermissions ?? ['Pages'],
        expandedPermissions: ['Pages'],
        tabIndex: '1'
    };
    handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
        const defaultExpand = this.getDefaultExpandPermission(this.props.permissionTree);
        this.setState({
            tabIndex: newValue,
            selectedPermissions: this.props.formRef.grantedPermissions ?? ['Pages'],
            expandedPermissions: defaultExpand
        });
    };
    getDefaultExpandPermission = (permissions: PermissionTree[]) => {
        const defaultExpand: string[] = [];
        permissions.forEach((item: PermissionTree) => {
            if (item.children.length > 0) {
                const childrenExpand = this.getDefaultExpandPermission(item.children);
                defaultExpand.push(item.name, ...childrenExpand);
            }
        });

        return defaultExpand;
    };
    handleSubmit = async (values: CreateOrEditRoleDto) => {
        const permission = this.state.selectedPermissions.filter((x) => x != '');
        alert(JSON.stringify(permission));
        const createOrEdit = await roleService.createOrEdit({
            ...values,
            grantedPermissions: permission
        });
        createOrEdit != null
            ? values.id === 0
                ? enqueueSnackbar('Thêm mới thành công', {
                      variant: 'success',
                      autoHideDuration: 3000
                  })
                : enqueueSnackbar('Cập nhật thành công', {
                      variant: 'success',
                      autoHideDuration: 3000
                  })
            : enqueueSnackbar('Có lỗi sảy ra vui lòng thử lại sau', {
                  variant: 'error',
                  autoHideDuration: 3000
              });
        this.setState({
            tabIndex: '1',
            selectedPermissions: []
        });
        this.props.onOk();
    };
    handleCheck = (event: any, node: PermissionTree) => {
        const checked = event.target.checked;
        const updatedSelected = [...this.state.selectedPermissions];

        if (checked) {
            this.addPermission(updatedSelected, node);
            this.addChildrenPermissions(updatedSelected, node.children);
        } else {
            this.removePermission(updatedSelected, node);
            this.removeChildrenPermissions(updatedSelected, node.children);
        }
        this.setState({ selectedPermissions: updatedSelected });
    };

    addPermission = (selectedPermissions: string[], node: PermissionTree) => {
        if (selectedPermissions.indexOf(node.name) === -1) {
            selectedPermissions.push(node.name);
            if (selectedPermissions?.includes(node.parentNode) == false) {
                selectedPermissions.push(node.parentNode);
            }
        }
    };

    addChildrenPermissions = (selectedPermissions: string[], children: PermissionTree[]) => {
        if (Array.isArray(children)) {
            children.forEach((child: PermissionTree) => {
                this.addPermission(selectedPermissions, child);
                this.addChildrenPermissions(selectedPermissions, child.children);
            });
        }
    };

    removePermission = (selectedPermissions: string[], node: PermissionTree) => {
        const index = selectedPermissions?.indexOf(node.name);
        if (index !== -1) {
            selectedPermissions.splice(index, 1);
        }
    };

    removeChildrenPermissions = (selectedPermissions: string[], children: PermissionTree[]) => {
        if (Array.isArray(children)) {
            children.forEach((child: PermissionTree) => {
                this.removePermission(selectedPermissions, child);
                this.removeChildrenPermissions(selectedPermissions, child.children);
            });
        }
    };

    renderTree = (nodes: PermissionTree[], isCollapsed = false) => {
        return nodes.map((node) => {
            const hasChildren = node.children && node.children.length > 0;
            const isItemCollapsed =
                isCollapsed || !this.state.expandedPermissions?.includes(node.name);

            return (
                <ListItem key={node.name} disablePadding>
                    <ListItemText>
                        {hasChildren && (
                            <>
                                {isItemCollapsed ? (
                                    <ExpandMoreIcon
                                        onClick={() => this.toggleCollapse(node.name)}
                                    />
                                ) : (
                                    <ChevronRightIcon
                                        onClick={() => this.toggleCollapse(node.name)}
                                    />
                                )}
                            </>
                        )}
                        <Checkbox
                            onChange={(e) => this.handleCheck(e, node)}
                            checked={this.state.selectedPermissions?.includes(node.name)}
                            sx={{
                                color: '#7C3367',
                                '&.Mui-checked': {
                                    color: '#7C3367'
                                }
                            }}
                        />
                        <>
                            {node.children !== null && node.children.length > 0 ? (
                                <FolderIcon sx={{ color: '#FFA800' }} />
                            ) : (
                                <InsertDriveFileOutlinedIcon sx={{ color: '#FFA800' }} />
                            )}{' '}
                            {node.displayName}
                        </>
                        {hasChildren && (
                            <>
                                {!isItemCollapsed && (
                                    <List disablePadding sx={{ pl: 4 }}>
                                        {this.renderTree(node.children)}
                                    </List>
                                )}
                            </>
                        )}
                    </ListItemText>
                </ListItem>
            );
        });
    };

    toggleCollapse = (nodeName: string) => {
        const expandedPermissions = [...this.state.expandedPermissions];
        const index = expandedPermissions.indexOf(nodeName);

        if (index > -1) {
            expandedPermissions.splice(index, 1);
        } else {
            expandedPermissions.push(nodeName);
        }

        this.setState({ expandedPermissions: expandedPermissions });
    };

    render(): ReactNode {
        const { visible, onCancel, modalType, permissionTree, formRef } = this.props;
        const initialValues = {
            description: formRef.description,
            displayName: formRef.displayName,
            name: formRef.name,
            grantedPermissions: formRef.grantedPermissions,
            id: formRef.id
        };
        return (
            <Dialog open={visible} onClose={onCancel} fullWidth maxWidth="sm">
                <DialogTitle>
                    <Typography
                        variant="h3"
                        fontSize="24px"
                        color="rgb(51, 50, 51)"
                        fontWeight="700">
                        {modalType}
                    </Typography>
                    <IconButton
                        aria-label="close"
                        onClick={() => {
                            this.setState({
                                tabIndex: '1',
                                selectedPermissions: []
                            });
                            onCancel();
                        }}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            '&:hover svg': {
                                filter: 'brightness(0) saturate(100%) invert(34%) sepia(44%) saturate(2405%) hue-rotate(316deg) brightness(98%) contrast(92%)'
                            }
                        }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Formik
                        initialValues={initialValues}
                        onSubmit={this.handleSubmit}
                        validationSchema={rules}>
                        {({ values, handleChange, errors }) => (
                            <Form>
                                <Box>
                                    <TabContext value={this.state.tabIndex}>
                                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                            <TabList
                                                onChange={this.handleTabChange}
                                                aria-label="lab API tabs example"
                                                sx={{
                                                    '& .MuiTabs-flexContainer': { gap: '24px' },
                                                    '& button': {
                                                        fontSize: '14px'
                                                    }
                                                }}>
                                                <Tab
                                                    label="Vai trò"
                                                    value="1"
                                                    sx={{
                                                        textTransform: 'unset!important',
                                                        padding: '0'
                                                    }}
                                                />
                                                <Tab
                                                    label="Quyền"
                                                    value="2"
                                                    sx={{
                                                        textTransform: 'unset!important',
                                                        padding: '0'
                                                    }}
                                                />
                                            </TabList>
                                        </Box>
                                        <TabPanel
                                            value="1"
                                            sx={{
                                                padding: '0',
                                                '& label': {
                                                    fontSize: '14px'
                                                },
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '16px',
                                                marginTop: '16px'
                                            }}>
                                            <FormGroup>
                                                <label htmlFor="name">
                                                    Tên vai trò
                                                    <span
                                                        style={{
                                                            color: 'red',
                                                            marginRight: '3px'
                                                        }}>
                                                        *
                                                    </span>
                                                </label>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    id="name"
                                                    type="text"
                                                    name="name"
                                                    value={values.name}
                                                    onChange={handleChange}
                                                />
                                                {errors.name && (
                                                    <small className="text-danger">
                                                        {errors.name}
                                                    </small>
                                                )}
                                            </FormGroup>
                                            <FormGroup>
                                                <label htmlFor="displayName">
                                                    Tên hiển thị
                                                    <span
                                                        style={{
                                                            color: 'red',
                                                            marginRight: '3px'
                                                        }}>
                                                        *
                                                    </span>
                                                </label>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    id="displayName"
                                                    type="text"
                                                    name="displayName"
                                                    value={values.displayName}
                                                    onChange={handleChange}
                                                />
                                                {errors.displayName && (
                                                    <small className="text-danger">
                                                        {errors.displayName}
                                                    </small>
                                                )}
                                            </FormGroup>
                                            <FormGroup>
                                                <label htmlFor="description">Mô tả</label>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    id="description"
                                                    type="text"
                                                    name="description"
                                                    value={values.description}
                                                    onChange={handleChange}
                                                />
                                            </FormGroup>
                                        </TabPanel>
                                        <TabPanel value="2" sx={{ padding: '0' }}>
                                            <TextField
                                                size="small"
                                                fullWidth
                                                placeholder="Tìm kiếm..."
                                                sx={{
                                                    paddingTop: 1,
                                                    paddingBottom: 2
                                                }}></TextField>
                                            <FormGroup
                                                sx={{
                                                    '& .MuiFormControlLabel-root': {
                                                        width: '100%'
                                                    },
                                                    overflowY: 'auto',
                                                    overflowX: 'hidden',
                                                    maxHeight: '450px'
                                                }}>
                                                <List component="nav" disablePadding>
                                                    {this.renderTree(permissionTree)}
                                                </List>
                                            </FormGroup>
                                        </TabPanel>
                                    </TabContext>
                                    <DialogActions>
                                        <Box
                                            display="flex"
                                            width="fit-content"
                                            marginLeft="auto"
                                            gap="8px"
                                            sx={{
                                                '& button': {
                                                    textTransform: 'unset!important'
                                                }
                                            }}>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                sx={{
                                                    color: '#7C3367'
                                                }}
                                                onClick={() => {
                                                    this.setState({
                                                        tabIndex: '1',
                                                        selectedPermissions: []
                                                    });
                                                    onCancel();
                                                }}
                                                className="btn-outline-hover">
                                                Hủy
                                            </Button>
                                            <Button
                                                variant="contained"
                                                type="submit"
                                                size="small"
                                                sx={{ backgroundColor: '#7C3367!important' }}
                                                className="btn-container-hover">
                                                Lưu
                                            </Button>
                                        </Box>
                                    </DialogActions>
                                </Box>
                            </Form>
                        )}
                    </Formik>
                </DialogContent>
            </Dialog>
        );
    }
}

export default observer(CreateOrEditRoleModal);
