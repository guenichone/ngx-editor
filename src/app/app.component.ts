import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from './app.service';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [AppService]
})

export class AppComponent implements OnInit, OnDestroy {

  title = 'ngx-editor';
  latestRelease: any = [];
  private subscription: Subject<any> = new Subject();

  editorConfig = {
    editable: true,
    spellcheck: false,
    height: '10rem',
    minHeight: '5rem',
    // TODO Fixme under IE
    // placeholder: 'Type something. Test the Editor... ヽ(^。^)丿'
    placeholder: '',
    translate: 'no',
    fontNameList: ['Arial', 'Verdana'],
    toolbar: [
      ['bold', 'italic', 'underline'],
      ['fontName', 'fontSize', 'color'],
      ['unorderedList'],
      ['link', 'unlink']
    ]
  };

  htmlContent = '';

  /**
   * @param _appService service for app component
   */
  constructor(private _appService: AppService) { }

  getLatestRelease() {
    this.subscription = this._appService.getLatestRelease().subscribe(
      data => this.latestRelease = data[0],
      error => { console.log(error); },
      () => {
        console.log('latest release: ' + this.latestRelease['name']);
      });
  }

  ngOnInit() {
    this.getLatestRelease();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
