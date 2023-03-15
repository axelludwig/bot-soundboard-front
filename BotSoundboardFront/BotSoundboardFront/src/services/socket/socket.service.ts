import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable, Subject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class SocketService {
	private _connect = new Subject<boolean>();
	connect$ = this._connect.asObservable();
	private _disconnect = new Subject<boolean>();
	disconnect$ = this._disconnect.asObservable();

	private _botChangeChannel = new Subject<string>();
	botChangeChannel$ = this._botChangeChannel.asObservable();
	private _userChangeChannel = new Subject<object>();
	userChangeChannel$ = this._userChangeChannel.asObservable();
	private _userDisconnectsChannel = new Subject<string>();
	userDisconnectsChannel$ = this._userDisconnectsChannel.asObservable();

	private _botDisconnect = new Subject<object>();
	botDisconnect$ = this._botDisconnect.asObservable();

	private _botChangeVolume = new Subject<number>();
	botChangeVolume$ = this._botChangeVolume.asObservable();
	private _botChangeMode = new Subject<string>();
	botChangeMode$ = this._botChangeMode.asObservable();

	constructor(private socket: Socket) {
		this.socket.on('connect', () => {
			this.onConnect();
		})

		this.socket.on('disconnect', () => {
			this.onDisconnect();
		})

		this.socket.on('botChangeChannel', (id: string) => {
			this.onBotChangeChannel(id);
		})

		this.socket.on('userChangeChannel', (res: any) => {
			this.onUserChangeChannel(res);
		})

		this.socket.on('userDisconnect', (res: string) => {
			this.onUserDisconnect(res);
		})

		this.socket.on('botDisconnect', (res: any) => {
			this.onBotDisconnect(res)
		})

		this.socket.on('botChangeVolume', (data: number) => {
			this.onBotChangeVolume(data);
		})

		this.socket.on('botChangeMode', (value: string) =>  {
			this.onBotChangeMode(value);
		})
	}

	// ඞ emitting ඞ \\

	test() {
		this.socket.emit('test');
	}

	onRestest() {
		return this.socket.fromEvent('restest');
	}

	onConnect(): void {
		this._connect.next(true);
	}

	onDisconnect(): void {
		this._disconnect.next(true);
	}

	joinChannel(id: string) {
		this.socket.emit("joinChannel", id);
	}

	leaveChannel() {
		this.socket.emit("leaveChannel");
	}

	playSound(sound: string) {
		this.socket.emit("playSound", sound);
	}

	setVolume(value: number) {
		this.socket.emit("setVolume", value);
	}

	setMode(value: boolean) {		
		this.socket.emit("setMode", value);
	}

	// ඞ listenin ඞ \\
	pauseSound(){
		this.socket.emit("pauseSound");
	}

	unpauseSound(){
		this.socket.emit("unpauseSound");
	}

	onBotChangeChannel(id: string) {
		this._botChangeChannel.next(id);
	}

	onUserChangeChannel(res: object) {
		this._userChangeChannel.next(res);
	}

	onUserDisconnect(id: string) {
		this._userDisconnectsChannel.next(id);
	}

	onBotDisconnect(res: object) {
		this._botDisconnect.next(res);
	}

	onBotChangeVolume(value: number) {
		this._botChangeVolume.next(value);
	}

	onBotChangeMode(value: string ) {
		this._botChangeMode.next(value);
	}
}