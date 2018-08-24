import * as React from 'react'
import { observer } from 'mobx-react'
import State from './AppState'
import GroupButton from './GroupButton'
import InfiniteScroll from 'react-infinite-scroller'

@observer
export default class GroupList extends React.Component<{}, {
    done: boolean
}> {
    newName = React.createRef<HTMLInputElement>()
    constructor(props) {
        super(props)
        this.state = {
            done: false,
        }
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
                <div style={scrollWrapper}>
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={(idx) => {
                        State.nrc.getGroups(idx)
                            .then(({page, count, groups}) => {
                                State.groups = State.groups.concat(groups)
                                this.setState({
                                    done: groups.length < count
                                })
                            }) 
                        }}
                        loader={<div className="loader" key={0}>Loading ...</div>}
                        hasMore={!this.state.done}
                        useWindow={false}
                        initialLoad={false}
                    >
                    {
                        State.groups.map((val, idx) => {
                            return (<GroupButton key={idx} groupData={val} />)
                        })
                    }
                    </InfiniteScroll>
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