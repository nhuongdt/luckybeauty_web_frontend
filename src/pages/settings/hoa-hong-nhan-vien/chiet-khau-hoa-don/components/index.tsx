import { observer } from 'mobx-react';
import { Component, ReactNode } from 'react';

class ChietKhauHoaDonScreen extends Component {
    render(): ReactNode {
        return (
            <div>
                <p>Chiết khấu hóa đơn</p>
            </div>
        );
    }
}
export default observer(ChietKhauHoaDonScreen);
