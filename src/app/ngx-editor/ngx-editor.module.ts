import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule, PopoverModule } from 'ngx-bootstrap';
import { ColorPickerModule } from 'ngx-color-picker';
import { NgxEditorComponent } from './ngx-editor.component';
import { NgxGrippieComponent } from './ngx-grippie/ngx-grippie.component';
import { NgxEditorMessageComponent } from './ngx-editor-message/ngx-editor-message.component';
import { NgxEditorToolbarComponent } from './ngx-editor-toolbar/ngx-editor-toolbar.component';
import { MessageService } from './common/services/message.service';
import { CommandExecutorService } from './common/services/command-executor.service';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ColorPickerModule, PopoverModule.forRoot(), BsDropdownModule.forRoot()],
  declarations: [NgxEditorComponent, NgxGrippieComponent, NgxEditorMessageComponent, NgxEditorToolbarComponent],
  exports: [NgxEditorComponent, PopoverModule],
  providers: [CommandExecutorService, MessageService, DatePipe]
})

export class NgxEditorModule { }
