document.addEventListener("DOMContentLoaded", function(event) {

	/*
		Responsible for Managing Game Logic
	*/
	(function () {
		Rummy.Manager = Rummy.Manager || {};

		Rummy.Manager = (function () {
			var api = {},
				suits = ['hearts', 'spades', 'clubs', 'diamonds'],
				values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
				names = ['ace', 'jack', 'queen', 'king'],
				table = Rummy.Table.getTable(),
				Control_Panel = {
					ai_game : false,
					show_AI_hand : false,
					run_threshold : 4,
					meld_threshold : 3,
					speed : 1000
				};

			api.init = function () {
				//Total cards to deal to each player
				this.deal_count = 7;

				// Initialize handler for Game
				this.initializeHandlers();

				this.state = null;
				this.discard_deck = [];
				this.deck = shuffleDeck(createDeck());
				this.players = createPlayers();
				this.current_player = this.players.player;

				// For animations: Store the location of the thrown card so it can be replaced on next draw:
				this.space_player = null;
				this.space_cpu = null;
				this.thrown_discard_card_id_cpu = -1;
				this.thrown_discard_card_id_player = -1;
			};

			api.getPlayers = function () {
				return this.players;
			};

			api.getCurrentPlayer = function () {
				return this.current_player;
			};

			api.setCurrentPlayer = function (player) {
				this.current_player = player;
			};

			/*
				Handle drawing and throwing card animation
			*/
			api.handleCardAnimation = function (anim, card, callback) {

				var player_clone = jQuery.extend({}, this.current_player);		
				
				var that = this;
				if (anim === 'draw') {
					card.set.animate({
						x : (function () {
								if (that.space_player && that.current_player.name === 'MainPlayer') {
									return that.space_player + ((card.current_deck === 'in_deck') ? -10 : 0);
								} else if (that.space_cpu && that.current_player.name === 'Computer') {
									return that.space_cpu + ((card.current_deck === 'in_deck') ? -10 : 0);
								} else {
									var x_change = 0;
									if (card.current_deck === 'in_discards') {
										x_change = (player_clone.isOpponent) ? 0 : 10;
									} else if (card.current_deck === 'in_deck') {
										x_change = (player_clone.isOpponent) ? -10 : 0;
									}
									return (player_clone.x + ((player_clone.isOpponent) ? 380 : 370) + x_change);	
								}							
						})(),
						y: (function () {
							var y_change = 0;
							if (card.current_deck === 'in_discards') {
								y_change = (player_clone.isOpponent) ? 0 : -10;
							} else if (card.current_deck === 'in_deck') {
								y_change = (player_clone.isOpponent) ? 10 : 0;
							}
							return (player_clone.y + y_change + ((player_clone.isOpponent) ? -200 : 110))
						})()
					}, 500, 'backout', function () {
						if (!that.current_player.isOpponent || Control_Panel.show_AI_hand) {
							card.shape_image.show();	
						} else {
							card.shape_image.hide();
						}						
						callback(card);
					});	
				} else if (anim === 'throw') {

					card.set.toFront();
					card.shape_image.show();
	
					//Store the coordinates of the thrown card so the space can be replaced by a drawn card
					
					if (this.current_player.name === 'MainPlayer') {
						that.space_player = card.set.getBBox().x;
					} else {
						that.space_cpu =  card.set.getBBox().x;
					}

					card.set.animate({
						x : 590 + ((this.current_player.isOpponent) ? 10 : 0),
						y : 400
					}, 500, 'backout', function () {
						callback(card);
					});	
				}
			};

			/*
				Handle all card draw logic after draw animation has completed
			*/
			api.handleDraw = function (card) {
				this.current_player.cards.push(card);	
				this.setState('throw_card');
				if (card.current_deck === 'in_deck') {
					this.deck.pop();

				} else if (card.current_deck === 'in_discards') {
					this.discard_deck.pop();		
				}
				card.current_deck = 'in_' + this.current_player.name + '_hand';
				card.isDrawable = false;			

				if (this.deck.length) {
					this.nextTurn();		
				} else {
					this.stalemate();
				}
			};

			/*
				Handle all card throw logic after throw animation has completed
			*/
			api.handleThrow = function (card) {
				this.discard_deck.push(card);
				this.current_player.cards = this.current_player.cards.filter(function( player_card ) {
				    return player_card.id !== card.id;
				});
				this.setState('get_card');		
				card.current_deck = 'in_discards';
				card.valueSet = 'deadwood'; 
				card.isThrowable = false;
				
				// after they've thrown it, calculate if their hand is winning
				this.checkStatus(this.calculate(this.current_player, false));
			};

			api.setPlayerTurn = function () {
				if (this.current_player.name === 'MainPlayer') {
					this.setCurrentPlayer(this.players.cpu);
				} else {
					this.setCurrentPlayer(this.players.player);
				} 
			};

			api.reset = function () {
				this.state = null;

				this.discard_deck.forEach(function (card) {
					card.set.remove();
				});

				this.deck.forEach(function (card) {
					card.set.remove();
				});

				this.deck = [];
				this.discard_deck = [];

				this.deck = shuffleDeck(createDeck());

				// reset each player's hand
				for (var player in this.players) {
					if (this.players.hasOwnProperty(player)) {
						this.players[player].reset();
					}
				}

				this.current_player = this.players.player;
				this.space_player = null;
				this.space_cpu = null;

				this.updateHUD({ runs : '', melds : '' });

				if (!$('#deal').is(':visible')) {
					$('#deal').show();
				}
			};

			api.checkStatus = function (data, deal) {

				if (this.current_player.name === 'MainPlayer') {
					this.updateHUD(data);
				}

				if (data.melds.length && data.runs.length) {
					this.current_player.points += 100;
					$('#' + this.current_player.name + '_points').html(this.current_player.points);
					alert(this.current_player.name + ' has won!');
					this.reset();
				} else {
					if (!deal) {
						this.setPlayerTurn();
						this.nextTurn();
					} else {
						return;
					}
				}				
			};

			api.updateHUD = function (data) {
				$('#runs').text(data.runs);
				$('#melds').text(data.melds);
			};

			/*
				Handle initial dealing of cards
			*/
			api.deal = function () {
				var that = this,
					promises = [];

				for (var player in this.players) {
					if (this.players.hasOwnProperty(player)) {
						// Deal each player cards from top of stack
						for (var i = this.deal_count; i > 0; i--) {
							var card = this.deck.pop();
							card.current_deck = 'in_' + this.players[player].name +'_hand';
							this.players[player].setCards(card);
						}
						// "Deal" the cards. Animate them and reveal face as needed		
						var player_clone = jQuery.extend({}, this.players[player]);

						this.players[player].cards.forEach(function (card, index) {

							var animation = new Promise(function (resolve, reject) { 
								(function (card, player, index, resolve) {
									card.set.animate(
										{
											x: (player.x += 110)-table.w/2,
											y: player.y + ((player.isOpponent) ? -200 : 100)
										},1000, 'backOut', function () {
											if (!player.isOpponent || Control_Panel.show_AI_hand) card.shape_image.show();		
											resolve();
										}
									);
								})(card, player_clone, index, resolve)
							});
							promises.push(animation);
						});
					} 
				}
				// If all animations have resolved:
				Promise.all(promises).then(function(){
					this.addToDiscardDeck(function () {
						this.setState('get_card');
						this.calculate(this.current_player, null);
						this.nextTurn();
					});
				}.bind(this));							
			};

			/*
				Add card to discard deck
			*/
			api.addToDiscardDeck = function (callback) {
				var card = this.deck.pop();
				card.current_deck = 'in_discards';
				this.discard_deck.push(card);
				card.set.animate(
					{
						x : card.set.getBBox().x += 200,
						y : card.set.getBBox().y 
					}, 1000, 'backOut', function () {
						card.shape_image.show();
						callback.call(this);
					}.bind(this)
				);
			};

			api.getState = function () {
				return this.state;
			};

			api.setState = function (state) {
				this.state = state;
			};

			/*
				Handle which cards are drawable
			*/
			api.setDrawableCards = function () {
				// Set top of discard deck as playable
				if (this.discard_deck.length) {
					this.discard_deck[this.discard_deck.length-1].isDrawable = true;
				}

				// Ensure player cannot throw card during draw
				this.current_player.cards.forEach(function (card) {
					card.isThrowable = false;
				}); 

				// Set top of deck as playable and move card 
				var top_card = this.deck[this.deck.length-1];
				top_card.isDrawable = true;
				top_card.set.toFront();
				top_card.set.animate(
					{
						transform: 't10, -10'
					}
				);
				$('#step').html('Select a card from deck or discard pile.');	
			};

			/*
				Handle which cards are throwable
			*/
			api.setThrowableCards = function () {

				if (this.discard_deck.length) {
					this.discard_deck[this.discard_deck.length-1].isDrawable = false;
				}

				this.deck[this.deck.length-1].isDrawable = false;

				// set all cards in player's hand to throwable
				this.current_player.cards.forEach(function (card) {
					card.isThrowable = true;
				}); 

				$('#step').html('Discard a card.');
			};

			/*
				No more cards in deck
			*/
			api.stalemate = function () {
				$('#step').html('No more drawable cards! Game over!');
				this.reset();
			};
 			
 			/*
				Handle turns
 			*/
			api.nextTurn = function () {
				if (this.getState() === 'get_card') {
					this.setDrawableCards();
					if (this.current_player.name === 'Computer' || Control_Panel.ai_game) {
						this.AI();
					}
				} else if (this.getState() === 'throw_card') {
					this.setThrowableCards();
					if (this.current_player.name === 'Computer' || Control_Panel.ai_game) {
						this.AI();
					}
				}
			};

			/*
				Handle game speed
			*/
			api.AI_drawDelay = function (anim, card, fn) {
				var self = this;
				if (bandaid) clearTimeout(bandaid);
				var bandaid = setTimeout(function () {
					self.handleCardAnimation(anim, card, fn.bind(self));
					clearTimeout(bandaid);
				}, +Control_Panel.speed);	
			};

			/*
				Handle AI decision making
			*/
			api.AI = function () {

				if (this.getState() === 'get_card') {

					// Check if card from discard deck would be valuable
					if (this.discard_deck.length) {

						var discard_pile_card = this.discard_deck[this.discard_deck.length-1];
						
						this.calculate(this.current_player, discard_pile_card);

						// If not deadwood and is not the card you last threw, draw from discard deck
						if (discard_pile_card.valueSet !== 'deadwood' && (discard_pile_card.id !== ((this.current_player.name === 'MainPlayer') ? this.thrown_discard_card_id_player : this.thrown_discard_card_id_cpu))) {
							this.AI_drawDelay('draw', discard_pile_card, this.handleDraw);
						} else {
							this.AI_drawDelay('draw', this.deck[this.deck.length-1], this.handleDraw);
						}
					} else {
						this.AI_drawDelay('draw', this.deck[this.deck.length-1], this.handleDraw);
					} 
				} else if (this.getState() === 'throw_card') {
					var card_to_throw = null;

					var deadwood_cards = this.current_player.getCards().filter(function (card) {
						return card.valueSet === 'deadwood';
					});
					var meld_cards = this.current_player.getCards().filter(function (card) {
						return card.valueSet === 'meld';
					});
					var run_cards = this.current_player.getCards().filter(function (card) {
						return card.valueSet === 'run';
					});	
			
					// Check if melds and runs have been satisfied, or if deadwood. If so, throw extras and make room for more. 
					if (meld_cards.length > Control_Panel.meld_threshold) {
						var rand = Math.floor(Math.random() * (meld_cards.length-1 - 0)) + 0;
						card_to_throw = meld_cards[rand];
					} else if (run_cards.length > Control_Panel.run_threshold) {
						this.sortByValue(run_cards);
						card_to_throw = run_cards[run_cards.length-1];
					} else if (deadwood_cards.length) {
						var rand = Math.floor(Math.random() * (deadwood_cards.length-1 - 0)) + 0;
						card_to_throw = deadwood_cards[rand];
					} 
					// This shouldn't happen, but just to be safe:
					else {
						var rand = Math.floor(Math.random() * (this.current_player.getCards().length-1 - 0)) + 0;
						card_to_throw = this.current_player.getCards()[rand];						
					}
					// Store last thrown card as to not pick it up again. Avoid infinite loop.
					if (this.current_player.name === 'MainPlayer') {
						this.thrown_discard_card_id_player = card_to_throw.id;
					} else {
						this.thrown_discard_card_id_cpu = card_to_throw.id;
					}
					
					this.AI_drawDelay('throw', card_to_throw, this.handleThrow);
				}


			};

			api.sortByValue = function (cards) {
				return cards.sort(function(a, b) {
				    return a.value - b.value;
				});
			};

			/*
				Calculate current player's hand for runs and melds
			*/
			api.calculate = function (player, AI_card) {

				// Make shallow copy of player cards
				var cards = player.getCards().slice();

				// AI is evaluating the usefulness of the discard deck card
				if (AI_card) {
					cards.push(AI_card);
				}

				// Group player cards by value and suit
				var groups = cards.reduce(function (accumulator, card) {
				  // Group by value.
				  accumulator.values[card.value] = accumulator.values[card.value] || [];
				  accumulator.values[card.value].push(card.suit);

				  // Group by suit.
				  accumulator.suits[card.suit] = accumulator.suits[card.suit] || [];
				  accumulator.suits[card.suit].push(card.value);

				  return accumulator;

				}, {values: {}, suits: {}});

				// Melds: Check if suits for a particular value >= meld threshold. Sample: Card of value '6' has [diamonds, clubs, hearts]
				var meldValues = Object.keys(groups.values).filter(function (value) {
				    return groups.values[value].length >= +Control_Panel.meld_threshold;
				});

				// Runs: Check if values for a particular suit >= run threshold. Sample: Card of suit 'Spades' has [2, 3, 4, 5]
				var runsBySuit = {};
				var runs = Object.keys(groups.suits).map(function (suit) {
				    var values = groups.suits[suit].sort();
				    var run = [];

				    // Check for set of incrementing values: Ex: Spades: [3, 4, 11, 12]
				    for (var i = 0; i < values.length; i++) {
						if (values[i+1] - values[i] === 1) {
							if (run.indexOf(values[i+1]) === -1) {
								run.push(values[i+1]);
							}
							if (run.indexOf(values[i]) === -1) {
								run.push(values[i]);
							}
						} 
				    }

				    // Second check to see if run contains two separate runs: IE: [3, 4, 11, 12]
				    if (run.length >= +Control_Panel.run_threshold) {

						// Splice unfitting run values if needed: Check forward and backward. Ex: [8, 7, 6, 5 ... 3, 2], or [2, 3, 4, 5 ... 7, 8]
				    	var verify_forward = verifyRun(run.slice().sort(), 1, 0);
				    	var verify_backward = verifyRun(run.slice().sort().reverse(), 0, 1);

				    	if (verify_forward.length >= +Control_Panel.run_threshold) {
				    		runsBySuit[suit] = verify_forward;
				    		return verify_forward;
				    	} else if (verify_backward.length >= +Control_Panel.run_threshold) {
				    		runsBySuit[suit] = verify_backward;
				    		return verify_backward;
				    	} else {
				    		return [];
				    	}

				    } else {
				    	return [];
				    }

				    function verifyRun (run, j, k) {
				    	for (var i = 0; i < run.length; i++) {
				    		if ((i < run.length-1) && (run[i+j] - run[i+k] !== 1)) {
				    			run.splice(i+1, run.length);
			    				return run;
					    	}	
				    	}
				    	return run;
				    }

				}).filter(function (run) { return run.length });			
				
				// Set the valueSet of a card as Meld, Run, or Deadwood
				cards.forEach(function (card) {
					if ((meldValues.length && meldValues.indexOf(card.value.toString()) > -1)) {
						card.valueSet = 'meld';
					} else if (runs.length && runCheck(runsBySuit, card)) {
						card.valueSet = 'run';
					} else {
						card.valueSet = 'deadwood';
					}
				});
				return {
					melds : meldValues,
					runs : runs
				}		
			};

			// Check if card value equals any of the values in a suit's run 
			function runCheck (run_values_by_suit, card) {
				for (var suit in run_values_by_suit) {
					return (run_values_by_suit[suit].indexOf(card.value) !== -1);
				}
			}

			function createPlayers () {

				var player = new Player(table.tableCanvas, {
					id : 1,
					x : table.w/2,
					y : 100,
					name : 'MainPlayer',
					isOpponent : false,
					isDealer : true
				});

				var computer = new Player(table.tableCanvas, {
					id : 2,
					x : table.w/2,
					y : table.h-100,					
					name : 'Computer',
					isOpponent : true,
					isDealer : false
				});

				return {
					player : player,
					cpu : computer
				}

			};			

			function createDeck () {
				var deck = [],
				 	counter = 0;

				for (var i = 0; i < suits.length; i++) {
					for (var j = 0; j < values.length; j++) {

						var alts = checkAlternates(values[j]);
						var args = {
							id : ++counter,
							suit_image : suits[i]+alts.image,
							suit : suits[i],
							name : alts.name,
							value : values[j],
							x : ((table.w/2)-100),
							y : (table.h/2)-100, 
							scale : 5,
							isDrawable : false,
							isThrowable : false,
							current_deck : 'in_deck'
						};
						deck.push(new Card(api, table.tableCanvas, args));
					}
				}
				return deck;
			};

			api.initializeHandlers = function() {

				$('#deal').click(function (e) {
					$(this).hide();
					api.deal();
				});

				$('#enable_AI').click(function (e) {
					if ($(this).html() === 'Enable AI game') {
						$(this).html('Disable AI game');	
						$('#deal').show();
						Control_Panel.ai_game = true;
					} else {
						$(this).html('Enable AI game');	
						Control_Panel.ai_game = false;
						$('#deal').hide();
					}
					api.reset();
				});

				$('#show_AI_hand').click(function (e) {
					if ($(this).html() === 'Show AI hand') {
						$(this).html('Hide AI hand');
						Control_Panel.show_AI_hand = true;
						api.players.cpu.cards.forEach(function (card) {
							card.shape_image.show();
						});
					} else {
						$(this).html('Show AI hand');	
						Control_Panel.show_AI_hand = false;
						api.players.cpu.cards.forEach(function (card) {
							card.shape_image.hide();
						});
					}
				});

				$('#run_threshold').change(function (e) {
					Control_Panel.run_threshold = $(this).val();
				});

				$('#meld_threshold').change(function (e) {
					Control_Panel.meld_threshold = $(this).val();
				});

				$('#speed').change(function (e) {
					Control_Panel.speed = $(this).val();
				});
			};

			function shuffleDeck (array) {
				for(var j, x, i = array.length; i; j = Math.floor(Math.random() * i), x = array[--i], array[i] = array[j], array[j] = x);
				return array;
			};

			// Check alternate names for playing card images
			function checkAlternates (value) {
				var name = null,
					image = '';

				switch (value) {
					case 1:
						name = names[0];
						break;
					case 11: 
						name = names[1];
						image = 2;
						break;
					case 12:
						name = names[2];
						image = 2;
						break;
					case 13:
						name = names[3];
						image = 2;
						break;
					default:
						name = value.toString()
				}

				return {
					name : name,
					image : image
				};

			};

			// expose API
			return api;
		})();
	})();	

	(function () {
		Rummy.Manager.init();
	})();

});