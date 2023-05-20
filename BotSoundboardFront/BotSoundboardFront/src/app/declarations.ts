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

export interface queueItem {
  name: string;
  id: string;
}

export interface Base64File {
  data: string;
  id: string;
  name: string;
}