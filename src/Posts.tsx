import * as React from 'react'
import { observer } from 'mobx-react'
import { observe, observable } from 'mobx'
import State from './AppState'
import Waypoint from 'react-waypoint'
import PostBlock from './PostBlock'

@observer
export default class Posts extends React.Component<{}, {}> {
    postUrl = React.createRef<HTMLInputElement>()
    scrollWrapper = React.createRef<HTMLDivElement>()
    lastLoaded = -1
    currentlyLoading = -2
    constructor(props) {
        super(props)
    }
    componentDidMount () {
        observe(State, 'currentGroup', () => {
            State.currentPosts = observable.array([])
            this.lastLoaded = -1
            this.currentlyLoading = -1
        })
    }
    render () {
        return (
            <div style={wrapper}>
                <h1>Posts</h1>
                <div style={makePostWrapper}>
                    <input 
                        ref={this.postUrl}
                        type='url'
                        style={{flex: 1}}
                        onKeyUp={(e) => {
                            if(e.keyCode == 13) {
                                this.makePost()
                            }
                        }} />
                    <button 
                        onClick={this.makePost}
                        style={{
                            width: '90px'
                        }}>
                        Post
                    </button>
                </div>
                <div
                    ref={this.scrollWrapper}
                    style={scrollWrapper}
                    id="postScroll"
                    >
                    {
                        State.currentPosts.map((val, idx) => {
                            return (<PostBlock key={val.id} post={val} />)
                        })
                    }
                    <div style={waypoint}>
                        <Waypoint onEnter={this.loadMore} />
                    </div>
                </div>
            </div>
        )
    }
    makePost = () => {
        State.nrc.makePost(State.currentGroup.id, this.postUrl.current.value)
        this.postUrl.current.value = ''
    }
    loadMore = () => {
        console.log('attempt load: groops');
        if(this.currentlyLoading == this.lastLoaded) {
            //last load was complete
            this.currentlyLoading++
            console.log('sending req for '+this.currentlyLoading)
            State.nrc.getPosts(State.currentGroup.id, this.currentlyLoading)
                .then(({page, count, posts}) => {
                    const oldHeight = this.scrollWrapper.current.scrollHeight
                    State.currentPosts = State.currentPosts.concat(posts)
                    if(page == 0) {
                        State.scrollPostToTop()
                    }
                    else {
                        this.goToPrevScroll(oldHeight)
                    }
                    this.lastLoaded = posts.length < count ? -1 : page //if done, set lastLoaded to -1 to stop further loads
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
    wordBreak: 'break-all',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap'
}
const makePostWrapper: React.CSSProperties = {
    display: 'flex',
    fontSize: '20pt',
    flexDirection: 'row'
}
const waypoint: React.CSSProperties = {
    width: '100%',
    height: 30,
    backgroundColor: 'purple',
}