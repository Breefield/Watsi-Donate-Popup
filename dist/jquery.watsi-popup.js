// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, document, undefined ) {

  // Extend JS arrays so we can nicely get randoms
  Array.prototype.randomElement = function () {
    return this[Math.floor(Math.random() * this.length)]
  }

  // undefined is used here as the undefined global variable in ECMAScript 3 is
  // mutable (ie. it can be changed by someone else). undefined isn't really being
  // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
  // can no longer be modified.

  // window and document are passed through as local variable rather than global
  // as this (slightly) quickens the resolution process and can be more efficiently
  // minified (especially when both are regularly referenced in your plugin).

  // Create the defaults once
  var pluginName = "watsiDonatePopup",
    defaults = {
    propertyName: "value"
  };

  // The actual plugin constructor
  function Plugin ( el, options ) {
    this.el = el;
    this.$el = $(el);
    // jQuery has an extend method which merges the contents of two or
    // more objects, storing the result in the first object. The first object
    // is generally empty as we don't want to alter the default options for
    // future instances of the plugin
    this.options = $.extend( {}, defaults, options );
    this._defaults = defaults;
    this._name = pluginName;
    this.init();
  }

  Plugin.prototype = {
    init: function () {
      this.popup_align = this.$el.attr('watsi-align') || this.options['align'] || 'top';
      this.open_on_submit = this.$el.attr('watsi-submit-open') || this.options['submit_open'] || 'no';

      this.buildPopupElement();
      this.findOrInjectCSS();
      this.loadPatients();
      this.bindEvents();
    },

    bindEvents: function() {

      // Open for different input elements
      switch(this.$el.attr('type')) {
        case 'checkbox':
          this.$el.on('click', $.proxy(function(e) {
            e.stopPropagation();
          }, this));

          this.$el.on('change', $.proxy(function(e) {
            e.stopPropagation();
            this.positionPopup();
            console.log('OPEN');
            this.$popup.toggleClass('open', this.$el.prop('checked'));
          }, this));
          break;

        case 'button':
          this.$el.on('click', $.proxy(function(e) {
            e.stopPropagation();
            this.positionPopup();
            this.$popup.addClass('open');
          }, this));
          break;
      }

      // Close button
      this.$popup.find('.close').on('click', $.proxy(function() {
        this.$popup.removeClass('open');
      }, this));

      // Click outside
      $('html').on('click', $.proxy(function() {
        this.$popup.removeClass('open');
      }, this));

      // Prevent el from closing itself
      this.$popup.on('click', function(e) {
        e.stopPropagation();
      });

    }, 

    // Obviously this is not ideal, but it works
    // considering the popup is fairly simple right now.
    // TODO: Move this elsewhere
    buildPopupElement: function () {
      var template = 
        '<div class="watsi-popup" style="display: none">' +
          '<span class="css-tester"></span>' + 
          '<div class="info-bar section">' +
            '<a href="https://watsi.org/" target="_blank"><img src="img/watsi-small.png" width="55"/></a>' + 
            '<span class="close">&#10006;</span>' + 
          '</div>' + 
          '<div class="patient section cf">' + 
            '<h1 class="patient-title"></h1>' + 
            '<img class="patient-photo" src=""/>' + 
            '<p class="patient-summary"></p>' + 
            '<a class="patient-more-link" href="" target="_blank">Donate</a>' + 
          '</div>' + 
        '</div>';
      this.$popup = $(template).insertAfter(this.$el);
      this.$popup.parent().css('position', 'relative');

      this.$popup.addClass("align-" + (this.popup_align))
    },

    findOrInjectCSS: function() {
      // No CSS found, time to inject
      if(this.$popup.find('.css-tester').css('background') != 'red') {
        $css = $('<link href="https://s3.amazonaws.com/watsi-donate-popup/css/styles.css" media="all" rel="stylesheet" />').
          on('load', $.proxy(function() {
            this.$popup.css('display', 'block');
          }, this));

        $('body').append($css);
      } else {
        this.$popup.css('display', 'block');
      }
    },

    loadPatients: function() {
      // TODO: Do not use jsonp.jit.su
      $.ajax('https://watsi-api-proxy.herokuapp.com/?url=https://watsi.org/fund-treatments.json', {
        dataType: 'jsonp', // We have JSON, but cross domain :(
        success: $.proxy(function(patients) {
          this.current_profile = patients.profiles.randomElement();
          this.renderProfile(this.current_profile);
          this.positionPopup();
          this.$popup.addClass('loaded');
        }, this)
      });
    },

    renderProfile: function(profile) {
      this.$popup.find('.patient-title').text("Fund " + profile.name + "'s Treatment");
      this.$popup.find('.patient-photo').attr('src', profile.profile_url);
      this.$popup.find('.patient-summary').html(profile. promo_description.replace(/(\s)([^\s]+?)$/ig, '&nbsp;$2'));
      this.$popup.find('.patient-more-link').attr('href', profile.url + '?from=popup');

      this.$popup.find('.patient-more-link').on('click', $.proxy(function() { this.openWatsi() }, this));

      if(this.open_on_submit == true) {
        this.$el.parent('form').on('submit', $.proxy(function() { this.openWatsi() }, this));
      }

    },

    openWatsi: function() {
      var center = {x: ($(window).width() / 2) - (985 / 2), y: 150};
      var new_window = window.open(this.current_profile.url, '',
              'height=560,width=985,location=false,toolbar=false,menubar=false,screenX=' + center.x + ',screenY=' + center.y + ',left' + center.x + ',top' + center.y);
      if(window.focus) new_window.focus();

      this.$popup.removeClass('open');
    },

    positionPopup: function() {
      var pos = this.$el.position();
      var arrow_offset = 15;

      switch(this.popup_align) {
        case 'left':
          this.$popup.css({
            'top': pos.top + (this.$el.outerHeight() / 2) - (this.$popup.outerHeight() / 2),
            'left': pos.left - arrow_offset - this.$popup.outerWidth()
          });
          break;

        case 'right':
          this.$popup.css({
            'top': pos.top + (this.$el.outerHeight() / 2) - (this.$popup.outerHeight() / 2),
            'left': pos.left + this.$el.outerWidth() + arrow_offset
          });
          break;

        case 'bottom':
          this.$popup.css({
            'top': pos.top + this.$el.outerHeight() + arrow_offset,
            'left': pos.left + (this.$el.outerWidth() / 2) - (this.$popup.outerWidth() / 2)
          });
          break;

        case 'top':
          this.$popup.css({
            'top': pos.top - this.$popup.outerHeight() - arrow_offset,
            'left': pos.left + (this.$el.outerWidth() / 2) - (this.$popup.outerWidth() / 2)
          });
          break;
      }
    },
  };

  // A really lightweight plugin wrapper around the constructor,
  // preventing against multiple instantiations
  $.fn[ pluginName ] = function ( options ) {
    return this.each(function() {
      if ( !$.data( this, "plugin_" + pluginName ) ) {
        $.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
      }
    });
  };

  $("[watsi-popup]").watsiDonatePopup();

})( jQuery, window, document );
