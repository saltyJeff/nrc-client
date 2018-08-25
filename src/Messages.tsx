import * as React from 'react'
import { observer } from 'mobx-react'
import State from './AppState'
import Waypoint from 'react-waypoint'
import AdMsg from './AdMsgBlock'
import { observe, observable } from 'mobx';

@observer
export default class Messages extends React.Component<{}, {
    init: boolean,
}> {
    msgArea = React.createRef<HTMLTextAreaElement>()
    scrollWrapper = React.createRef<HTMLDivElement>()
    lastLoaded = -1
    currentlyLoading = -2
    constructor(props) {
        super(props)
        this.state = {
            init: false,
        }
    }
    componentDidMount () {
        observe(State, 'currentGroup', () => {
            State.currentMsgs = observable.array([])
            this.lastLoaded = -1
            this.currentlyLoading = -1
        })
    }
    render () {
        return (
            <div style={wrapper}>
                <h1>Messages</h1>
                <div
                    ref={this.scrollWrapper}
                    style={scrollWrapper}
                    id="msgScroll"
                    >
                    <div style={waypoint}>
                        <Waypoint onEnter={this.loadMore} />
                    </div>
                    {
                        State.currentMsgs.slice(0).reverse().map((val, idx) => {
                            return (<AdMsg key={val.id} msg={val} />)
                        })
                    }
                </div>
                <div style={sendWrapper}>
                    <textarea 
                        ref={this.msgArea}
                        style={{flex: 1}}
                        onKeyUp={(e) => {
                            if(e.keyCode == 13 && !e.shiftKey) {
                                this.sendMsg()
                            }
                        }}>
                    </textarea>
                    <button 
                        onClick={this.sendMsg}
                        style={{
                            width: '70px'
                        }}>
                        Send
                    </button>
                </div>
            </div>
        )
    }
    sendMsg = () => {
        State.nrc.sendMessage(State.currentGroup.id, this.msgArea.current.value)
        this.msgArea.current.value = ''
    }
    loadMore = () => {
        console.log('attempt load');
        if(this.currentlyLoading == this.lastLoaded) {
            //last load was complete
            this.currentlyLoading++
            console.log('sending req for '+this.currentlyLoading)
            State.nrc.getMessages(State.currentGroup.id, this.currentlyLoading)
                .then(({page, count, msgs}) => {
                    const oldHeight = this.scrollWrapper.current.scrollHeight
                    State.currentMsgs = State.currentMsgs.concat(msgs)
                    if(page == 0) {
                        State.scrollMsgToBot()
                    }
                    else {
                        const newHeight = this.scrollWrapper.current.scrollHeight
                        console.log('added '+(newHeight-oldHeight)+" height")
                        this.goToPrevScroll(oldHeight)
                    }
                    this.lastLoaded = msgs.length < count ? -1 : page //if done, set lastLoaded to -1 to stop further loads
                })
        }
    }
    goToPrevScroll = (oldScrollHeight) => {
        console.log('reverting to scroll '+oldScrollHeight)
        const list = this.scrollWrapper.current
        //disable scrollbar for a while so the user can't overwrite the scroll bouncing
        list.style.overflow = 'hidden'
        list.scrollTop = list.scrollHeight - oldScrollHeight
        list.style.overflowY = 'scroll'
    }
}

const wrapper: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    flex: 1,
}
const scrollWrapper: React.CSSProperties = {
    flex: 1,
    overflowY: 'scroll',
    overflowX: 'hidden',
    wordBreak: 'break-all'
}
const waypoint: React.CSSProperties = {
    width: '100%',
    height: 30,
    backgroundColor: 'purple',
}
const sendWrapper: React.CSSProperties = {
    display: 'flex',
    height: '60pt',
    fontSize: '20pt',
    flexDirection: 'row'
}