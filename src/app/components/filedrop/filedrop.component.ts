import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { DragAndDropDirective } from './drag-and-drop.directive';

@Component({
  selector: 'app-filedrop',
  imports: [DragAndDropDirective],
  templateUrl: './filedrop.component.html',
  styleUrl: './filedrop.component.scss',
})
export class FiledropComponent {
  @ViewChild('fileDropRef', { static: false }) fileDropEl!: ElementRef;
  files: unknown[] = [];
  @Output() fileSubmitEvent = new EventEmitter<string>();
  message = '';
  isDragOver = false;
  // eslint-disable-next-line
  async onFileDropped($event: any) {
    this.prepareFilesList($event);
    const res = await Promise.resolve(this.getAsText($event[0]));
    this.message = res.result as string;
    this.fileSubmitEvent.emit(this.message);
  }

  async fileBrowseHandler(event: Event) {
    const input = event?.target as HTMLInputElement;
    const files = input?.files ? input?.files[0] : null;

    if (!files) {
      return;
    }

    const res = await Promise.resolve(this.getAsText(files));
    this.prepareFilesList([files]);
    this.message = res.result as string;
    this.fileSubmitEvent.emit(this.message);
  }

  prepareFilesList(files: File[]) {
    for (const item of files) {
      this.files = [];
      this.files.push(item);
    }
    this.fileDropEl.nativeElement.value = '';
  }
  // eslint-disable-next-line
  getAsText(readFile: any) {
    const fr = new FileReader();
    return new Promise((resolve: (value: FileReader) => void, reject) => {
      fr.onload = () => resolve(fr);
      fr.onerror = err => reject(err);
      fr.readAsText(readFile, 'UTF-8');
    });
  }
  // eslint-disable-next-line
  loaded(evt: any) {
    return evt.target.result;
  }

  // eslint-disable-next-line
  textErrorHandler(evt: any) {
    if (evt.target.error.name == 'NotReadableError') {
      console.error('unable to read file');
    }
  }
}
