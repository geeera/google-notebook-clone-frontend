import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment.development';
import {BehaviorSubject, firstValueFrom, Observable, startWith, switchMap, tap} from 'rxjs';
import { io } from 'socket.io-client';

export enum Sender {
  USER,
  AI_BOT
}

export interface Message {
  _id: string;
  text: string;
  sender: Sender;
  pages: { page: number, label: string }[];
}

const socket = io(environment.apiUrl)

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private http = inject(HttpClient);
  private socket = socket;
  private messagesSub$: BehaviorSubject<Message[]> = new BehaviorSubject<Message[]>([]);

  readonly messages$: Observable<Message[]> = this.messagesSub$.asObservable();

  constructor() {
  }

  async joinChat(chatId: string) {
    this.socket.emit('join_chat', chatId);
    await firstValueFrom(this.loadMessages$(chatId));
  }

  sendMessage(chatId: string, text: string) {
    this.socket.emit('send_message', { chatId, text });
  }

  onNewMessage$(): Observable<Message> {
    return new Observable<Message>(observer => {
      this.socket.on('new_message', (msg: Message) => {
        observer.next(msg);
      });
      this.socket.on('error', (err) => {
        observer.error(err);
      });
      return () => {
        this.socket.off('new_message');
        this.socket.off('error');
      };
    });
  }

  loadMessages$(chatId: string): Observable<Message[]> {
    return this.http.get<Message[]>(`${environment.apiUrl}/chat/${chatId}/messages`).pipe(
      tap((messages: Message[]) => {
        this.messagesSub$.next(messages);
      })
    );
  }

  loadMessagesWithRealtimeData$(): Observable<Message[]> {
    return this.onNewMessage$().pipe(
      startWith(null),
      switchMap((message: Message | null) => {
        if (message) {
          this.messagesSub$.next([...this.messagesSub$.getValue(), message]);
        }
        return this.messages$
      })
    )
  }
}
