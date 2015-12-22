

function testHand (hand) {
	var hands = {

		/*
			Winning Hand: 
				Spades 	: [2, 3, 4, 5], 
				7 		: ['Spades', 'Hearts', 'Clubs']
		*/		
		winning_hand : [
			{
				id : 1,
				suit : 'spades',
				name : '2',
				value : 2,
				valueSet : 'deadwood',
				image : 'Playing Cards/SVG-cards-1.3/2_of_spades.svg'
			},
			{
				id : 2,
				suit : 'spades',
				name : '3',
				value : 3,
				valueSet : 'deadwood',
				image : 'Playing Cards/SVG-cards-1.3/3_of_spades.svg'
			},
			{
				id : 3,
				suit : 'spades',
				name : '4',
				value : 4,
				valueSet : 'deadwood',
				image : 'Playing Cards/SVG-cards-1.3/4_of_spades.svg'
			},
			{
				id : 4,
				suit : 'spades',
				name : '5',
				value : 5,
				valueSet : 'deadwood',
				image : 'Playing Cards/SVG-cards-1.3/5_of_spades.svg'
			},
			{
				id : 5,
				suit : 'hearts',
				name : '7',
				value : 7,
				valueSet : 'deadwood',
				image : 'Playing Cards/SVG-cards-1.3/7_of_hearts.svg'
			},
			{
				id : 6,
				suit : 'clubs',
				name : '7',
				value : 7,
				valueSet : 'deadwood',
				image : 'Playing Cards/SVG-cards-1.3/7_of_clubs.svg'
			},
			{
				id : 7,
				suit : 'spades',
				name : '7',
				value : 7,
				valueSet : 'deadwood',
				image : 'Playing Cards/SVG-cards-1.3/7_of_spades.svg'
			}																														
		],

		/*
			Shared Hand: Shared card is 5 of Spades among both sets
				Spades 	: [2, 3, 4, 5], 
				5 		: ['Spades', 'Hearts', 'Clubs']
		*/			
		shared_set : [
			{
				id : 1,
				suit : 'spades',
				name : '2',
				value : 2,
				valueSet : 'deadwood',
				image : 'Playing Cards/SVG-cards-1.3/2_of_spades.svg'
			},
			{
				id : 2,
				suit : 'spades',
				name : '3',
				value : 3,
				valueSet : 'deadwood',
				image : 'Playing Cards/SVG-cards-1.3/3_of_spades.svg'
			},
			{
				id : 3,
				suit : 'spades',
				name : '4',
				value : 4,
				valueSet : 'deadwood',
				image : 'Playing Cards/SVG-cards-1.3/4_of_spades.svg'
			},
			{
				id : 4,
				suit : 'spades',
				name : '5',
				value : 5,
				valueSet : 'deadwood',
				image : 'Playing Cards/SVG-cards-1.3/5_of_spades.svg'
			},
			{
				id : 5,
				suit : 'hearts',
				name : '5',
				value : 5,
				valueSet : 'deadwood',
				image : 'Playing Cards/SVG-cards-1.3/5_of_hearts.svg'
			},
			{
				id : 6,
				suit : 'clubs',
				name : '5',
				value : 5,
				valueSet : 'deadwood',
				image : 'Playing Cards/SVG-cards-1.3/5_of_clubs.svg'
			},
			{
				id : 7,
				suit : 'diamonds',
				name : '11',
				value : 11,
				valueSet : 'deadwood',
				image : 'Playing Cards/SVG-cards-1.3/jack_of_diamonds2.svg'
			}																			
		],

		/*
			Invalid Run Test: Runs must be of same suit
				Run : [2, 3, 4, 5] of Clubs, Diamonds, Clubs, Hearts
				Ace : ['Hearts', 'Clubs', 'Diamonds']
		*/			
		invalid_run : [
			{
				id : 1,
				suit : 'clubs',
				name : '2',
				value : 2,
				valueSet : 'deadwood',
				image : 'Playing Cards/SVG-cards-1.3/2_of_clubs.svg'
			},
			{
				id : 2,
				suit : 'diamonds',
				name : '3',
				value : 3,
				valueSet : 'deadwood',
				image : 'Playing Cards/SVG-cards-1.3/3_of_diamonds.svg'
			},
			{
				id : 3,
				suit : 'clubs',
				name : '4',
				value : 4,
				valueSet : 'deadwood',
				image : 'Playing Cards/SVG-cards-1.3/4_of_clubs.svg'
			},
			{
				id : 4,
				suit : 'hearts',
				name : '5',
				value : 5,
				valueSet : 'deadwood',
				image : 'Playing Cards/SVG-cards-1.3/5_of_hearts.svg'
			},
			{
				id : 5,
				suit : 'hearts',
				name : 'ace',
				value : 1,
				valueSet : 'deadwood',
				image : 'Playing Cards/SVG-cards-1.3/ace_of_hearts.svg'
			},
			{
				id : 6,
				suit : 'clubs',
				name : 'ace',
				value : 1,
				valueSet : 'deadwood',
				image : 'Playing Cards/SVG-cards-1.3/ace_of_clubs.svg'
			},
			{
				id : 7,
				suit : 'diamonds',
				name : 'ace',
				value : 1,
				valueSet : 'deadwood',
				image : 'Playing Cards/SVG-cards-1.3/ace_of_diamonds.svg'
			}																			
		]							
	};

	return hands[hand];
}