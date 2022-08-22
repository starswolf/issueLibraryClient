import { SyncOutlined } from "@ant-design/icons";
import { PureComponent } from "react";

import './styles.scss'

class Curtain extends PureComponent {
    render() {
        const { visible } = this.props
        const cls = visible ? 'showCurtain' : 'hideCurtain'
        return (
            <div className={cls}>
                <SyncOutlined spin />
            </div>
        )
    }
}

export default Curtain