import * as React from 'react'
import State from './AppState'
import { observer } from 'mobx-react'
import GroupList from './GroupList';
import Posts from './Posts';
import Messages from './Messages';

@observer
export default class App extends React.Component<{}, {}> {
	constructor(props) {
		super(props)
	}
	render () {
		return (
			<div>
				{!State.nrc ? <p>Awaiting login</p> :
				<div style={wrapper}>
					{!!State.currentGroup && <h1>{State.currentGroup.name+"\t("+State.currentGroup.id+")"}</h1>}
					<div style={contentWrapper}>
						<GroupList />
						<Posts />
						<Messages />
					</div>
				</div>}
			</div>
		)
	}
}
const wrapper: React.CSSProperties = {
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'top',
	width: '100vw',
	height: '100vh'
}
const contentWrapper: React.CSSProperties = {
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'top',
	width: '100vw',
	flex: 1
}
