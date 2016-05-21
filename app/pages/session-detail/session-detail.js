import {Page, NavParams} from 'ionic-angular';


@Page({
  template: require('./session-detail.html')
})
export class SessionDetailPage {
  static get parameters() {
    return [[NavParams]];
  }

  constructor(navParams) {
    this.navParams = navParams;
    this.session = navParams.data;
  }
}
