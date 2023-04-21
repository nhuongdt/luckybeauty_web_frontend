import { Content } from 'antd/es/layout/layout'
import { Layout } from 'antd'
import React ,{useEffect, useState}from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Header from '../Header'
import Footer from '../Footer'
import AppSiderMenu from '../SiderMenu'
import Cookies from 'js-cookie'
import LoginAlertDialog from '../AlertDialog/LoginAlert'
const isAuthenticated = (): boolean => {
  return (Cookies.get('isLogin') ==="true"&& Cookies.get("isLogin")!==null&& Cookies.get("isLogin")!==undefined)?false:true;
}
const MainAppLayout:React.FC = () => {
  
  const [collapsed, onCollapse] = useState(false);
  const toggle = () => {
    onCollapse(!collapsed);
  };
  const [open, setOpen] = React.useState(isAuthenticated);
  const navigate = useNavigate();
  useEffect(() => {
    setOpen(isAuthenticated)
    console.log(open)
  }, [true]);
  
  const confirm  = () => {
    setOpen(false);
    navigate("/login")
  };
    return (
      <><Layout style={{ minHeight: '100vh' }}>
        <AppSiderMenu collapsed={collapsed} toggle={toggle}/>
        <Layout>
          <Header collapsed={collapsed} toggle={toggle}/>
          <Content>
            <Outlet />
            <LoginAlertDialog open={open} confirmLogin={confirm}/>
          </Content>
          {/* <Footer/> */}
        </Layout>
      </Layout></>
      )
}

export default MainAppLayout