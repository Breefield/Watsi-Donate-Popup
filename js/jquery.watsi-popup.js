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

      this.buildPopupElement();
      this.loadPatients();

      this.$el.on('change', $.proxy(function() {
        this.positionPopup();
        this.$popup.toggleClass('open', this.$el.prop('checked'));
      }, this));
    },

    // Obviously this is not ideal, but it works
    // considering the popup is fairly simple right now.
    // TODO: Move this elsewhere
    buildPopupElement: function () {
      var template = 
        '<div class="watsi-popup">' + 
          '<div class="info-bar section">' +
            '<a href="https://watsi.org/" target="_blank"><img src="img/watsi-small.png" width="55"/></a>' + 
            '<a class="more" href="https://watsi.org/" target="_blank">what is watsi?</a>' + 
          '</div>' + 
          '<div class="patient section cf">' + 
            '<h1 class="patient-title"></h1>' + 
            '<img class="patient-photo" src=""/>' + 
            '<p class="patient-summary"></p>' + 
            '<a class="patient-more-link" href="" target="_blank">Donate</a>' + 
          '</div>' + 
        '</div>';
      this.$popup = $(template).insertBefore(this.$el);
      this.$popup.addClass("align-" + (this.popup_align))

      this.$popup.parent().css('position', 'relative');
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

    loadPatients: function() {
      // TODO: Do not use jsonp.jit.su
      $.ajax('http://watsi-api-proxy.herokuapp.com/?url=https://watsi.org/fund-treatments.json', {
        dataType: 'jsonp', // We have JSON, but cross domain :(
        success: $.proxy(function(patients) {
          this.renderProfile(patients.profiles.randomElement());
          this.positionPopup();
          this.$popup.addClass('loaded');
        }, this)
      });
    },

    renderProfile: function(profile) {
      this.$popup.find('.patient-title').text("Fund " + profile.name + "'s Treatment");
      this.$popup.find('.patient-photo').attr('src', profile.profile_url);
      this.$popup.find('.patient-summary').text(profile. promo_description);
      this.$popup.find('.patient-more-link').attr('href', profile.url + '?from=popup');

      this.$popup.find('.patient-more-link').on('click', $.proxy(function() {
        this.openWatsi(profile)
      }, this));
      this.$el.parent('form').on('submit', $.proxy(function() {
        this.openWatsi(profile)
      }, this));

    },

    openWatsi: function(profile) {
      var center = {x: ($(window).width() / 2) - (985 / 2), y: 150};
      var new_window = window.open(profile.url, '',
              'height=560,width=985,location=false,toolbar=false,menubar=false,screenX=' + center.x + ',screenY=' + center.y + ',left' + center.x + ',top' + center.y);
      if(window.focus) new_window.focus();

      this.$popup.removeClass('open');
    }
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

})( jQuery, window, document );
