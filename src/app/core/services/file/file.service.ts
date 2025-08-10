import {inject, Injectable} from '@angular/core';
import {
  catchError,
  distinctUntilChanged,
  map,
  Observable,
  throwError
} from 'rxjs';
import {HttpClient, HttpEvent, HttpEventType, HttpRequest} from '@angular/common/http';
import {environment} from '../../../../environments/environment.development';

export interface NBFile extends File {
  url: string,
  fileType: string
}

interface UploadPDRResponse {
  chatId: string
  createdAt: string
  fileId: string
  filePersistDirPath: string
  updatedAt: string
  __v: number
  _id: string
}

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private http = inject(HttpClient);

  constructor() { }

  loadFileByChatId(chatId: string): Observable<{ progress: number, file?: any }> {
    if (!chatId) {
      throw new Error('chatId is required');
    }
    const req = new HttpRequest(
      'GET',
      `${environment.apiUrl}/chat/${chatId}/file`,
      null,
      {
        reportProgress: true,
        responseType: 'arraybuffer',
      }
    );

    return this.http.request(req).pipe(
      distinctUntilChanged(),
      map((event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.DownloadProgress:
            const progress = Math.round((100 * event.loaded) / (event.total || 1));
            return {
              progress,
            }
          case HttpEventType.Response:
            const file = new Blob([event.body], { type: 'application/pdf' });
            const fileURL = URL.createObjectURL(file);
            return { progress: 100, file: {
                fileType: 'PDF',
                url: fileURL
              } }
          default:
            return { progress: 0 };
        }
      }),
      catchError((err) => {
        console.error('Error loading file:', err);
        return throwError(() => err);
      })
    );
  }

  uploadPDF(file: File) {
    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post<UploadPDRResponse>(`${environment.apiUrl}/chat/upload`, formData, { reportProgress: true, observe: 'events' }).pipe(
      map((event) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            const percent = Math.round((100 * event.loaded) / (event.total ?? event.loaded));
            return { progress: percent };
          case HttpEventType.Response:
            return { progress: 100, data: event.body };
          default:
            return {progress: 0 };
        }
      })
    )
  }
}
