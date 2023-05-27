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
  id: number;
  newName: string;
}

export interface queueItem {
  name: string;
  id: string;
}