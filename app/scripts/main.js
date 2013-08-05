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
    },

    update: function (model) {
      this.model = model;
      this.render();
    }
  });

  window.ImageStripView = Backbone.View.extend({
    template: _.template('<% _.each(images, function(img) { %> <li><img src="<%= img.attributes.thumbPath %>"></li> <% }); %>'),

    el: 'ul',

    // events: {
    //   'click img': 'jumpTo'
    // },

    initialize: function (options) {
      //console.log(options.models);
      this.current = 0;
      //this.imgs = options.models;
      this.$el = $('.image-list');
      this.models = options.models;
    },

    render: function () {
      this.$el.html(this.template({'images': this.models}));
      $('li:first', this.el).css('outline', 'solid 2px yellow');
      return this;
    },

    back: function () {
      this.current === 0 ? this.models.length - 1 : this.current--;
      $('li', this.el).css('outline', '');
      $('li', this.el).eq(this.current).css('outline', 'solid 2px yellow');
    },

    forward: function () {
      this.current === this.models.length - 1 ? 0 : this.current++;
      $('li', this.el).css('outline', '');
      $('li', this.el).eq(this.current).css('outline', 'solid 2px yellow');
    },

    jumpTo: function (index) {
      console.log('inside the strip jumpto()');
      this.current = index;
      $('li', this.el).css('outline', '');
      $('li', this.el).eq(this.current).css('outline', 'solid 2px yellow');
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

      this.imgs = [];
      this.imgs.push(new Img({'path': '/images/image1.png', 'thumbPath': '/images/thumbnails/image1_t.png'}));
      this.imgs.push(new Img({'path': '/images/image2.png', 'thumbPath': '/images/thumbnails/image2_t.png'}));
      this.imgs.push(new Img({'path': '/images/image3.png', 'thumbPath': '/images/thumbnails/image3_t.png'}));
      this.imgs.push(new Img({'path': '/images/image4.png', 'thumbPath': '/images/thumbnails/image4_t.png'}));
      this.imgs.push(new Img({'path': '/images/image5.png', 'thumbPath': '/images/thumbnails/image5_t.png'}));

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
      this.current === 0 ? this.imgs.length - 1 : this.current--;
      myRouter.navigate('images/' + (this.current+1));
      this.listView.back();
      this.imageView.update(this.imgs[this.current]); 
    },
    forward: function () {
      this.current === this.imgs.length - 1 ? 0 : this.current++;
      myRouter.navigate('images/' + (this.current+1));
      this.listView.forward();
      this.imageView.update(this.imgs[this.current]);
    },
    jumpTo: function (index) {
      // index is zero-based here
      this.current = index;
      if (index >= 0 && index < this.imgs.length) {
        this.listView.jumpTo(index);
        this.imageView.update(this.imgs[index]);
      }
    }
  });

  var gallery = new GalleryApp();

  window.MyRouter = Backbone.Router.extend({
    routes: {
      'images(/:id)': 'images'
    },

    images: function (id) {
      gallery.jumpTo(id-1);
    }
  });

  var myRouter = new MyRouter();

  Backbone.history.start({
    silent: false
  });
});
