// JavaScript Document
(function($) {
	var p2pPop = {
		position: function(w, h) { //窗口尺寸
			var winWidth = $(window).width();
			var winHeight = $(window).height();
			var docWidth = $(document).width();
			var docHeight = $(document).height();
			var scrollTop = $(document).scrollTop();
			var scrollLeft = $(document).scrollLeft();
			var a = (winWidth - w) / 2;
			var b = (winHeight - h) / 2;
			if (a < 0) {
				a = 0
			};
			if (b < 0) {
				b = 0
			}
			return posiXY = {
				winW: winWidth,
				winH: winHeight,
				docW: docWidth,
				docH: docHeight,
				scrTop: scrollTop,
				scrLeft: scrollLeft,
				x: a + scrollLeft, //absolute定位
				y: b + scrollTop,
				x1: a, //fixed定位
				y1: b
			}
		},
		maskLayer: function(opts) { //遮蔽层
			var off = p2pPop.position(); //定位对象
			var attr = {};
			if (!opts) {
				attr.markZindex = 1000;
			} else {
				attr.markZindex = opts.markZindex;
			};
			var $div = $("<div>", {
				"class": "p2p_maskLayer"
			}).css({
				background: "#000",
				display: "none",
				position: "absolute",
				left: 0,
				top: 0,
				height: off.docH,
				width: off.docW,
				zIndex: attr.markZindex
			}).appendTo($("body"));
			$div.fadeTo(200, 0.3);
			$(window).resize(function() {
				off = p2pPop.position();
				$div.css({
					height: off.docH,
					width: off.docW
				});
			});
			return $div;
		},
		drag: function(obj) { //拖拽功能  obj是jQuery对象
			var b = false;
			obj.mouseenter(function() {
				$(this).css("cursor", "all-scroll");
			}).mouseleave(function() {
				$(this).css("cursor", "auto");
			});
			obj.mousedown(function(e) {
				var off = p2pPop.position();
				var m = e.pageX - obj.offset().left; //鼠标与原始的差距
				var n = e.pageY - obj.offset().top;
				var w = obj.parent().outerWidth(true);
				var h = obj.parent().outerHeight(true);
				var minCriticalX = off.scrLeft;
				var minCriticalY = off.scrTop;
				var maxCriticalX = off.scrLeft + off.winW - w - 10;
				var maxCriticalY = off.scrTop + off.winH - h - 10;
				b = true;
				$(document).mousemove(function(e) {
					if (b) {
						move(e, m, n, minCriticalX, minCriticalY, maxCriticalX, maxCriticalY);
					}
				});
				$(document).mouseup(function() {
					mouseup(obj)
				});
				$(document).live("selectstart", function() { //ie中拖拽时禁止文本选取
					return false;
				});
				$("body").css("-moz-user-select", "none"); //ff中拖拽时禁止文本选取
				obj.parent().css("-moz-user-select", "none"); //ff中拖拽时禁止文本选取
			});

			function move(e, m, n, minCriticalX, minCriticalY, maxCriticalX, maxCriticalY) {
				var x = e.pageX - m;
				var y = e.pageY - n;
				if (x <= minCriticalX) {
					x = minCriticalX;
				}
				if (y <= 0) {
					y = 0;
				}
				if (x >= maxCriticalX) {
					x = maxCriticalX;
				}
				if (y >= maxCriticalY) {
					y = maxCriticalY;
				}
				obj.parent().css({
					left: x,
					top: y
				});
			}

			function mouseup(obj) {
				b = false;
				$("body").css("-moz-user-select", "");
				obj.parent().css("-moz-user-select", "");
			}

		}
	}	
	
	$.fn.addInteractivePop = function(opts) {
		var mark = null;
		var $this = $(this);
		var p = $.extend({
			position: "absolute",
			width: "auto",
			height: "auto",
			mark: false,
			title: true,
			magTitle: "",
			drag: true,
			eleZindex: 1001,
			markZindex: 1000
		}, opts);
		$this.addClass("publicPop");
		if (p.title && $this.find(".title").length == 0) {
			$this.wrapInner('<div class="publicPopMain"></div>');
			$this.prepend($('<div class="title">' + p.magTitle + '<a href="javascript:void(0);" class="close"></a></div>'));
			if (p.drag) {
				p2pPop.drag($this.find(".title"));
			}
			if (p.height != "auto") {
				p.height = p.height + 32;
			}
		} else {
			if ($this.find(".close").length == 0) {
				$this.prepend($('<a href="javascript:void(0);" class="close" style="right:8px;top:8px;"></a>'));
			}
		}
		var w, h;
		if (p.width == "auto") {
			w = $this.innerWidth();

		} else {
			w = p.width;
		}
		if (p.height == "auto") {
			h = $this.innerHeight();
		} else {
			h = p.height;
		}
		var offset = p2pPop.position(w, h);
		if (p.position == "fixed") {
			if(offset.scrTop < 100){
				$this.css({
					position: p.position,
					top: offset.y,
					left: offset.x,
					display: "block",
					zIndex: p.eleZindex
				});
			}else{
				$this.css({
					position: p.position,
					top: offset.y1,
					left: offset.x,
					display: "block",
					zIndex: p.eleZindex
				});
			}			
		} else {
			$this.css({
				position: p.position,
				top: offset.y1,
				left: offset.x1,
				display: "block",
				zIndex: p.eleZindex
			});
		};
		function setWinH() {
			var _main = $this.find('.publicPopMain'),
				mainH = _main.children().outerHeight(true),
				mainT = _main.offset().top,
				winH = $(window).height();
			if (mainH + mainT > winH) {
				//console.log(mainH);
				_main.css({
					//'height': mainH,
					//'height': '320px',
					//'overflow-y': 'auto'
				});
			} else {
				_main.removeAttr('style');
			}
		}
		setWinH();
		$(window).resize(function() {
			if ($this.length) {
				if ($this.is(':visible')) setWinH();
			} else {
				$(window).unbind(setWinH);
			}
		});
		if (p.mark) {
			mark = p2pPop.maskLayer(p);
		}
		$this.find(".close").click(function() {
			if (p.mark) {
				mark.remove();
			}
			$this.hide();
			if(p.closeFn){
				var scope = $this.scope();
				scope.$apply(function(){
					p.closeFn(scope);
				});
			}
		});
	}
	
	window.p2pPop = p2pPop;

})(jQuery)