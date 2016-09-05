module.exports = {
	paths : {
		controllers: '../../app/controllers/',
		views: 'app/views',
		build: 'build'
	},
	static : {
		author : 'daniel turcotte',
		nav: [
			{
				display : 'hello',
				link : '/about'
			},
			{
				display : 'work',
				link : '/work'
			},
			{
				display : 'skills',
				link : '/skills'
			},
			{
				display : 'contact',
				link : '/contact'
			}
		]
	}
};
