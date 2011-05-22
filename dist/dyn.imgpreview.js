(function( jQuery ) {

jQuery.ajaxPrefilter( "img", function( s ) {
	if ( s.cache == null ) {
		s.cache = false;
	}
	s.type = "GET";
	s.async = true;
});

jQuery.ajaxTransport( "img", function( s ) {
	var callback;
	return {
		send: function( _, complete ) {
			var image = new Image();
			callback = function( success ) {
				var img = image;
				callback = image = image.onload = image.onerror = null;
				if ( success != null ) {
					if ( success ) {
						complete( 200, "OK", { img: img } );
					} else {
						complete( 404, "Not Found" );
					}
				}
			};
			image = new Image();
			image.onload = function() {
				callback( true );
			};
			image.onerror = function() {
				callback( false );
			};
			image.src = s.url;
		},
		abort: function() {
			if ( callback ) {
				callback();
			}
		}
	};
});

})( jQuery );
/**
 * Copyright (c) 2009-2011 Sebastian Sauer (http://www.dynpages.de)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 *
 * @version 1.3pre
 * @since june 2009
 *
 */

( function( $ ) {

$.dyn = $. dyn || {};

$.widget( "dyn.imgpreview", {
	options: {
		position : {
			my: "left+50 center-50",
			at : "left center",
			collision : "fit",
			using: function( to ) {
				$( this ).css({
					top: to.top,
					left: to.left
				});
			}
		},
		loader : {
			uiClass : "ui-dialog",
			cssClass : "dyn-imgpreview-preloader",
			loadingText : "Bitte warten - Bild wird geladen"
		}
	},
	_create : function () {

		this._addContainer();

		this._hoverable();
		this._focusable();

		this._bind({
			focus : "_open",
			mouseenter : "_open",
			blur : "_close",
			mouseleave : "_close",
			mousemove : "_mouseMove"
		});
	},

	_open : function ( ev ) {
		if( this.options.disabled ) {
			return;
		}

		var that = this,
			desc = this._getDescription();

		this.container
			.removeClass( "ui-helper-hidden" )
			.find( "p" )
				.show();

		$.ajax({
			url : this.element.data( "img" ),
			cache : true,
			dataType : "img"
		})
		.success( function ( img ) {
			that.container
				.find( "p" )
				.hide();

			that.imageContainer
				.removeClass( that.options.loader.cssClass + "-loading" )
				.html( img )
				.append( "<p>" + desc + "</p>" );
		})
		.error( function () {
			that.container.addClass( "ui-helper-hidden" );
		});
		this._trigger( "open", ev, this._ui() );
	},
	_close : function( ev ) {
		var that = this;

		this.imageContainer
			.html( "" )
			.addClass( that.options.loader.cssClass + "-loading" );
		this.container
			.addClass("ui-helper-hidden")
			.find( "p" )
				.show();
		this._trigger( "close", ev, this._ui() );
	},
	_mouseMove : function ( ev ) {
		var o = this.options,
			posO = $.extend( o.position, {
				of: ev
			});
		this.container.position( posO );
	},
	_addContainer : function () {
		var o = this.options,
			l = o.loader,
			c = $( "." + l.cssClass ),
			$body = $( "body" );

		if( $body.length < 1 ) {
			return;
		}

		if( c.length > 0 ) {
			this.container = c.parent();
			this.imageContainer = c;
			return;
		}

		c = $( [
				"<div class='dyn-imgpreview " + l.uiClass + " ui-state-focus'>",
					"<div class=\"" + l.cssClass + " " + l.cssClass + "-loading\"></div>",
					"<p>" + l.loadingText + "</p>",
				"</div>"
			].join("") )
			.addClass( "ui-helper-hidden" );

		this.container = c;
		this.imageContainer = c.find( "." + l.cssClass );
		$body.append( c );
	},
	_remove : function () {
		this.container.remove();
	},
	_getDescription : function () {
		var desc = this.element.data( "desc" );
		return ( desc && desc.length > 0 ) ? desc : "";
	},
	_ui : function () {
		return {
			container : this.container,
			imageContainer : this.imageContainer,
			image : this.element.data( "img" ),
			description : this._getDescription()
		};
	},
	destroy : function () {
		this._remove();
		this._superApply( 'destroy', arguments );
	}
});


} )( jQuery );
