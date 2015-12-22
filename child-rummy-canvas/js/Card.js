/*
	Card class
*/

var Card = function(manager, canvas, args) {
	this.x = args.x;
	this.y = args.y;
	this.w = 500;
	this.h = 726;
	this.scale = args.scale || 10;
	this.set = canvas.set();
	this.revealed = false;
	this.shape = canvas.rect(this.x, this.y, this.w/this.scale, this.h/this.scale, 10);
	this.image = 'Playing Cards/SVG-cards-1.3/' + args.name + '_of_' + args.suit_image + '.svg';
	this.shape_image = canvas.image(this.image, this.x, this.y, this.w/this.scale, this.h/this.scale);
	this.shape_image.hide();
	this.id = args.id || 1;
	this.suit = args.suit;
	this.name = args.name;
	this.value = args.value;
	this.valueSet = 'deadwood';

	this.current_deck = args.current_deck;
	this.isDrawable = args.isDrawable;
	this.isThrowable = args.isThrowable;

	this.set.push(this.shape, this.shape_image);

	this.set.attr("fill", "#acff66");
	this.set.attr("fill-opacity", .5);
	this.set.attr("stroke-width", 2);
	this.set.attr("stroke", "black");

	this.set.click(function (e) {
		if (this.isDrawable && manager.getCurrentPlayer().name === 'MainPlayer' && this.current_deck !== 'in_Computer_hand') {
			manager.handleCardAnimation('draw', this, manager.handleDraw.bind(manager));
		} else if (this.isThrowable && manager.getCurrentPlayer().name === 'MainPlayer' && this.current_deck !== 'in_Computer_hand') {
			manager.handleCardAnimation('throw', this, manager.handleThrow.bind(manager));
		}
	}.bind(this));

	this.set.hover(
		function(e) {
			if ((this.isDrawable || this.isThrowable) && (manager.getCurrentPlayer().name === 'MainPlayer') && (this.current_deck !== 'in_Computer_hand')) {
				if (this.isDrawable) {
					this.set.attr('stroke', "white");
				} else {
					this.set.attr('stroke', "red");
				}
			}
		}.bind(this),
		function(e) {
			this.set.attr('stroke', 'black');
		}.bind(this)
	);
};

Card.prototype = {

	constructor: Card,

	setData : function (cardObj) {
		this.suit = cardObj.suit;
		this.name = cardObj.name;
		this.value = cardObj.value;
		this.image = cardObj.image;
	},

	getData : function () {
		return this;
	}

};