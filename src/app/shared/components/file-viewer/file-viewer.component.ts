import {Component, Input, OnInit} from '@angular/core';
import {NBFile} from '../../../core/services/file/file.service';
import {SafeUrlPipe} from '../../pipes/safe-url/safe-url.pipe';

@Component({
  selector: 'nb-file-viewer',
  imports: [
    SafeUrlPipe
  ],
  templateUrl: './file-viewer.component.html',
  styleUrl: './file-viewer.component.scss'
})
export class FileViewerComponent implements OnInit {
  @Input({ required: true }) file!: NBFile;

  ngOnInit() {
    console.log(this.file)
  }
}
