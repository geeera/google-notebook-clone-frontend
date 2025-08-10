import {Component, Input} from '@angular/core';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatProgressSpinner} from '@angular/material/progress-spinner'
import {MatProgressBar} from '@angular/material/progress-bar';
import {UpperCasePipe} from '@angular/common';
import {NBFile} from '../../../core/services/file/file.service';

@Component({
  selector: 'nb-file-loader',
  imports: [
    MatCard,
    MatCardContent,
    MatProgressSpinner,
    MatProgressBar,
    UpperCasePipe,
  ],
  templateUrl: './file-loader.component.html',
  styleUrl: './file-loader.component.scss'
})
export class FileLoaderComponent {
  @Input({ required: true }) fileType!: NBFile['fileType'];
  @Input({ required: true }) progress!: number;
}
