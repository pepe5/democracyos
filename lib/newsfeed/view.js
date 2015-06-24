import Card from './card';
import feeds from '../feeds';
import View from '../view/view';
import loading from 'loading-lock';
import template from './template.jade';
import { dom } from '../render/render';
import buttonTemplate from './forum-button.jade';
import forums from '../forums/forums';
import Log from 'debug';

const log = new Log('democracyos:newsfeed');

export default class Newsfeed extends View {
  constructor() {
    super(template);
    this.page = 0;
    this.loading = this.find('.loading-container');
    this.start = this.find('.newsfeed.start');
    this.fill();
    this.createButton();
  }

  switchOn() {
    this.bind('click', '.load-more', this.bound('fill'));
  }

  fill() {
    this.loading.removeClass('hide');
    var locker = loading(this.loading[0], {});
    locker.lock();

    feeds.fetch(null, this.page);

    feeds.once('fetch', (items) => {
      locker.unlock();
      this.page++;

      var last = items.length && items[items.length - 1].id;

      if (this.lastFeed === last) {
        items = [];
      }

      this.insert(items, last);
    });
  }

  insert(items, last) {
    items.forEach((feed) => {
      this.loading.addClass('hide');
      var card = new Card(feed);
      card.appendTo('.feeds');
    });

    if (items.length) {
      this.lastFeed = last;
      this.find('.load-more').removeClass('hide');
    } else {
      this.find('.load-more').addClass('hide');
      this.find('.loading-container').remove();
      this.find('.nothing').removeClass('hide');
    }
  }

  createButton() {
    const render = forum => {
      const button = dom(buttonTemplate, { forum: forum });
      this.start.append(button);
    };

    forums.getUserForum()
      .then(render)
      .catch(err => {
        if (404 === err.status) return render();
        log('Found error %s', err);
      });
  }
}