import * as React from 'react'
import timeago from 'timeago.js'
import State from './AppState'
import { Post } from './nrc'
import AdaptiveCard from 'react-adaptivecards'

export default class PostBlock extends React.Component<{
    post: Post,
    key: number
}, {
    postContent: any
}> {
    timeSpan = React.createRef<HTMLSpanElement>()
    constructor(props) {
        super(props)
        this.state = {
            postContent: ''
        }
    }
    componentDidMount () {
        timeago().render(this.timeSpan.current)
        fetch(this.props.post.url)
            .then(x => x.text())
            .then(json => {
                this.setState({
                    postContent: JSON.parse(json)
                })
            })
    }
    render () {
        return (
            <div style={wrapper}>
                {
                       !this.state.postContent ? 
                       <p>Loading post contents...</p> :
                       <AdaptiveCard payload={this.state.postContent} />
                   }
               <p>  
                   <span>{this.props.post.from}</span>
                   &nbsp;-&nbsp;
                   <span ref={this.timeSpan} data-timeago={this.props.post.sent}></span>
                   {
                       this.props.post.from == State.userData.id &&
                       <button onClick={(e) => {
                            State.nrc.deleteMessage(this.props.post.group, this.props.post.id)
                       }}>X</button>
                   }
                </p> 
            </div>
        )
    }
}
const wrapper: React.CSSProperties = {
    width: '500px',
    minHeight: '200px'
}