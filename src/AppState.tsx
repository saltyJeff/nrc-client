import { observable, observe } from 'mobx'
import { Nrc, GroupData, AdMsg, UserData, Post } from './nrc';
import * as React from 'react'
import * as ReactDOM from 'react-dom';
import Application from './App'

class AppState {
	@observable nrc: Nrc = new Nrc()
	@observable userData: UserData
	@observable groups: GroupData[] = observable.array([])
	@observable currentGroup: GroupData = {
		id: -1,
		name: 'bleh'
	}
	@observable currentGroupMembers: UserData[] = observable.array()
	@observable currentMsgs: AdMsg[] = observable.array([])
	@observable currentPosts: Post[] = observable.array([])

	constructor () {
	}
	startNrc = async (token) => {
		console.log('acquired token')
		this.userData = await this.nrc.login(window.prompt('Server URL', 'ws://localhost:8080/nrc'), token)
		console.log('login success to server')

		document.querySelector<HTMLDivElement>('#login').style.display = 'none'
		document.querySelector<HTMLDivElement>('#app').style.display = 'block'
		ReactDOM.render(<Application />, document.querySelector<HTMLDivElement>('#app'))

		//bind hooks
		this.nrc.onAddedToGroup = (groupData) => {
			this.groups.unshift(groupData)
		}
		this.nrc.onGroupListRecieve = (page, count, groups) => {
			this.groups = this.groups.concat(groups)

			if(this.currentGroup.id == -1 && this.groups.length > 0) {
				this.currentGroup = this.groups[0]
			}
		}
		this.nrc.onMsgRecieve = (adMsg) => {
			this.currentMsgs.unshift(adMsg)
			if(adMsg.from == this.userData.id) {
				this.scrollMsgToBot()
			}
		}
		this.nrc.onPostRecieve = (post) => {
			this.currentPosts.unshift(post)
		}
		this.nrc.onError = (e) => {
			alert(
`either you're wrong or i'm wrong
${e.type}:
${e.reason}`)
		}
	}
	scrollMsgToBot = () => {
		const objDiv = document.querySelector('#msgScroll')
		objDiv.scrollTop = objDiv.scrollHeight
	}
	scrollPostToTop = () => {
		const objDiv = document.querySelector('#postScroll')
		objDiv.scrollTop = 0
	}
}
let state = new AppState();

(window as any).state = state;
export default state;