import { Component, ReactNode, ChangeEvent } from 'react';
import { GetAllPermissionsOutput } from '../../../services/role/dto/getAllPermissionsOutput';
import RoleEditModel from '../../../models/Roles/roleEditModel';
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
import SearchIcon from '@mui/icons-material/Search';
import { PermissionTree } from '../../../services/role/dto/permissionTree';
import TreeItem from '@mui/lab/TreeItem';
import TreeView from '@mui/lab/TreeView';
import { CreateOrEditRoleDto } from '../../../services/role/dto/createOrEditRoleDto';

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
    checkedAll: boolean;
    selectedPermissions: string[];
    tabIndex: string;
}

class CreateOrEditRoleModal extends Component<ICreateOrEditRoleProps, ICreateOrEditRoleState> {
    constructor(props: ICreateOrEditRoleProps) {
        super(props);

        this.state = {
            filteredPermissions: props.permissionTree,
            checkedAll: false,
            selectedPermissions: this.props.formRef.grantedPermissionNames || [],
            tabIndex: '1'
        };
    }
    async componentDidMount() {
        await this.setState({
            selectedPermissions: this.props.formRef.grantedPermissionNames
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
    };

    handleSearchPermission = (value: string) => {
        const { permissionTree } = this.props;
        const filtered = permissionTree.filter((x: PermissionTree) =>
            x.displayName.toLowerCase().includes(value.toLowerCase())
        );
        this.setState({ filteredPermissions: filtered });
    };
    handlePermissionCheckboxChange = (
        event: ChangeEvent<HTMLInputElement>,
        treeNode: PermissionTree
    ) => {
        const { formRef } = this.props;
        const { checked } = event.target;

        let grantedPermissionNames = [...formRef.grantedPermissionNames];

        if (checked) {
            grantedPermissionNames.push(treeNode.name);
            if (treeNode.children != null) {
                treeNode.children.map((child) => {
                    return grantedPermissionNames.push(child.name);
                });
            }
        } else {
            grantedPermissionNames = grantedPermissionNames.filter(
                (name) => name !== treeNode.name
            );
        }

        this.setState({
            selectedPermissions: grantedPermissionNames
        });
    };
    handleCheckPermissionAll = async (e: ChangeEvent<HTMLInputElement>) => {
        const { permissionTree, formRef } = this.props;
        const { checked } = e.target;
        this.setState({ checkedAll: checked });

        const value = checked ? permissionTree.map((x) => x.name) : [];
        await this.setState({
            selectedPermissions: value
        });
    };

    render(): ReactNode {
        const { visible, onCancel, modalType, onOk, permissionTree, formRef } = this.props;
        const { filteredPermissions, checkedAll } = this.state;
        const initialValues = {
            description: formRef.description,
            displayName: formRef.displayName,
            name: formRef.name,
            grantedPermissionNames: formRef.grantedPermissionNames,
            id: formRef.id
        };

        const renderTree = (nodes: PermissionTree) => (
            <TreeItem
                key={nodes.name}
                nodeId={nodes.name}
                label={
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={this.state.selectedPermissions.includes(nodes.name)}
                                onChange={(e) => this.handlePermissionCheckboxChange(e, nodes)}
                            />
                        }
                        label={nodes.displayName}
                    />
                }>
                {Array.isArray(nodes.children)
                    ? nodes.children.map((node) => renderTree(node))
                    : null}
            </TreeItem>
        );

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
                    <Formik
                        initialValues={initialValues}
                        onSubmit={(e) => {
                            console.log(e);
                        }}>
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
                                                    label="RoleDetails"
                                                    value="1"
                                                    sx={{
                                                        textTransform: 'unset!important',
                                                        padding: '0'
                                                    }}
                                                />
                                                <Tab
                                                    label="RolePermission"
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
                                                    RoleName
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
                                                    DisplayName
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
                                                <label htmlFor="description">Description</label>
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
                                            <Box display="flex">
                                                <TextField size="small" fullWidth />
                                                <Button
                                                    sx={{
                                                        minWidth: 'unset',
                                                        borderColor: '#666466!important'
                                                    }}
                                                    size="small"
                                                    variant="outlined">
                                                    <SearchIcon sx={{ color: '#666466' }} />
                                                </Button>
                                            </Box>
                                            <Box display="flex" gap="16px">
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            name="checkAll"
                                                            checked={checkedAll}
                                                            onChange={this.handleCheckPermissionAll}
                                                        />
                                                    }
                                                    label="Check All"
                                                />
                                            </Box>
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
                                                    defaultCollapseIcon={<ExpandMoreIcon />}
                                                    defaultExpandIcon={<ChevronRightIcon />}
                                                    multiSelect
                                                    sx={{
                                                        height: 240,
                                                        flexGrow: 1,
                                                        maxWidth: 400,
                                                        overflowY: 'auto'
                                                    }}>
                                                    {permissionTree.map((permissions) => {
                                                        return renderTree(permissions);
                                                    })}
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
