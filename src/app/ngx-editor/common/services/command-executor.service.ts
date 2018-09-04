import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import * as Utils from '../utils/ngx-editor.utils';

@Injectable()
export class CommandExecutorService {

  /** saves the selection from the editor when focussed out */
  savedSelection: any = undefined;

  /**
   *
   * @param _http HTTP Client for making http requests
   */
  constructor(private _http: HttpClient) { }

  /**
   * executes command from the toolbar
   *
   * @param command command to be executed
   */
  execute(command: string, value: string = null): void {

    if (!this.savedSelection && command !== 'enableObjectResizing') {
      throw new Error('Range out of Editor');
    }

    if (command === 'enableObjectResizing') {
      document.execCommand('enableObjectResizing', true, true);
      return;
    }

    if (command === 'blockquote') {
      document.execCommand('formatBlock', false, 'blockquote');
      return;
    }

    if (command === 'removeBlockquote') {
      document.execCommand('formatBlock', false, 'div');
      return;
    }

    document.execCommand(command, false, value);
    return;
  }

  executeWithRestore(command: string, value: string) {
    if (this.savedSelection) {
      const restored = Utils.restoreSelection(this.savedSelection);
      if (restored && this.checkSelection()) {
        this.execute(command, value);
      }

    } else {
      throw new Error('Range out of the editor');
    }
  }

  /**
   * inserts image in the editor
   *
   * @param imageURI url of the image to be inserted
   */
  insertImage(imageURI: string): void {
    if (this.savedSelection) {
      if (imageURI) {
        const restored = Utils.restoreSelection(this.savedSelection);
        if (restored) {
          const inserted = document.execCommand('insertImage', false, imageURI);
          if (!inserted) {
            throw new Error('Invalid URL');
          }
        }
      }
    } else {
      throw new Error('Range out of the editor');
    }
    return;
  }

  /**
   * inserts image in the editor
   *
   * @param videParams url of the image to be inserted
   */
  insertVideo(videParams: any): void {
    if (this.savedSelection) {
      if (videParams) {
        const restored = Utils.restoreSelection(this.savedSelection);
        if (restored) {
          if (this.isYoutubeLink(videParams.videoUrl)) {
            const youtubeURL = '<iframe width="' + videParams.width + '" height="' + videParams.height + '"'
              + 'src="' + videParams.videoUrl + '"></iframe>';
            this.insertHtml(youtubeURL);
          } else if (this.checkTagSupportInBrowser('video')) {

            if (this.isValidURL(videParams.videoUrl)) {
              const videoSrc = '<video width="' + videParams.width + '" height="' + videParams.height + '"'
                + ' controls="true"><source src="' + videParams.videoUrl + '"></video>';
              this.insertHtml(videoSrc);
            } else {
              throw new Error('Invalid video URL');
            }

          } else {
            throw new Error('Unable to insert video');
          }
        }
      }
    } else {
      throw new Error('Range out of the editor');
    }
    return;
  }

  /**
   * checks the input url is a valid youtube URL or not
   *
   * @param url Youtue URL
   */
  private isYoutubeLink(url: string): boolean {
    const ytRegExp = /^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/;
    return ytRegExp.test(url);
  }

  /**
   * check whether the string is a valid url or not
   * @param url url
   */
  private isValidURL(url: string) {
    const urlRegExp = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
    return urlRegExp.test(url);
  }

  /**
   * uploads image to the server
   *
   * @param file file that has to be uploaded
   * @param endPoint enpoint to which the image has to be uploaded
   */
  uploadImage(file: File, endPoint: string): any {

    if (!endPoint) {
      throw new Error('Image Endpoint isn`t provided or invalid');
    }

    const formData: FormData = new FormData();

    if (file) {

      formData.append('file', file);

      const req = new HttpRequest('POST', endPoint, formData, {
        reportProgress: true
      });

      return this._http.request(req);

    } else {
      throw new Error('Invalid Image');
    }
  }

  /**
   * inserts link in the editor
   *
   * @param params parameters that holds the information for the link
   */
  createLink(params: any): void {

    if (this.savedSelection) {
      /**
       * check whether the saved selection contains a range or plain selection
       */
      if (params.urlNewTab) {
        const newUrl = '<a href="' + params.urlLink + '" target="_blank">' + this.savedSelection + '</a>';

        if (document.getSelection().type !== 'Range') {
          const restored = Utils.restoreSelection(this.savedSelection);
          if (restored) {
            this.insertHtml(newUrl);
          }
        } else {
          throw new Error('Only new links can be inserted. You cannot edit URL`s');
        }
      } else {
        const restored = Utils.restoreSelection(this.savedSelection);
        if (restored) {
          document.execCommand('createLink', false, params.urlLink);
        }
      }
    } else {
      throw new Error('Range out of the editor');
    }

    return;
  }

  /** insert HTML */
  private insertHtml(html: string): void {

    this.pasteHtmlAtCaret(html, true);

    return;
  }

  // Cf : https://stackoverflow.com/questions/6690752/insert-html-at-caret-in-a-contenteditable-div
  private pasteHtmlAtCaret(html, selectPastedContent) {
    let sel, range;
    if (window.getSelection) {

      // IE9 and non-IE
      sel = window.getSelection();

      if (sel.getRangeAt && sel.rangeCount) {
        range = sel.getRangeAt(0);
        range.deleteContents();

        // Range.createContextualFragment() would be useful here but is
        // only relatively recently standardized and is not supported in
        // some browsers (IE9, for one)
        const el = document.createElement('div');
        el.innerHTML = html;
        const frag = document.createDocumentFragment();
        let node, lastNode;
        while ((node = el.firstChild)) {
          lastNode = frag.appendChild(node);
        }

        const firstNode = frag.firstChild;
        range.insertNode(frag);

        // Preserve the selection
        if (lastNode) {
          range = range.cloneRange();
          range.setStartAfter(lastNode);
          if (selectPastedContent) {
            range.setStartBefore(firstNode);
          } else {
            range.collapse(true);
          }
          sel.removeAllRanges();
          sel.addRange(range);
        }
      }
    } else if ((sel = document.getSelection()) && sel.type !== 'Control') {
      // IE < 9
      const originalRange = sel.createRange();

      originalRange.collapse(true);
      sel.createRange().pasteHTML(html);

      if (selectPastedContent) {
        range = sel.createRange();
        range.setEndPoint('StartToStart', originalRange);
        range.select();
      }
    } else {
      throw new Error('Unable to perform the operation');
    }
  }

  /** check any selection is made or not */
  private checkSelection(): any {

    const selectedText = this.savedSelection.toString();

    if (selectedText.length === 0) {
      throw new Error('No Selection Made');
    }

    return true;
  }

  /**
   * check tag is supported by browser or not
   *
   * @param tag HTML tag
   */
  private checkTagSupportInBrowser(tag: string): boolean {
    return !(document.createElement(tag) instanceof HTMLUnknownElement);
  }

}
