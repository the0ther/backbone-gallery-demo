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
    defaults: function() { 
      return {
        'path': ''
      };
    }
  });

  window.ImageList = Backbone.Collection.extend({
    model: Img,
    url: '/images/'
  });

  window.ImageView = Backbone.View.extend({

    initialize: function (options) {
      this.model = options.model;
    },

    template: _.template('<img src="<%= path %>">'),

    render: function () {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    }
  });

  window.ImageStripView = Backbone.View.extend({

  });

  window.GalleryApp = Backbone.View.extend({
    el: $('#gallery'),

    initialize: function () {
      var imgs = [];
      imgs.push(new Img({'path': '/images/image1.png'}));
      imgs.push(new Img({'path': '/images/image2.png'}));
      imgs.push(new Img({'path': '/images/image3.png'}));

      this.images = new ImageList(imgs);

      var img = new ImageView({ model: imgs[0] });
      this.$el.append(img.render().el);
      img = new ImageView({ model: imgs[1] });
      this.$el.append(img.render().el);
      img = new ImageView({ model: imgs[2] });
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
      return this;
    }
  });

  Backbone.history.start({
    silent: false
  });

  var gallery = new GalleryApp();
});
