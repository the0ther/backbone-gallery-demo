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

  window.Img = Backbone.Model.extend();

  window.ImageList = Backbone.Collection.extend({
    model: Img,
    url: '/images/'
  });

  window.ImageView = Backbone.View.extend({

    initialize: function (options) {
      this.$el = $('.hero-image');
      this.model = options.model;
    },

    template: _.template('<img src="<%= path %>">'),

    render: function () {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    }
  });

  window.ImageStripView = Backbone.View.extend({
    template: _.template('<% _.each(images, function(img) { %> <li><img src="<%= img.attributes.thumbPath %>"></li> <% }); %>'),

    el: 'ul',

    initialize: function (options) {
      console.log(options.models);
      //console.log(options.models.toJSON());
      this.$el = $('.image-list');
      this.model = options.models;
    },

    render: function () {
      this.$el.html(this.template({'images': this.model}));
      return this;
    }
  });

  window.GalleryApp = Backbone.View.extend({
    el: $('#gallery'),

    initialize: function () {
      var imgs = [];
      imgs.push(new Img({'path': '/images/image1.png', 'thumbPath': '/images/thumbnails/image1_t.png'}));
      imgs.push(new Img({'path': '/images/image2.png', 'thumbPath': '/images/thumbnails/image2_t.png'}));
      imgs.push(new Img({'path': '/images/image3.png', 'thumbPath': '/images/thumbnails/image3_t.png'}));

      this.images = new ImageList(imgs);

      var img = new ImageView({ model: imgs[0] });
      this.$el.append(img.render().el);
      // img = new ImageView({ model: imgs[1] });
      // this.$el.append(img.render().el);
      // img = new ImageView({ model: imgs[2] });
      // this.$el.append(img.render().el);

      var listView = new ImageStripView(this.images);
      $('.image-list').append(listView.render().el);


      this.current = 0;

      this.render();
    },
    render: function () {

      return this;
    }
  });

  Backbone.history.start({
    silent: false
  });

  var gallery = new GalleryApp();
});
