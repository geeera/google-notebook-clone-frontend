import {Component, inject, OnInit, signal} from '@angular/core';
import {FileLoaderComponent} from '../../shared/components/file-loader/file-loader.component';
import {FileService, NBFile} from '../../core/services/file/file.service';
import {AsyncPipe} from '@angular/common';
import {catchError, distinctUntilChanged, filter, map, Observable, switchMap} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import { SnackbarService } from '../../core/services/snackbar/snackbar.service';
import {PDFProgressData, PdfViewerModule} from 'ng2-pdf-viewer';
import {ChatComponent} from '../../shared/modules/chat/chat.component';

@Component({
  selector: 'nb-manager',
  imports: [
    FileLoaderComponent,
    AsyncPipe,
    PdfViewerModule,
    ChatComponent,
  ],
  templateUrl: './manager.component.html',
  styleUrl: './manager.component.scss'
})
export class ManagerComponent implements OnInit {
  private fileService = inject(FileService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackbar = inject(SnackbarService);
  file$!: Observable<NBFile | null>;

  isLoading = signal(true);
  progress = signal(0);
  pageIndex = signal(1);

  ngOnInit() {
    const chatId$ = this.route.params.pipe(
      map((params: any) => {
        if (!('chatId' in params)) {
          this.router.navigate(['/']);
        }
        this.isLoading.set(true);
        return params.chatId;
      }),
      filter(chatId => !!chatId),
      distinctUntilChanged()
    )
    this.file$ = chatId$.pipe(
      switchMap((chatId) => {
        return this.fileService.loadFileByChatId(chatId)
      }),
      distinctUntilChanged(),
      map(data => {
        this.progress.set(data.progress);
        if (data.progress === 100) {
          this.isLoading.set(false);
          return data?.file || null
        }
        return null;
      }),
      catchError((err, caught) => {
        this.isLoading.set(false);
        this.snackbar.openErrorSnack(err);
        return caught;
      })
    );
  }

  onPdfError(err: any) {
    console.error('Ошибка загрузки PDF:', err);
  }

  onPdfProgress(e: PDFProgressData) {
    console.log(e);
  }

  changeFilePagePosition(page: number) {
    this.pageIndex.set(page);
  }
}
