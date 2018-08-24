import * as React from 'react'
import { observer } from 'mobx-react'
import State from './AppState'
import InfiniteScroll from 'react-infinite-scroller'
import AdMsg from './AdMsgBlock'

@observer
export default class Messages extends React.Component<{}, {
    done: boolean
}> {
    msgArea = React.createRef<HTMLTextAreaElement>()
    constructor(props) {
        super(props)
        this.state = {
            done: false,
        }
    }
    render () {
        return (
            <div style={wrapper}>
                <h1>Messages</h1>
                <InfiniteScroll
                    pageStart={0}
                    loadMore={(idx) => {
                    State.nrc.getMessages(State.currentGroup.id, idx)
                        .then(({page, count, msgs}) => {
                            State.currentMsgs = State.currentMsgs.concat(msgs)
                            this.setState({
                                done: msgs.length < count
                            })
                        }) 
                    }}
                    loader={<div className="loader" key={0}>Loading ...</div>}
                    hasMore={!this.state.done}
                    useWindow={false}
                    initialLoad={false}
                    style={scrollWrapper}
                    isReverse={true}
                    id="msgScroll">
                    {
                        State.currentMsgs.slice(0).reverse().map((val, idx) => {
                            return (<AdMsg key={val.id} msg={val} />)
                        })
                    }
                </InfiniteScroll>
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
const sendWrapper: React.CSSProperties = {
    display: 'flex',
    height: '60pt',
    fontSize: '20pt',
    flexDirection: 'row'
}