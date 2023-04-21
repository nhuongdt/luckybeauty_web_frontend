import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Stack,
  Typography,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { Button, Input } from "antd";
import { useState} from "react";
import { json } from "stream/consumers";
const CreateOrEditCustomerDialog =({ modalVisible, onCloseDialog,IdKhachHang,createOrEditKhachHang,suggestNguonKhach,suggestNhomKhach,handleChange,handleSubmit}:any)=> {
  
    const [seletedGender,setSelectedGender] = useState(0)
    const {id,tenKhachHang,soDienThoai,diaChi,avatar,mota}=createOrEditKhachHang
    return (
      <Dialog
        open={modalVisible}
        keepMounted
        onClose={onCloseDialog}
        aria-describedby="alert-dialog-slide-description"
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          <div className="row">
              <div className="col-8" style={{float:'left'}}>{IdKhachHang!==''?"Cập nhật thông tin khách hàng ": "Thêm mới khách hàng"}</div>
              <div className="col-4" style={{float:'right'}}><CloseIcon style={{float:'right' , height:'24px'}} onClick={onCloseDialog}/></div>
          </div>
        </DialogTitle>
        <DialogContent>
          <form>
            <div className="row">
              <div className="col-8">
              <Typography variant="subtitle1" component="div">
              Thông tin chi tiết
              </Typography>
                <div className="form-group mt-3">
                  <label>Họ và tên</label>
                  <input type="text" className="form-control" name="tenKhachHang" value={tenKhachHang}  onChange={handleChange} style={{height:'48px'}}/>
                </div>
                <div className="row mt-3">
                  <div className="form-group col">
                    <label>Số điện thoại</label>
                    <input type="text" className="form-control" name="soDienThoai" value={soDienThoai} onChange={handleChange} style={{height:'48px'}}/>
                  </div>
                  <div className="form-group col">
                    <label>Địa chỉ</label>
                    <input type="text" className="form-control" value={diaChi} name="diaChi" onChange={handleChange} style={{height:'48px'}}/>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="form-group col">
                    <label>Ngày sinh</label>
                    <input type="date" className="form-control" name="ngaySinh" onChange={handleChange} style={{height:'48px'}}/>
                  </div>
                  <div className="form-group col">
                    <label>Giới tính</label>
                    <select  name="gioiTinh" value={seletedGender} className="form-control" style={{height:'48px'}} onChange={(e)=>setSelectedGender(Number.parseInt(e.target.value))}>
                        <option value={0}>Nam</option>
                        <option value={1}>Nữ</option>
                        <option value={2}>Khác</option>
                    </select>
                  </div>
                </div>
                <div className="row mt-3">
                    <div className="form-group col">
                        <label>Nhóm khách</label>
                        <select name="idNhomKhach" value={suggestNhomKhach[0]} className="form-control" onChange={handleChange}>
                            {suggestNhomKhach.map((item:any)=>{
                              return <option value={item.id}>{item.tenNhomKhach}</option>
                            })}
                        </select>
                    </div>
                    <div className="form-group col">
                        <label>Nguồn khách</label>
                        <select name="idNguonKhach" value={suggestNguonKhach[0]} className="form-control" onChange={handleChange}>
                        {suggestNguonKhach.map((item:any)=>{
                              return <option value={item.id}>{item.tenNguonKhach}</option>
                            })}
                        </select>
                    </div>
                </div>
                <div className="form-group mt-3">
                  <label>Ghi chú</label>
                  <input type="text" className="form-control" name="moTa" onChange={handleChange} value={mota} style={{height:'96px'}}/>
                </div>
              </div>
              <div className="col-4">
                
              </div>
            </div>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseDialog} className="btn btn-btn-outline-danger">
            Close
          </Button>
          <Button onClick={handleSubmit} className="btn btn-info">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    )
};
export default CreateOrEditCustomerDialog;
