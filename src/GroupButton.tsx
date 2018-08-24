import * as React from 'react'
import { observer } from 'mobx-react'
import { GroupData } from './nrc'
import State from './AppState'

@observer
export default class GroupButton extends React.Component<{
    groupData: GroupData,
    key: number
}, {}> {
    constructor(props) {
        super(props)
    }
    render () {
        return (
            <button 
                onClick={() => {
                    State.currentGroup = this.props.groupData
                }}
                style={button}
            >
                {this.props.groupData.name}
            </button>
        )
    }
}
const button: React.CSSProperties = {
    width: '100%',
    fontSize: '20pt',
    height: '25pt'
}