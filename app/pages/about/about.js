import {Page} from 'ionic-angular';


@Page({
  template: require('./about.html')
})
export class AboutPage {
  constructor() {
    this.conferenceDate = '2047-05-17';
  }
}
