export interface UserData {
    id: string
    name: string
}
export interface GroupData {
    id: number
    name: string
}
export interface AdMsg {
    group: number
    from: string,
    ad: string,
    sent: number,
    id: number
}
export interface Post {
    group: number
    from: string
    url: string
    sent: number
    id: number
}