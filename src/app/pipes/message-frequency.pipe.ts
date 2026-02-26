import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'messageFrequency',
  standalone: true,
})
export class MessageFrequencyPipe implements PipeTransform {
  transform(value: number): string {
    if (value === 0) {
      return 'Single message'
    }
    return `${value} sec.`;
  }
}
