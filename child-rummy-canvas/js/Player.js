/*
	Player class
*/

var Player = function(canvas, args) {
	this.x = args.x;
	this.y = args.y;
	this.w = 220;
	this.h = 220;
	this.scale = args.scale || 3;
	this.set = canvas.set();
	this.isDealer = args.isDealer;
	this.isOpponent = args.isOpponent;
	this.cards = [];
	this.points = 0;
	this.name = args.name;
	this.image = (this.name === 'Computer') ? 'http://i.imgur.com/1iURM2K.png' : 'http://i.imgur.com/wDUVZiY.jpg';
	this.shape_image = canvas.image(this.image, this.x, this.y, this.w/this.scale, this.h/this.scale);
	this.id = args.id || 1;
	this.text = canvas.text(this.x + 50, this.y - 15, this.name);
	this.text.attr({
		'font-size': 10,
		'fill': "#fff"
	});
	this.set.push(this.shape_image, this.text);
};

Player.prototype = {

	constructor: Player,

	setCards : function (card) {
		this.cards.push(card);
	},

	getCards : function () {
		return this.cards;
	},

	setData : function (playerObj) {
		this.cards = playerObj.suit;
		this.name = playerObj.name;
		this.value = playerObj.value;
		this.image = playerObj.image;
	},

	getData : function () {
		return this;
	},

	reset : function () {
		this.cards.forEach(function (card) {
			card.set.remove();
		});
		this.cards = [];
	}

};