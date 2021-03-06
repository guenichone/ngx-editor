import { DatePipe } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxEditorToolbarComponent } from './ngx-editor-toolbar.component';
import { ngxEditorConfig } from '../common/ngx-editor.defaults';
import { BsDropdownModule, PopoverModule } from 'ngx-bootstrap';
import { CommandExecutorService } from '../common/services/command-executor.service';
import { MessageService } from '../common/services/message.service';
import { ColorPickerModule } from 'ngx-color-picker';

describe('NgxEditorToolbarComponent', () => {
  let component: NgxEditorToolbarComponent;
  let fixture: ComponentFixture<NgxEditorToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, ColorPickerModule, PopoverModule.forRoot(), BsDropdownModule.forRoot(), HttpClientModule],
      declarations: [NgxEditorToolbarComponent],
      providers: [CommandExecutorService, MessageService, DatePipe]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxEditorToolbarComponent);
    component = fixture.componentInstance;
    component.config = ngxEditorConfig;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
