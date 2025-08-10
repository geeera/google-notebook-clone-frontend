import {Component, ElementRef, EventEmitter, inject, Input, Output, ViewChild} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import {MatCard, MatCardContent} from '@angular/material/card';
import {FormsModule} from '@angular/forms';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';
import {DragDropAndDirective} from '../../directives/drag-and-drop/drag-and-drop.directive';

@Component({
  selector: 'nb-file-uploader',
  imports: [
    MatCard,
    FormsModule,
    MatIcon,
    MatCardContent,
    MatIconButton,
    DragDropAndDirective,
  ],
  templateUrl: './file-uploader.component.html',
  styleUrl: './file-uploader.component.scss',
  standalone: true
})
export class FileUploaderComponent {
  @Input()
  private file: File | null = null;

  @Output() selected = new EventEmitter<File>()

  @ViewChild('fileUpload')
  private fileUpload!: ElementRef

  inputFileName?: string;

  // injectors
  private sanitizer = inject(DomSanitizer);


  onClick(event: Event) {
    if (this.fileUpload)
      this.fileUpload.nativeElement.click()
  }

  onFileSelected(event: any) {
    let file = event.dataTransfer ? event.dataTransfer.files[0] : event.target.files[0];
    if (this.validate(file)) {
      file.objectURL = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(file)));
      this.file = file;
      this.selected.emit(file);
    }
  }

  handleFileDrop(event: UIEvent) {
    if (event instanceof DragEvent && event?.dataTransfer?.files?.length) {
      const files = event.dataTransfer.files;
      this.fileUpload.nativeElement.files = files;
      this.selected.emit(files[0]);
    }
  }

  removeFile(event: Event, file: File) {
    this.file = null
    this.clearInputElement()
  }

  private validate(file: File) {
    const f = this.file;
    if (f?.name === file.name
      && f?.lastModified === file.lastModified
      && f?.size === f.size
      && f?.type === f.type
    ) {
      return false
    }
    return true
  }

  clearInputElement() {
    this.fileUpload.nativeElement.value = ''
  }
}
