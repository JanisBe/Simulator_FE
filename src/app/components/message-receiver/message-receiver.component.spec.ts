import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MessageReceiverComponent } from './message-receiver.component';
import { provideHttpClient } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('MessageReceiverComponent', () => {
  let component: MessageReceiverComponent;
  let fixture: ComponentFixture<MessageReceiverComponent>;
  //let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
      imports: [MessageReceiverComponent, ToastrModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(MessageReceiverComponent);
    component = fixture.componentInstance;
    //httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
