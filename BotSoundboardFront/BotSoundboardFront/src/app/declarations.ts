export interface Channel {
    name: string,
    id: string,
    members: Member[]
  }
  
  export interface Member {
    id: string,
    name: string
  }