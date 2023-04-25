import { Route, Routes as ReactRoutes } from 'react-router-dom';
import { appRouters } from './index';
import ProtectedRoute from './ProtectedRoute';
import Cookies from 'js-cookie';

const renderRoutes= () => {
  return (
    <ReactRoutes>
        {
          appRouters.mainRoutes.map(
            ({layout:Layout,routes},index)=>{
              return <Route element={<Layout/>} key={index}>
                <Route key={index}>
                {routes.map(({ component: Component, path, name ,children})=>{
                    if(children.length>0){
                      return (
                        <Route key={path}>
                          {
                            children.map((route,index)=>{
                              return (
                                <Route key={index} path={route.path} element={<route.component/>}></Route>
                              )
                            })
                          }
                        </Route>
                      )
                    }
                    return (
                      Component && path && (<Route key={name} element={<Component />} path={path} />)
                    )
                })}
                </Route>
              </Route>
            }
          )
        }
    </ReactRoutes>
  )
}

export default renderRoutes;
