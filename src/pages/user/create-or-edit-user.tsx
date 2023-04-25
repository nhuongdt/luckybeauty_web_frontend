import { Grid, Stack } from "@mui/material";
import { Form, Input, Modal, Tabs, Upload, message } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import React, { useState } from "react";
import type { UploadChangeParam } from "antd/es/upload";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";

export interface ICreateOrEditUserProps {
  visible: boolean;
  onCancel: () => void;
  modalType: string;
  onOk: () => void;
}
const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
const CreateOrEditUser = ({
  visible,
  onCancel,
  modalType,
  onOk,
}: ICreateOrEditUserProps) => {
  const [fileList, setFileList] = useState<UploadFile[]>([] as UploadFile[]);

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      title={modalType}
      okText="Ok"
      cancelText="Đóng"
      width={648}
      onOk={onOk}
    >
      <Form layout="vertical">
        <Tabs defaultActiveKey={"user"} size={"large"} tabBarGutter={64}>
          <TabPane tab="User detail" key={"user"}>
            <Grid container spacing={1}>
              <Grid item xs={3}>
                <Stack>
                  <Upload
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    listType="picture-card"
                    fileList={fileList}
                    maxCount={1}
                    onChange={handleChange}
                  >
                    {fileList.length===1?null:uploadButton}
                  </Upload>
                </Stack>
              </Grid>
              <Grid item xs={9}>
                <Form.Item>
                  <Input size="large" placeholder="chọn nhân sự có sẵn" />
                </Form.Item>
              </Grid>
            </Grid>
          </TabPane>
          <TabPane tab="Role" key={"role"}></TabPane>
        </Tabs>
      </Form>
    </Modal>
  );
};

export default CreateOrEditUser;
