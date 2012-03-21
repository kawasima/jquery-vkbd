/**
 * Copyright (c) 2012 kawasima, http://unit8.net/
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

;(function($) {
	var DAKUTEN = {
			'カ':'ガ', 'キ':'ギ', 'ク':'グ', 'ケ':'ゲ', 'コ':'ゴ',
			'サ':'ザ', 'シ':'ジ', 'ス':'ズ', 'セ':'ゼ', 'ソ':'ゾ',
			'タ':'ダ', 'チ':'デ', 'ツ':'ヅ', 'テ':'デ', 'ト':'ド',
			'ハ':'バ', 'ヒ':'ビ', 'フ':'ブ', 'ヘ':'ベ', 'ホ':'ボ'
	};
	var HANDAKUTEN = {
			'ハ':'パ', 'ヒ':'ピ', 'フ':'プ', 'ヘ':'ペ', 'ホ':'ポ'
	};
	for (key in DAKUTEN) {
		DAKUTEN[DAKUTEN[key]] = key;
	}
	for (key in HANDAKUTEN) {
		HANDAKUTEN[HANDAKUTEN[key]] = key;
	}
	function add_dakuten(text) {
		var pos = this.element.data('caret-position');
		var val = this.element.val();
		if (pos.start > 0) {
			var c = val.charAt(pos.start - 1);
			if (DAKUTEN[c]) {
				this.element.val(val.substr(0, pos.start - 1) + DAKUTEN[c] + val.substr(pos.start));
			}
		}
	};
	function add_handakuten(text) {
		var pos = this.element.data('caret-position');
		var val = this.element.val();
		if (pos.start > 0) {
			var c = val.charAt(pos.start - 1);
			if (HANDAKUTEN[c]) {
				this.element.val(val.substr(0, pos.start - 1) + HANDAKUTEN[c] + val.substr(pos.start));
			}
		}
	};

  var preset_keypads = {
    qwerty: [
      ['Q','W','E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
      ['A','S','D', 'F', 'G', 'H', 'J', 'K', 'L'],
      [null, 'Z','X','C', 'V', 'B', 'N', 'M']
    ],
    tenkey: [
      ['1','2','3'],
      ['4','5','6'],
      ['7','8','9'],
      ['0',null, null]
    ],
    kana: [
      ['ア', 'カ', 'サ', 'タ', 'ナ', 'ハ', 'マ', 'ヤ', 'ラ', 'ワ', {text: '゛', action: add_dakuten}],
      ['イ', 'キ', 'シ', 'チ', 'ニ', 'ヒ', 'ミ', null, 'リ', null, {text: '゜', action: add_handakuten}],
      ['ウ', 'ク', 'ス', 'ツ', 'ヌ', 'フ', 'ム', 'ユ', 'ル', null, null],
      ['エ', 'ケ', 'セ', 'テ', 'ネ', 'ヘ', 'メ', null, 'レ', null, null],
      ['オ', 'コ', 'ソ', 'ト', 'ノ', 'ホ', 'モ', 'ヨ', 'ロ', 'ン', null]
    ]
  };

  var currentDom = null;

  Panel = function(options) {
	  var self = this;
	  this.keypad = null;
      this.panel = $('<div class="ui-keypad" onmousedown="return false"/>')
      	.css({backgroundColor: "#97979C"})
      	.css3('linearGradient', '#97979C', '#67676C');
      this.original_height = 0;
      this.button_size = (options && options.button_size)   ? options.button_size   : 30;
      this.navbar_height = (options && options.navbar_height)   ? options.navbar_height   : 40;

      $(document).ready(function() { panel.appendTo($("body")); });
      var panel = this.panel;
      this.panel.hide();

      this.navbar = $('<div class="ui-keypad-navbar"/>')
      	.css({height: this.navbar_height})
      	.css3('linearGradient', '#545454', '#000000');

      this.prevButton  = $('<button type="button" class="ui-keypad-group-btn-left" data-role="none">前へ</button>')
      	.css({height: this.button_size + "px", top: ((this.navbar_height - this.button_size) / 2) + "px"})
      	.css3('linearGradient', '#858585', '#262626');
      this.nextButton  = $('<button type="button" class="ui-keypad-group-btn-right" data-role="none">次へ</button>')
      	.css({height: this.button_size + "px", top: ((this.navbar_height - this.button_size) / 2) + "px"})
      	.css3('linearGradient', '#858585', '#262626');
      this.closeButton = $('<button type="button" class="ui-keypad-btn-blue ui-keypad-group-btn-left ui-keypad-group-btn-right" data-role="none">完了</button>')
      	.css({height: this.button_size + "px", top: ((this.navbar_height - this.button_size) / 2) + "px"})
      	.css3('linearGradient', '#819CEB', '#2E62D2');

      this.navbar.append(this.prevButton.bind("vclick", function() {
    	  var targetDoms = $(":text.ui-keypad-enabled:enabled:visible", $.mobile.activePage);
    	  var idx = targetDoms.index(self.keypad.element);
    	  if (idx > 0) {
    		  element = targetDoms.eq(idx - 1);
    		  element.trigger("vclick");
    		  element.trigger("focus");
    	  }
      }));
      this.navbar.append(this.nextButton.bind("vclick", function(e) {
    	  e.stopPropagation();
    	  var targetDoms = $(":text.ui-keypad-enabled:enabled:visible", $.mobile.activePage);
    	  var idx = targetDoms.index(self.keypad.element);
    	  if (idx < targetDoms.length - 1) {
    		  element = targetDoms.eq(idx + 1);
    		  element.trigger("vclick");
    		  element.trigger("focus");
    	  } else {
    		  self.closeButton.trigger("vclick");
    	  }
      }));
      this.navbar.append(this.closeButton.bind("vclick", function(e) { self.hide.apply(self) }));
      this.navbar.appendTo(panel);

      this.main_panel = $('<div class="ui-keypad-main-panel"/>');

      this.select_keypad_panel = $('<div class="ui-keypad-select-keypad"/>');
      this.select_keypad_panel.appendTo(this.main_panel);

      var main_keypad_panel = $('<div class="ui-keypad-main-keypad-panel"/>').appendTo(this.main_panel);

      this.speed_dial_panel = $('<div class="ui-keypad-speed-dial-panel"/>');
      this.speed_dial_panel.appendTo(main_keypad_panel);

      this.button_panel = $('<div class="ui-keypad-button-panel"/>');
      this.button_panel.appendTo(main_keypad_panel);

      this.common_button_keypad = new Keypad("common",
    		  [[{text: 'クリア', width: 3, action: function(text){ this.element.val("") }, zoomin: false}],
    		   [{text: '一字削除', width: 3, action: function(text){ this.element.val(this.element.val().substring(0, this.element.val().length - 1)) } }]]);
      var common_button_panel = $("<div class='ui-keypad-common-button'/>").append(this.common_button_keypad.button_panel);
      common_button_panel.appendTo(this.main_panel);
      this.main_panel.appendTo(this.panel);
  };

  Panel.prototype.show = function(element) {
	this.panel.show();
	this.common_button_keypad.setTarget(element);
	if (this.speed_dial_keypad)
		this.speed_dial_keypad.setTarget(element);

	var content = $("div[data-role=content]", $.mobile.activePage);
	if (!this.original_height)
		this.original_height = content.height();
	if (element.offset().top + element.height() > this.panel.offset().top) {
		var d = element.offset().top - this.panel.offset().top + element.height() + 100;
		content.height(content.height() + d);
		$.mobile.silentScroll(element.offset().top);
	}
  };
  Panel.prototype.hide = function() {
	  currentDom = null;
	  var content = $("div[data-role=content]", $.mobile.activePage);
	  if (this.original_height)
		  content.height(this.original_height);
	  this.original_height = null;
	  this.panel.hide();
  }
  Panel.prototype.setKeypad = function(keypad) {
	  this.keypad = keypad;
	  var k = $("#keypad-"+keypad.name, this.button_panel);
	  $(".ui-keypad-button-panel", this.button_panel).hide();
	  if(k.size() == 0) {
		  this.button_panel.append(keypad.button_panel);
	  } else {
		  k.show();
	  }
	  this.keypad.onBeforeShow.apply(this.keypad, []);
  };
  Panel.prototype.setKeypadTypes = function(types) {
		var self = this;
		this.keypad_types = types;
		this.select_keypad_panel.empty();
		if (types.length < 2) return;

		$.each(types, function(i, t) {
			self.select_keypad_panel.append(
				$('<div class="ui-keypad-button"/>')
					.text(keypads[t].label)
					.css({backgroundColor: "#EEEEEE"})
					.bind("vclick", function(e) {
						var target = self.keypad.element;
						self.setKeypad(keypads[t]);
						keypads[t].setTarget(target);
					})
			);
	  });
  };
  Panel.prototype.setSpeedDial = function(speedDial) {
	this.speed_dial_keypad = keypads[speedDial];
	this.speed_dial_panel.height(0);
	$(".ui-keypad-button-panel", this.speed_dial_panel).hide();
    if (!this.speed_dial_keypad) return;

    var k = $("#keypad-" + this.speed_dial_keypad.name, this.speed_dial_panel);
    this.speed_dial_panel.height(this.speed_dial_keypad.button_size);
	if (k.size() == 0) {
		this.speed_dial_panel.append(this.speed_dial_keypad.button_panel);
	} else {
    	k.show();
	}
  };

  Keypad = function(name, key_settings, options) {
	var self = this,
	    balloon      = $('<div class="ui-keypad-balloon"/>'),
        balloon_base = $('<div class="ui-keypad-balloon-base"/>').css3('linearGradient', '#C2C2C2', '#EEEEEE'),
        orig_size = { width: 0, height: 0 },
        orig_pos  = { top:0, left: 0 },
        button_panel = $('<div class="ui-keypad-button-panel"/>').attr("id", "keypad-" + name);

	this.button_size    = (options && options.size)   ? options.size   : 40;
	this.button_margin  = (options && options.margin) ? options.margin : 10;
	this.label = (options && options.label) ? options.label : name;

    $.each(key_settings, function(y, row) {
      var button_row = $('<div class="ui-keypad-button-row"/>').height(self.button_size + self.button_margin);

      button_row.appendTo(button_panel);
      var offset = button_row.offset();

      var x = 0;
      $.each(row, function(j, key) {
        if (key == null) {
        	x += 1;
        	return;
        }
        var button = $('<div class="ui-keypad-button"/>')
        	.css({width: self.button_size, height: self.button_size, backgroundColor: "#EEEEEE"})
        	.appendTo(button_row);
        button.data("action", self.default_action);
        button.data("zoomin", true);
        button.css({position: 'absolute', top: 0, left: x * (self.button_size + self.button_margin)});
        x += 1;
        if (typeof key == 'string') {
           button.append($("<p/>").text(key));
        } else {
        	if (key.width && key.width > 1) {
        		button.css({ width: self.button_size * key.width + self.button_margin * (key.width - 1) });
        		x += (key.width - 1);
        	}
           button.append($("<p/>").text(key.text));
           button.data("action", key.action);
           if (typeof key.value == 'string')
        	   button.data("value", key.value);
           button.data("zoomin", Boolean(key.zoomin));
        }
        button.bind("vmousedown", function(event) {
          var push_button = $(this);
          event.preventDefault();
          if (push_button.data("zoomin"))
            self.zoomin(push_button);
          $(document).bind("vmouseup", self.mouseup_func(push_button));
        });
      });
	});
    this.button_panel = button_panel;
    this.balloon      = balloon;
    this.balloon_base = balloon_base;
    this.orig_size = orig_size;
    this.orig_pos  = orig_pos;
    this.name = name;
    this.element = null;
  };

  Keypad.prototype.default_action = function(text) {
	  this.insertVal(text);
  }

  Keypad.prototype.insertVal = function(text) {
	var current_text = this.element.val();
	var pos = this.element.data('caret-position');
	if (pos.start == pos.end) {
		this.element.setCaretPos(pos);
		this.element.insertAfterSelection(text, 'end');
	} else {
		var val = this.element.val();
		this.element.val(val.substring(0, pos.start) + text + val.substring(pos.end));
		pos.end = pos.start;
		this.element.setCaretPos(pos);
	}
    pos.start = pos.end = this.element.data('caret-position').start + text.length;
	this.element.setCaretPos(pos).data('caret-position', this.element.getCaretPos());

  }
  Keypad.prototype.mouseup_func = function(button) {
	  var self = this;
	  var push_button = button;
	  return function(e) {
		  e.preventDefault();
		  e.stopImmediatePropagation();
	      $(document).unbind("vmouseup");
	      var value = push_button.data("value") || push_button.text();
          push_button.data("action").apply(self, [value]);
          if (push_button.data("zoomin"))
              self.zoomout(push_button);
            if (self.isFilled()) {
          	  panel.nextButton.trigger("vclick");
            }
	  };
  }
  Keypad.prototype.isFilled = function() {
	  var maxlength = (this.element.attr("maxlength")) ? Number(this.element.attr("maxlength")) : 255;
	  var val = this.element.val();
	  if (val.length >= maxlength) {
		  this.element.val(val.substring(0, maxlength));
		  return true;
	  }

	  var max = this.element.data("max");
	  if (max && Number(val) * 10 > max) {
		  return true;
	  }

	  return false;
  }
  Keypad.prototype.onBeforeShow = function() {}

  Keypad.prototype.zoomin = function(b) {
      var pos = b.position();
      this.balloon.insertAfter(b);
      this.balloon_base.insertAfter(b);

      this.balloon_base.css({
        position:'absolute',
        top: pos.top,
        left: pos.left
      });
      this.balloon.css({
        position:'absolute',
        top: pos.top - (this.button_size / 2),
        left: pos.left - (this.button_size / 2),
        zIndex: 1100
      });

      this.orig_size = { width: b.width(), height: b.height() };
      this.orig_pos  = b.position();
      b.width(this.orig_size.width * 2);
      b.height(this.orig_size.height * 2);
      b.addClass("ui-keypad-button-active");
      b.css({
        top: pos.top - (this.button_size * 2 + this.button_size / 2) + 5,
        left: pos.left - (this.button_size / 2),
        lineHeight: (this.button_size * 2 - this.button_size / 2) + "px",
        zIndex: 1000,
      }).css3('linearGradient', '#EEEEEE', '#C2C2C2');
  };

  Keypad.prototype.zoomout =  function(b) {
      b.width(this.orig_size.width);
      b.height(this.orig_size.height);
      b.css({
        top: this.orig_pos.top,
        left: this.orig_pos.left,
        lineHeight: this.button_size + "px",
        background: "#EEEEEE",
        filter: "",
        zIndex: 1
      });
      b.removeClass("ui-keypad-button-active");
      this.balloon_base.remove();
      this.balloon.remove();
  };

  Keypad.prototype.setTarget = function(element) {
	  this.element = element;
  };

  Keypad.prototype.getTarget = function() {
	  return this.element;
  };


  var panel = new Panel();
  Panel.getInstance = function() { return panel };

  keypads = {};
  $.each(preset_keypads, function(name, ary) {
	 keypads[name] = new Keypad(name, ary);
  });

  var pluginName = 'tenkeypad';

  $(document).bind("pagebeforechange", function() {
	 currentDom = null;
	 panel.hide();
  });
  $[pluginName] = function(dom, options) {
    var
    plugin    = this,
    element   = $(dom),
    speedDial = undefined,
    init = function() {
    	var types;
    	if (options['preset'] instanceof Array) {
    		types = options['preset'];
    	} else if (typeof(options['preset']) == "string") {
    		types = [options['preset']]
    	} else {
    		types = ['tenkey']
    	}

    	if (typeof(options['speedDial']) == "string") {
    		speedDial = options['speedDial'];
    	}

    	element.bind("vclick", function(e) {
    		if (currentDom == this || $(e.target).is(":disabled"))
    			return;
    		element = $(this);
    		currentDom = this;
    		element.data("caret-position", element.getCaretPos());
    		panel.setKeypadTypes(types);
    		panel.setSpeedDial(speedDial);

    		var keypad = keypads[types[0]];
    		keypad.setTarget(element);
    		panel.setKeypad(keypad);
    		panel.show(element);
    	})
    	.bind("vmouseup", function() {
    		element.data("caret-position", element.getCaretPos());
    	})
    	.addClass('ui-keypad-enabled');

      if (options['max']) element.data('max', Number(options['max']));
      if (options['min']) element.data('min', Number(options['min']));
      if (options['maxLength']) element.attr('maxlength', options['maxLength']);

    };

    plugin.methods = {
    	setSpeedDial: function(sd) {
    		speedDial = sd;
    	}
    };

    element.data(pluginName, plugin);
    init();
  };

  $.fn[pluginName] = function(options) {
    var args = arguments,
        chain = this;
    this.each(function() {
      var i = $(this);
      if (undefined == (plugin = i.data(pluginName))) {
        plugin = new $[pluginName](this, options);
      }
      if (plugin.methods[options]) {
      	if((r = plugin.methods[options].apply( plugin, Array.prototype.slice.call( args, 1 ))) !== this) {
          	chain	= r;
          	return	false;
      	}
      }
    });
    return this;
  };
})(jQuery);
