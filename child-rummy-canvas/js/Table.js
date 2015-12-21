document.addEventListener("DOMContentLoaded", function(event) {

	/*
		Only responsible for handling view
	*/
	(function () {
		Rummy.Table = Rummy.Table || {};

		Rummy.Table = (function () {
			var api = {};

			api.init = function (name, w, h) {
				this.w = w;
				this.h = h
				this.tableCanvas = new Raphael(name, this.w, this.h);
			};

			api.getTable = function () {
				return this;
			};
			
			return api;
		})();
	})();	

	(function () {
		Rummy.Table.init('Table', 1000, 1000);
	})();

});