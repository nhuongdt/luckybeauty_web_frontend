import { Component, ReactNode } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    FormGroup,
    IconButton,
    Tab,
    TextField,
    Typography
} from '@mui/material';
import { Form, Formik } from 'formik';
import CloseIcon from '@mui/icons-material/Close';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import roleService from '../../../services/role/roleService';
import { PermissionTree } from '../../../services/role/dto/permissionTree';
import TreeItem from '@mui/lab/TreeItem';
import TreeView from '@mui/lab/TreeView';
import { CreateOrEditRoleDto } from '../../../services/role/dto/createOrEditRoleDto';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
export interface ICreateOrEditRoleProps {
    visible: boolean;
    onCancel: () => void;
    modalType: string;
    onOk: () => void;
    permissionTree: PermissionTree[];
    formRef: CreateOrEditRoleDto;
}

interface ICreateOrEditRoleState {
    filteredPermissions: PermissionTree[];
    selectedPermissions: string[];
    tabIndex: string;
}
class CreateOrEditRoleModal extends Component<ICreateOrEditRoleProps> {
    state = {
        selectedPermissions: [] as string[],
        tabIndex: '1'
    };
    componentDidMount() {
        console.log(this.props.formRef.grantedPermissionNames);
        this.setState({ selectedPermissions: this.props.formRef.grantedPermissionNames }, () => {
            console.log(this.state.selectedPermissions);
        });
    }
    handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
        this.setState({ tabIndex: newValue });
    };

    handleSubmit = async (values: CreateOrEditRoleDto) => {
        await roleService.createOrEdit({
            ...values,
            grantedPermissionNames: this.state.selectedPermissions
        });
        this.props.onOk();
    };
    handleCheck = (event: any, node: PermissionTree) => {
        const checked = event.target.checked;
        const updatedSelected = [...this.state.selectedPermissions, 'Pages'];

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
        const index = selectedPermissions.indexOf(node.name);
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
    renderTree = (nodes: PermissionTree[], selectedPermissions: string[]) => {
        return nodes.map((node: PermissionTree) => (
            <TreeItem
                key={node.name}
                nodeId={node.name}
                label={
                    <div>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={selectedPermissions?.indexOf(node.name) !== -1}
                                    indeterminate={
                                        selectedPermissions?.indexOf(node.name) === -1 &&
                                        node.children.some(
                                            (child: any) =>
                                                selectedPermissions?.indexOf(child.name) !== -1
                                        )
                                    }
                                    onChange={(event: any) => {
                                        this.handleCheck(event, node);
                                    }}
                                />
                            }
                            label={
                                <>
                                    {node.children ? (
                                        <FolderOutlinedIcon />
                                    ) : (
                                        <InsertDriveFileOutlinedIcon />
                                    )}{' '}
                                    {node.displayName}
                                </>
                            }
                        />
                    </div>
                }>
                {Array.isArray(node.children)
                    ? this.renderTree(node.children, selectedPermissions)
                    : null}
            </TreeItem>
        ));
    };

    render(): ReactNode {
        const { visible, onCancel, modalType, permissionTree, formRef } = this.props;
        const initialValues = {
            description: formRef.description,
            displayName: formRef.displayName,
            name: formRef.name,
            grantedPermissionNames: formRef.grantedPermissionNames,
            id: formRef.id
        };
        const getDefaultExpandPermission = (permissions: PermissionTree[]) => {
            const defaultExpand: string[] = [];
            permissions.forEach((item: PermissionTree) => {
                if (item.children.length > 0) {
                    const childrenExpand = getDefaultExpandPermission(item.children);
                    defaultExpand.push(item.name, ...childrenExpand);
                }
            });

            return defaultExpand;
        };

        const defaultExpand = getDefaultExpandPermission(this.props.permissionTree);
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
                        onClick={onCancel}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8
                        }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Formik initialValues={initialValues} onSubmit={this.handleSubmit}>
                        {({ values, handleChange, errors, touched }) => (
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
                                            <FormGroup
                                                sx={{
                                                    '& .MuiFormControlLabel-root': {
                                                        width: '100%'
                                                    },
                                                    overflowY: 'auto',
                                                    overflowX: 'hidden',
                                                    maxHeight: '300px'
                                                }}>
                                                <TreeView
                                                    defaultExpanded={defaultExpand}
                                                    defaultCollapseIcon={<ExpandMoreIcon />}
                                                    defaultExpandIcon={<ChevronRightIcon />}>
                                                    {this.renderTree(
                                                        permissionTree,
                                                        this.state.selectedPermissions
                                                    )}
                                                </TreeView>
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
                                                    borderColor: '#7C3367!important',
                                                    color: '#7C3367'
                                                }}
                                                onClick={onCancel}>
                                                Hủy
                                            </Button>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                onClick={() => {
                                                    this.handleSubmit(values);
                                                }}
                                                sx={{ backgroundColor: '#7C3367!important' }}>
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

export default CreateOrEditRoleModal;
