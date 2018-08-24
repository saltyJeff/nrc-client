import * as React from 'react'
import AsciiDoctor from 'asciidoctor.js'
import {AdMsg} from './nrc'
import timeago from 'timeago.js'
import State from './AppState'

const doc = new AsciiDoctor()

export default class AdMsgBlock extends React.Component<{
    msg: AdMsg,
    key: number
}, {}> {
    timeSpan = React.createRef<HTMLSpanElement>()
    constructor(props) {
        super(props)
    }
    componentDidMount () {
        timeago().render(this.timeSpan.current)
    }
    render () {
        return (
            <div style={{
                ...wrapper,
                borderColor: this.fromSelf() ? 'black' : 'blue'
            }}>
               <div dangerouslySetInnerHTML={{__html: doc.convert(this.props.msg.ad)}}></div>
               <p>
                   <span>{this.props.msg.from}</span>
                   &nbsp;-&nbsp;
                   <span ref={this.timeSpan} data-timeago={this.props.msg.sent}></span>
                   {
                       this.fromSelf() &&
                       <button onClick={(e) => {
                            State.nrc.deleteMessage(this.props.msg.group, this.props.msg.id)
                       }}>X</button>
                   }
                </p> 
            </div>
        )
    }
    fromSelf = (): boolean => {
        return this.props.msg.from == State.userData.id
    }
}
const wrapper: React.CSSProperties = {
    borderWidth: 1,
    borderStyle: 'solid'
}