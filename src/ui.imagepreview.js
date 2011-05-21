/**
 *
 * Copyright (c) 2009-2011 Sebastian Sauer (http://www.dynpages.de)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.gnu.org/licenses/gpl-3.0.txt) licenses.
 *
 * Built on top of jQuery http://jquery.com
 *
 * @author Sebastian Sauer info@dynpages.de
 * @version 1.0
 * @since june 2009
 *
 */


;(function($) {
	$.widget('ui.imgpreview', {
		options: {
			uiClass : 'ui-imgpreview-preloader',
			offset : {
				x : 100,
				y : -100
			},
			loader : {
				img : '/img/ajax-loader.gif',
				loadingText : 'Bitte warten - Bild wird geladen'
			}
		},
		_create : function () {
			var self = this,
				o = this.options;
			if (!o || o.disabled) {
				return;
			}
			this._addContainer();
			this.element
				.bind('focus.' +  o.uiClass + ' mouseover.' + o.uiClass + ' mouseenter.' + o.uiClass,
					function(ev)
					{
						var $this = $(this).addClass('ui-state-hover'),
							c = $('div.' + o.uiClass).removeClass('ui-helper-hidden').fadeIn(),
							desc = $this.attr("title"),
							url = $this.attr("alt"),
							$img = $("<img />");
						if(true === $.browser.msie) {
							$img.attr('src', url);
							c.html($img).append('<p>' + desc + '</p>');
							return;
						}
						$img
							.load(function () {
								c
									.removeClass('loading')
									.html($(this))
									.append('<p>' + desc + '</p>');
							})
							.attr('src', url);
						if(self && $.isFunction (self._ui)) {
							self._trigger('onshow', ev, self._ui($this));
						}
					}
				)
				.bind('blur.' +  o.uiClass + ' mouseout.' +  o.uiClass + ' mouseleave.' +  o.uiClass,
					function(ev) {
						var $this = $(this).removeClass('ui-state-hover');
						$('div.' + o.uiClass).fadeOut();
						self._rebuild();
						if(self && $.isFunction (self._ui)) {
							self._trigger('onleave', ev, self._ui($this));
						}
					}
				)
				.bind(
					'mousemove.imgpreview',
					function(ev) {
						var o = self.options,
							x = ev.pageX + o.offset.x,
							y = ev.pageY + o.offset.y;
						$('div.' + o.uiClass)
							.css('top', y + 'px')
							.css('left', x + 'px');
				});
		},
		_addContainer : function () {
			var o = this.options,
				l = o.loader,
				$body = $('body'),
				preloading;
			preloading = $([
				'<div class="' + o.uiClass + ' ui-dialog ui-state-focus">',
					'<img src="' + l.img + '" alt="loading" />',
					'<p>' + l.loadingText + '</p>',
				'</div>'
				].join('')
			);
			$('div.' + o.uiClass).remove();
			$body.append(preloading);
			$('div' + o.uiClass).addClass('ui-helper-hidden');
		},

		_remove : function () {
			$('div.' + this.options.uiClass).remove();
		},
		_rebuild : function () {
			this._remove();
			this._addContainer();
		},
		_ui : function ($el) {
			if(typeof($el) === "undefined") {
				return this.element;
			}
			return {
				"element" : $el,
				"image" : $el.attr('alt'),
				"description" : $el.attr('rel')
			};
		},
		destroy : function () {
			this._remove();
			this.element
				.removeClass(this.options.uiClass + ' ui-dialog ui-state-focus')
				.unbind('.imgpreview');
			$.Widget.prototype.destroy.apply(this, arguments);
		}
	});
})(jQuery);
