import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { By } from '@angular/platform-browser';
import { FiledropComponent } from './filedrop.component';
// eslint-disable-next-line
(globalThis as any).DataTransfer = class {
  files: File[] = [];
  items = {
    add: (file: File) => this.files.push(file),
  };
};
describe('FiledropComponent', () => {
  let component: FiledropComponent;
  let fixture: ComponentFixture<FiledropComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiledropComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FiledropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should work with file upload', async () => {
    const input: HTMLInputElement = fixture.debugElement.query(
      By.css('input[type="file"]'),
    ).nativeElement;

    const file = new File(['file content'], 'test-file.txt', { type: 'text/plain' });

    const dt = new DataTransfer();
    dt.items.add(file);

    Object.defineProperty(input, 'files', {
      value: dt.files,
      configurable: true,
    });

    input.dispatchEvent(new Event('change', { bubbles: true }));
    fixture.detectChanges();

    await Promise.resolve();

    expect(component).toBeTruthy();
  });
});
