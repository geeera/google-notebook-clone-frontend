import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef, EventEmitter,
  inject,
  OnInit, Output,
  signal,
  ViewChild,
} from '@angular/core';
import {NotificationComponent} from '../../components/notification/notification.component';
import {MessageComponent} from '../../components/message/message.component';
import {MatIcon} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import {ChatService, Message, Sender} from '../../../core/services/chat/chat.service';
import {combineLatest, distinctUntilChanged, filter, map, Observable, tap} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {AsyncPipe} from '@angular/common';
import {LocalstorageService, StorageKey} from '../../../core/services/localstorage/localstorage.service';

const mockMessages: Message[] = [
  {
    _id: '1',
    text: 'Hi, i\'m bot',
    sender: Sender.AI_BOT,
    pages: []
  },
  {
    _id: '2',
    text: 'Hi!',
    sender: Sender.USER,
    pages: []
  }
];

const exampleQuestions = [
  'What is the main topic of this document?',
  'Can you summarize the key points?',
  'What are the conclusions or recommendations?'
]

@Component({
  selector: 'nb-chat',
  imports: [
    NotificationComponent,
    MessageComponent,
    MatIcon,
    MatButtonModule,
    FormsModule,
    CdkTextareaAutosize,
    AsyncPipe,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatComponent implements OnInit, AfterViewInit {
  readonly exampleQuestions = exampleQuestions;
  textFieldValue: string = '';
  isNotificationVisible = signal(true);
  isScrollButtonVisible = signal(false);
  isBotThinking = signal(false);

  viewData$!: Observable<{
    messages: Message[];
    chatId: string;
  }>
  protected readonly Sender = Sender;

  private chatService = inject(ChatService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private lsService = inject(LocalstorageService)

  @ViewChild('messagesContainerRef') private messagesContainerRef!: ElementRef<HTMLDivElement>;

  @Output() navigateToPage = new EventEmitter<number>();

  ngOnInit() {
    const chatId$ = this.route.params.pipe(
      map((params: any) => {
        if (!('chatId' in params)) {
          this.router.navigate(['/']);
        }
        const chatId = params['chatId'];
        this.chatService.joinChat(chatId);

        const isNotificationVisible = this.lsService.getValueFromStorage(StorageKey.NOTIFIER_VISIBILITY, (collection) => {
          return collection[chatId]
        });
        if (typeof isNotificationVisible === 'boolean') {
          this.isNotificationVisible.set(isNotificationVisible);
        }

        return chatId;
      }),
      filter(chatId => !!chatId),
      distinctUntilChanged()
    )

    const messages$ = this.chatService.loadMessagesWithRealtimeData$().pipe(
      tap((messages) => {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage?.sender === Sender.AI_BOT) {
          this.isBotThinking.set(false);
        }
      })
    )

    this.viewData$ = combineLatest([chatId$, messages$]).pipe(
      map(([chatId, messages]) => {
        return {
          chatId: chatId,
          messages: messages,
        }
      }),
      tap(() => {
        this.scrollToBottom(true);
      })
    );
  }

  ngAfterViewInit() {
    this.scrollToBottom(true);
  }

  scrollToBottom(withDelay: boolean = false) {
    const delay = withDelay ? 500 : 0;
    setTimeout(() => {
      if (this.messagesContainerRef) {
        const container = this.messagesContainerRef.nativeElement;
        container.scrollTo({ behavior: 'smooth', top: container.scrollHeight });
      }
    }, delay)
  }

  async sendMessage(chatId: string, message: string) {
    if (!message) {
      return;
    }
    // const messageFromUser: Message = {
    //   text: message,
    //   sender: Sender.USER,
    // }

    this.chatService.sendMessage(chatId, message);
    this.textFieldValue = '';
    this.isBotThinking.set(true);
  }

  handleMessagesContainerScroll(e: Event) {
    const target = e.target as HTMLElement;
    const scrollTop = target.scrollTop;
    const scrollHeight = target.scrollHeight;
    const distanceFromBottom = scrollHeight - target.clientHeight - scrollTop;
    const maxComfortableDistance = scrollHeight * 0.2;

    const isShow = distanceFromBottom > maxComfortableDistance;
    this.isScrollButtonVisible.set(isShow);
  }

  breakLine(e: KeyboardEvent) {
    if (e.keyCode === 13 && e.ctrlKey) {
       (e.target as HTMLInputElement).value += "\n";
    }
  }

  onEnterKeyDown(e: Event, chatId: string, textFieldValue: string) {
    e.preventDefault();
    this.sendMessage(chatId, textFieldValue);
  }

  closeNotification(chatId: string) {
    this.isNotificationVisible.set(false);
    this.lsService.updateValueInStorage(StorageKey.NOTIFIER_VISIBILITY, (collection) => {
      collection[chatId] = false;
      return collection;
    });
  }

  handleNavigationToPage(page: number) {
    this.navigateToPage.emit(page);
  }
}
