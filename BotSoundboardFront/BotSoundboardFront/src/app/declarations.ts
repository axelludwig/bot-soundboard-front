export interface Channel {
  name: string,
  id: string,
  members: Member[]
}

export interface Member {
  id: string,
  name: string
}

export interface soundRenamedSocketResponse {
oldName: string;
newName: string;
}