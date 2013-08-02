/*global require*/
'use strict';

require.config({
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        },
        bootstrap: {
            deps: ['jquery'],
            exports: 'jquery'
        }
    },
    paths: {
        jquery: '../bower_components/jquery/jquery',
        backbone: '../bower_components/backbone/backbone',
        underscore: '../bower_components/underscore/underscore',
        bootstrap: 'vendor/bootstrap'
    }
});

require([
    'backbone'
], function (Backbone) {

  window.MyRouter = Backbone.Router.extend({
    routes: {
      'help': 'help',
      'images/:id': 'images'
    }
  });

  window.Image = Backbone.Model.extend({
    defaults: function() { return {
      'filename': ''
    };},
    initialize: function () {
      console.log("hello entering initialize for Image object");
    }
  });

  window.ImageList = Backbone.Collection.extend({
    model: Image,
    url: '/images/'
  });

  window.GalleryApp = Backbone.View.extend({
    images: new ImageList(),

    initialize: function () {
      console.log("entering GalleryApp.initialize()");
      var self = this,
        parentElt = $('#gallery');

      parentElt.template('/templates/app.html', {}, function () {
        self.setElement($('#todoapp'));

        self.input = self.$("#new-todo");

        // self.todos.on('add', self.addOne, self);
        // self.todos.on('reset', self.addAll, self);
        // self.todos.on('all', self.render, self);

        var imgs = self.images.fetch();
        console.log('imgs: ', imgs);
      });
    },
    render: function () {
      console.log('inside GalleryApp.render()');
    }
  });

  Backbone.history.start({
    silent: false
  });

  var gallery = new GalleryApp();
});
