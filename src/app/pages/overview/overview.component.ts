import {Component, inject, signal} from '@angular/core';
import {FileUploaderComponent} from '../../shared/components/file-uploader/file-uploader.component';
import {Router} from '@angular/router';
import {FileService} from '../../core/services/file/file.service';
import {SnackbarService} from '../../core/services/snackbar/snackbar.service';
import {FileLoaderComponent} from '../../shared/components/file-loader/file-loader.component';

@Component({
  selector: 'nb-overview',
  imports: [
    FileUploaderComponent,
    FileLoaderComponent
  ],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss',
})
export class OverviewComponent {
  private router = inject(Router)
  private fileService = inject(FileService)
  private snackbarService = inject(SnackbarService);

  progress = signal(0);
  isUploading = signal(false);

  async onFileSelected(file: File) {
    if (file) {
      try {
        this.fileService.uploadPDF(file).subscribe((result) => {
          const isUploading = result.progress !== 100;
          this.isUploading.set(isUploading);
          this.progress.set(result.progress);
          if (!isUploading && result.data) {
            this.snackbarService.openSuccessSnack('File was uploaded successfully!');
            this.router.navigate(['/file-management', result.data.chatId]);
          }
        })
      } catch (e) {
        this.snackbarService.openErrorSnack('Something went wrong, please try again!');
        this.isUploading.set(false);
      }
    }
  }
}
