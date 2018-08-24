
export class Nrc {
	ws: WebSocket

	//callbacks
	onAddedToGroup: (groupData: GroupData) => void = () => {}
	onMsgRecieve: (adMsg: AdMsg) => void = () => {} 
	onPostRecieve: (post: Post) => void = () => {}
	onGroupListRecieve: (page: number, count: number, groups: GroupData[]) => void = () => {}
	onError: (e: {
		type: string,
		reason: string
	}) => void = () => {}

	//resolves
	loginResolve
	groupInfoResolves: {
		[key: number]: any
	} = Object.create(null)
	groupPageResolves: {
		[key: number]: any
	} = Object.create(null)
	messagePageResolves: {
		[key: number]: any
	} = Object.create(null)
	postPageResolves: {
		[key: number]: any
	} = Object.create(null)

	login = (url: string, token: string): Promise<UserData> => {
		return new Promise((resolve, reject) => {
			try {
				this.ws = new WebSocket(`${url}?${token}`)
				this.ws.onmessage = this.handleMsg
				this.ws.onerror = reject
				this.loginResolve = resolve
			}
			catch(e) {
				reject(e)
			}
		})
	}
	sendRpc = (type: string, data: any) => {
		this.ws.send(JSON.stringify({
			type: type,
			data: data
		}))
	}
	createGroup = (groupName: string) => {
		this.sendRpc("CREATE_GROUP", {
			groupName: groupName
		})
	}
	getGroups = (page: number): Promise<{
		page: number, 
		count: number, 
		groups: GroupData[]
	}> => {
		return new Promise((resolve, reject) => {
			this.sendRpc("GET_GROUPS", {
				page: page
			})
			this.groupPageResolves[page] = resolve
		})
	   
	}
	getGroupInfo = (groupId: number): Promise<{
		groupData: GroupData,
		users: string[]
	}> => {
		return new Promise((resolve, reject) => {
			this.sendRpc("GET_GROUP_INFO", {
				groupId: groupId
			})
			this.groupInfoResolves[groupId] = resolve
		})
	}
	addUsers = (groupId: number, newUsers: string[]) => {
		this.sendRpc("ADD_USERS", {
			groupId: groupId,
			newUsers: newUsers
		})
	}
	leaveGroup = (groupId: number) => {
		this.sendRpc("LEAVE_GROUP", {
			groupId: groupId
		})
	}
	getMessages = (groupId: number, page: number): Promise<{
		page: number,
		count: number,
		msgs: AdMsg[]
	}> => {
		return new Promise((resolve, reject) => {
			this.sendRpc("GET_MESSAGES", {
				groupId: groupId,
				page: page
			})
			//2d array
			this.messagePageResolves[page] = resolve
		})
	}
	sendMessage = (to: number, ad: string) => {
		this.sendRpc("SEND_MESSAGE", {
			to: to,
			ad: ad
		})
	}
	deleteMessage = (groupId: number, msgId: number) => {
		this.sendRpc("DELETE_MESSAGE", {
			groupId: groupId,
			msgId: msgId
		})
	}
	getPosts = (groupId: number, page: number): Promise<{
		page: number,
		count: number,
		posts: Post[]
	}> => {
		return new Promise((resolve, reject) => {
			this.sendRpc("GET_POSTS", {
				groupId: groupId,
				page: page
			})
			this.postPageResolves[page] = resolve
		})
	}
	makePost = (to: number, url: string) => {
		this.sendRpc("MAKE_POST", {
			to: to,
			url: url
		})
	}
	deletePost = (groupId: number, postId: number) => {
		this.sendRpc("DELETE_POST", {
			groupId: groupId,
			postId: postId
		})
	}
	handleMsg = (msgStr: MessageEvent) => {
		const msg: RPCMsg = JSON.parse(msgStr.data)
		console.log('NEW MSG', msg)
		switch(msg.type) {
			case 'AUTHENTICATED':
				this.loginResolve(msg.data)
				break;
			case 'GROUP_INFO':
				this.groupInfoResolves[(msg.data.groupData as GroupData).id](msg.data)
				break;
			case 'GROUP_LIST':
				if(this.groupPageResolves[msg.data.page]) {
					this.groupPageResolves[msg.data.page](msg.data)
				}
				this.onGroupListRecieve(msg.data.page, msg.data.count, msg.data.groups)
				break;
			case 'ADDED_TO_GROUP':
				this.onAddedToGroup(msg.data)
				break;
			case 'MESSAGES_FOR_GROUP':
				this.messagePageResolves[msg.data.page](msg.data)
				break;
			case 'MSG_RECEIVED':
				this.onMsgRecieve(msg.data)
				break;
			case 'POSTS_FOR_GROUP':
				this.postPageResolves[msg.data.page](msg.data)
				break;
			case 'POST_RECEIVED':
				this.onPostRecieve(msg.data)
				break;
			case 'ERROR':
				this.onError(msg.data)
				break;
			default:
				console.error('UNRECOGNIZED: '+msg.type, msg)
		}
	}
}
interface RPCMsg {
	type: string;
	data: any;
}
import { UserData, GroupData, AdMsg, Post } from './models'
export { UserData, GroupData, AdMsg, Post }