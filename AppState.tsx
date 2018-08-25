import { observable, observe } from 'mobx'
import { Nrc, GroupData, UserData } from './nrc';
import frametalk from 'frametalk'
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
	msgWindow: Window
	postWindow: Window
	constructor () {
	}
	startNrc = async (token) => {
		console.log('acquired token')
		this.userData = await this.nrc.login('ws://localhost:8080/nrc', token)
		console.log('login success to server')

		document.querySelector<HTMLDivElement>('#login').style.display = 'none'
		document.querySelector<HTMLDivElement>('#app').style.display = 'block'
		ReactDOM.render(<Application />, document.querySelector<HTMLDivElement>('#app'))

		//open windows
		this.msgWindow = window.open('../Messages/')
		this.postWindow = window.open('../Posts')

		//broadcast userdata
		this.sendToAllWindows('userData', this.userData)

		observe(this, 'currentGroup', () => {
			console.log('group changed')
			this.sendToAllWindows('groupChange', this.currentGroup)
		})

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
			frametalk.send(this.msgWindow, 'msgReceive', adMsg)
		}
		this.nrc.onPostRecieve = (post) => {
			frametalk.send(this.postWindow, 'postReceive', post)
		}
		this.nrc.onError = (e) => {
			alert(
`either you're wrong or i'm wrong
${e.type}:
${e.reason}`)
		}
	}
	sendToAllWindows(evtName: string, data: any) {
		frametalk.send(this.msgWindow, evtName, data)
		frametalk.send(this.postWindow, evtName, data)
	}
}
let state = new AppState();

(window as any).state = state;
export default state;