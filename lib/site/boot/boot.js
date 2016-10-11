import 'native-promise-only'
import timeago from 'democracyos-timeago'
import React from 'react'
import {render} from 'react-dom'
import {Router, Route, browserHistory, IndexRoute} from 'react-router'
import config from 'lib/config'
import Layout from 'lib/site/layout/component'
import TopicLayout from 'lib/site/topic-layout/component'
import HomeForum from 'lib/site/home-forum/component'
import HomeMultiForum from 'lib/site/home-multiforum/component'
import SignIn from 'lib/site/sign-in/component'
import SignUp from 'lib/site/sign-up/component'
import Resend from 'lib/site/resend/component'
import Forgot from 'lib/site/forgot/component'
import Reset from 'lib/site/reset/component'
import Help from 'lib/site/help/component'
import Notifications from 'lib/site/notifications/component'
import NotFound from 'lib/site/error-pages/not-found/component'
import NotAllowed from 'lib/site/error-pages/not-allowed/component'

import 'lib/analytics/analytics'
import 'lib/translations/translations'

/**
 * Enable client-side debug messages
 */

import 'lib/debug'

/**
 * Load currentUser
 */

import 'lib/user/user'

/**
 * Init `timeago` component with parameter locale
 */

import './timeago-fix'
timeago('.ago', {lang: config.locale, interval: 1000})

/*
 * Register routes aliases
 */

import 'lib/boot/routes'

/*
 * Compose react app
 */

render((
  <Router history={browserHistory} onUpdate={track}>
    <Route path='/' component={Layout}>
      {config.multiForum && <IndexRoute component={HomeMultiForum} />}

      <Route path='404' component={NotFound} />
      <Route path='401' component={NotAllowed} />

      <Route path='signin' component={SignIn} />

      <Route path='signup'>
        <IndexRoute component={SignUp} />
        <Route path='resend-validation-email' component={Resend} />
        <Route path='validate/:token' component={Resend} />
        <Route path=':reference' component={SignUp} />
      </Route>

      <Route path='forgot'>
        <IndexRoute component={Forgot} />
        <Route path=':token' component={Reset} />
      </Route>

      <Route path='help'>
        <IndexRoute component={Help} />
        <Route path=':article' component={Help} />
      </Route>

      <Route path='notifications' component={Notifications} />

      <Route path={config.multiForum ? ':forumName' : null}>
        <IndexRoute component={HomeForum} />
        <Route path='topic/:topicId' component={TopicLayout} />
        <Route path='admin/*' component={reload} />
      </Route>
    </Route>
  </Router>
), document.getElementById('root'))

function track () {
  window.analytics.page(window.location.pathname)
}

function reload () {
  window.location.reload(false)
  return null
}
