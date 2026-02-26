import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appFileDragAndDrop]',
  standalone: true,
})
export class DragAndDropDirective {
  @Output() fileDropped = new EventEmitter<File[]>();
  @Output() dragOverState = new EventEmitter<boolean>();

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.dragOverState.emit(true);
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.dragOverState.emit(false);
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.dragOverState.emit(false);

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.fileDropped.emit(Array.from(files));
    }
  }
}
