/*global define */
define([], function () {
  'use strict';

  console.log('in app.js');
  // var MyRouter = Backbone.Router.extend({
  //     routes: {
  //       'help': 'help',
  //       'search/:query/:page': 'search',
  //       'articles/*path': 'articles'
  //     });
    var MyRouter = Backbone.Router.extend({
      routes: {
        'help': 'help',
        'images/:id': 'images'
      });
  });