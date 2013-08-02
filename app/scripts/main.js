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
  'underscore',
    'backbone'
], function (_, Backbone) {

  window.MyRouter = Backbone.Router.extend({
    routes: {
      'help': 'help',
      'images/:id': 'images'
    }
  });

  window.Image = Backbone.Model.extend({
    defaults: function() { 
      return {
        'filename': ''
      };
    },
    
    initialize: function (options) {
      //console.log("hello entering initialize for Image object", options);
    },

  });

  window.ImageList = Backbone.Collection.extend({
    model: Image,
    url: '/images/'
  });

  window.ImageView = Backbone.View.extend({

    initialize: function (options) {
      //console.log(options);
      this.model = options.model;
      // this.model.on('change', this.render, this);
      // this.model.on('destroy', this.remove, this);
    },

    //template: _.template($('<img src="#">').html()),

    tagName: 'img',

    render: function () {
      //console.log('rendering inside ImageView');
      //this.el = _.template('<img>', {"filename", "image1.png"});
      //this.el = $('<img>').html();
      // console.log('this.el: ', this.el);
      // console.log('this.model: ', this.model);
      // console.log('this.model: ', this.model.attributes.filename);
      this.$el.attr('src','/images/' + this.model.attributes.filename);
      //this.el = $('img').attr('src','/images/' + this.model.attributes.filename);
      return this;
    }
  });

  window.GalleryApp = Backbone.View.extend({
    el: $('#gallery'),

    initialize: function () {
      //console.log("entering GalleryApp.initialize()");
      this.images = new ImageList();
      this.images.add(new Image({'filename': 'image1.png'}));
      this.images.add(new Image({'filename': 'image2.png'}));
      this.images.add(new Image({'filename': 'image3.png'}));

      var img = new ImageView({model: this.images.at(0)});
      this.$el.append(img.render().el);
      img = new ImageView({model: this.images.at(1)});
      this.$el.append(img.render().el);
      img = new ImageView({model: this.images.at(2)});
      this.$el.append(img.render().el);

      this.render();
    },
    render: function () {
      //console.log('inside GalleryApp.render()', this.$el);
      //this.$el.html('<h1>This is a gallery</h1>');
      // for (var i = this.images.length - 1; i >= 0; i--) {
      //   console.log('hi', this.images.at(i));
      //   // create ImageView for each
      //   this.$el.append(new ImageView());
      // };
    }
  });

  Backbone.history.start({
    silent: false
  });

  var gallery = new GalleryApp();
});
