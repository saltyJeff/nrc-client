import * as React from 'react'
import { observer } from 'mobx-react'
import State from './AppState'
import InfiniteScroll from 'react-infinite-scroller'
import PostBlock from './PostBlock'

@observer
export default class Posts extends React.Component<{}, {
    done: boolean
}> {
    postUrl = React.createRef<HTMLInputElement>()
    constructor(props) {
        super(props)
        this.state = {
            done: false,
        }
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
                <InfiniteScroll
                    id="postScroll"
                    pageStart={0}
                    loadMore={(idx) => {
                    State.nrc.getPosts(State.currentGroup.id, idx)
                        .then(({page, count, posts}) => {
                            State.currentPosts = State.currentPosts.concat(posts)
                            this.setState({
                                done: posts.length < count
                            })
                        }) 
                    }}
                    loader={<div className="loader" key={0}>Loading ...</div>}
                    hasMore={!this.state.done}
                    useWindow={false}
                    initialLoad={false}
                    style={scrollWrapper}
                    isReverse={false}>
                    {
                        State.currentPosts.map((val, idx) => {
                            return (<PostBlock key={val.id} post={val} />)
                        })
                    }
                </InfiniteScroll>
            </div>
        )
    }
    makePost = () => {
        State.nrc.makePost(State.currentGroup.id, this.postUrl.current.value)
        this.postUrl.current.value = ''
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
    justifyContent: 'space-between'
}
const makePostWrapper: React.CSSProperties = {
    display: 'flex',
    fontSize: '20pt',
    flexDirection: 'row'
}