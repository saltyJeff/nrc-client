import * as React from 'react'
import { observer } from 'mobx-react'
import State from './AppState'
import Waypoint from 'react-waypoint'
import GroupButton from './GroupButton'

@observer
export default class GroupList extends React.Component<{}, {}> {
    newName = React.createRef<HTMLInputElement>()
    scrollWrapper = React.createRef<HTMLDivElement>()
    lastLoaded = 0
    currentlyLoading = 0
    open = true
    constructor(props) {
        super(props)
    }
    render () {
        return (
            <div style={wrapper}>
                <h1>Groups</h1>
                <div>
                    <input 
                        placeholder="Group Name"
                        ref={this.newName}
                    />
                    <button
                        onClick={this.makeGroup}>
                        Create Group
                    </button>
                </div>
                <div
                    ref={this.scrollWrapper}
                    style={scrollWrapper}
                    id="groupScroll"
                    >
                    {
                        State.groups.map((val, idx) => {
                            return (<GroupButton key={val.id} groupData={val} />)
                        })
                    }
                    <div style={waypoint}>
                        <Waypoint onEnter={this.loadMore} />
                    </div>
                </div>
            </div>
        )
    }
    makeGroup = () => {
        const name = this.newName.current.value || ''
        if(!name) {
            alert('group name is empty')
            return
        }
        State.nrc.createGroup(name)
        this.newName.current.value = ''
    }
    loadMore = () => {
        console.log('attempt load: groops');
        if(this.currentlyLoading == this.lastLoaded) {
            //last load was complete
            this.currentlyLoading++
            console.log('sending req for '+this.currentlyLoading)
            State.nrc.getGroups(this.currentlyLoading)
                .then(({page, count, groups}) => {
                    const oldHeight = this.scrollWrapper.current.scrollHeight
                    State.groups = State.groups.concat(groups)
                    if(page == 0) {
                        State.scrollMsgToBot()
                    }
                    else {
                        const newHeight = this.scrollWrapper.current.scrollHeight
                        this.goToPrevScroll(oldHeight)
                    }
                    this.lastLoaded = groups.length < count ? -1 : page //if done, set lastLoaded to -1 to stop further loads
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
    toggleOpen = () => {
        wrapper.width = this.open ? 300 : 100
        this.open = !this.open
    }
}

const wrapper: React.CSSProperties = {
    width: 300,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch'
}
const scrollWrapper: React.CSSProperties = {
    flex: 1,
    overflow: 'scroll'
}
const waypoint: React.CSSProperties = {
    width: '100%',
    height: 30,
    backgroundColor: 'purple',
}