import debug from 'debug';
import page from 'page';
import forumStore from '../forum-store/forum-store';

const log = debug('democracyos:forum-middlewares');

/**
 * Load from ':forum' param, and set ctx.forum.
 */

export function getForum (ctx, next) {
  if (!ctx.params.forum) return next();

  forumStore.get(ctx.params.forum)
    .then(forum => {
      ctx.forum = forum;
      log(`setted ctx.forum with '${forum.name}'.`);
      next();
    })
    .catch(err => {
      if (404 === err.status) {
        log(`forum not found '${ctx.params.forum}'.`);
        return next();
      }
      log('Found error %s', err);
    });
}

/**
 * Load of logged in user, and set ctx.userForum.
 */

export function getUserForum (ctx, next) {
  forumStore.getUserForum()
    .then(userForum => {
      ctx.userForum = userForum;
      log(`setted ctx.userForum with '${userForum.name}'.`);
      next();
    })
    .catch(err => {
      if (404 === err.status) return next();
      log('Found error %s', err);
    });
}

/**
 * Dont let in users that already have a forum.
 */

export function restrictUserWithForum (ctx, next) {
  forumStore.getUserForum()
    .then(() => page('/'))
    .catch(err => {
      if (404 === err.status) return next();
      log('Found error %s', err);
    });
}