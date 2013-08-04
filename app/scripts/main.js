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

  window.Img = Backbone.Model.extend({
    // initialize: function () {
    //   this.on('change:isCurrent', function () {

    //   })
    // }
  });

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

    events: {
      'click img': 'jumpTo'
    },

    initialize: function (options) {
      console.log(options.models);
      this.current = 0;
      this.numImages = options.models.length;
      this.$el = $('.image-list');
      this.model = options.models;
      // setup a highlight/outline
    },

    render: function () {
      this.$el.html(this.template({'images': this.model}));
      $('li:first', this.el).css('outline', 'solid 2px yellow');
      return this;
    },

    back: function () {
      this.current === 0 ? this.numImages - 1 : this.current--;
      $('li', this.el).css('outline', '');
      $('li', this.el).eq(this.current).css('outline', 'solid 2px yellow');
    },

    forward: function () {
      this.current === this.numImages - 1 ? 0 : this.current++;
      $('li', this.el).css('outline', '');
      $('li', this.el).eq(this.current).css('outline', 'solid 2px yellow');
    },

    jumpTo: function (evt) {
      var index = $(evt.target).parent().index();
      // HACK: fix this
      gallery.jumpTo(index);
    }
  });

  window.GalleryApp = Backbone.View.extend({
    el: $('#gallery'),

    events: {
      'click .arrow-left': 'back',
      'click .arrow-right': 'forward'
    },

    initialize: function () {
      this.current = 0;
      this.numImages = 3;
      this.imgs = [];
      this.imgs.push(new Img({'path': '/images/image1.png', 'thumbPath': '/images/thumbnails/image1_t.png'}));
      this.imgs.push(new Img({'path': '/images/image2.png', 'thumbPath': '/images/thumbnails/image2_t.png'}));
      this.imgs.push(new Img({'path': '/images/image3.png', 'thumbPath': '/images/thumbnails/image3_t.png'}));

      this.imageList = new ImageList(this.imgs);

      this.imageView = new ImageView({ model: this.imgs[this.current] });
      this.$el.append(this.imageView.render().el);

      this.listView = new ImageStripView(this.imageList);
      $('.image-list').append(this.listView.render().el);

      this.render();
    },
    render: function () {

      return this;
    },
    back: function () {
      console.log('in GalleryApp.back!!!');
      this.current === 0 ? this.numImages - 1 : this.current--;
      this.listView.back();
    },
    forward: function () {
      console.log('in GalleryApp.forward!!!');
      this.current === this.numImages - 1 ? 0 : this.current++;
      this.listView.forward();
    },
    jumpTo: function (index) {
      console.log('in GalleryApp.jumpTo()');
      this.current = index;
      //this.images.jumpTo(index);
    }
  });

  Backbone.history.start({
    silent: false
  });

  var gallery = new GalleryApp();
});
