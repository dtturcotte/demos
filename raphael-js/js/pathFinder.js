document.addEventListener("DOMContentLoaded", function(event) {

	(function () {
		GlobalObject.PathFinder = GlobalObject.PathFinder || {};

		GlobalObject.PathFinder = (function () {
			var api = {},
				pathCanvas = null,
				nodeList = [],
				openList = [],
				closedList = [],
				grid = null,
				selectedType = {};


			api.init = function () {
				pathCanvas = new Raphael(document.getElementById("pathCanvas"), 500, 700);

				grid = this.createGrid();

				var wall = new Legend('wall', 190, 600, 50, 50, 'gray');
				var start = new Legend('start', 250, 600, 50, 50, 'green');
				var end = new Legend('end', 310, 600, 50, 50, 'red');

			};

			api.setGridLocations = function (gridLoc) {
				document.getElementById("startSearch").addEventListener("click", this.startSearch.bind(this, gridLoc), false);
			};

			/*
				Start Search
			 */
			api.startSearch = function (gridLoc) {

				var row = gridLoc[0];
				var col = gridLoc[1];

				//while (openList.length > 0) {

					api.a_star(grid, row, col);

					//row += 1;
					//api.a_star(grid, row, col);
					//row += 1;
					//api.a_star(grid, row, col);
				//}
			};

			api.createGrid = function () {
				var grid = [];
				var x = 50;
				var y = 50;
				for (var i = 0; i < 10; i++) {
					grid[i] = [];
					for (var j = 0; j < 10; j++) {
						grid[i][j] = new Cell([i, j], 'open', x, y, 50, 50, 'white');
						x+=50;
					}
					x = 50;
					y+=50;
				}
				return grid;
			};

			api.isLegal = function(cell) {
				return cell.type !== 'wall';
			};

			api.markExplored = function(cell) {
				cell.type = 'explored';
				cell.shape.attr('fill', 'cyan');
				openList.push(cell);
			};


			api.calculate_F_Cost = function (row, col) {
				/*
					F = G + H
				 		G = the movement cost to move from the starting point A to a given square on the grid, following the path generated to get there.
				 		H = the estimated movement cost to move from that given square to final destination

					Want to move to square with lowest F cost
				 */


				//for (var i = 0; i < openList.length; i++) {
				//	openList[i].g_cost += 10;
				//	openList[i].set[2].attr('text', openList[i].g_cost);
				//}


				//var
				//
				//var g = function () {
				//
				//};
				//
				//var h = function () {
				//
				//};
				//
				//return g + h;


				//cell.g_cost



			};

			api.a_star = function (matrix, row, col) {

				var parentSquare = matrix[row][col];

				/*
					Cardinals
				 */
					//west = matrix[row][col-1],
					//east = matrix[row][col+1],
					//north = matrix[row-1][col],
					//south = matrix[row+1][col],

				/*
					 Diagonals
				 */
					//top_left = matrix[row-1][col-1],
					//top_right = matrix[row-1][col+1],
					//bottom_left = matrix[row+1][col-1],
					//bottom_right = matrix[row+1][col+1];


				//if (west.type === 'open' && this.isLegal(west)) {
				//	this.markExplored(west);
				//	//this.calculate_F_Cost(matrix);
				//}
				//if (east.type === 'open' && this.isLegal(east)) {
				//	this.markExplored(east);
				//	//this.calculate_F_Cost(matrix);
				//}
				//if (north.type === 'open' && this.isLegal(north)) {
				//	this.markExplored(north);
				//	//this.calculate_F_Cost(matrix);
				//}
				//if (south.type === 'open' && this.isLegal(south)) {
				//	this.markExplored(south);
				//	//this.calculate_F_Cost(south);
				//}
				//if (top_left.type === 'open' && this.isLegal(top_left)) {
				//	this.markExplored(top_left);
				//	//this.calculate_F_Cost(top_left);
				//}
				//if (top_right.type === 'open' && this.isLegal(top_right)) {
				//	this.markExplored(top_right);
				//	//this.calculate_F_Cost(top_right);
				//}
				//if (bottom_left.type === 'open' && this.isLegal(bottom_left)) {
				//	this.markExplored(bottom_left);
				//	//this.calculate_F_Cost(bottom_left);
				//}
				//if (bottom_right.type === 'open' && this.isLegal(bottom_right)) {
				//	this.markExplored(bottom_right);
				//	//this.calculate_F_Cost(bottom_right);
				//}

				if (parentSquare.type !== 'start') {
					parentSquare.shape.attr('fill', 'purple');
					parentSquare.type = 'parent square';
				}

				parentSquare.shape.attr('stroke', 'red');

				openList.shift();

				this.calculate_F_Cost(row, col);

				closedList.push(parentSquare);
			};

			var Legend = function (type, x, y, w, h, color) {
				this.type = type;
				var that = this;
				this.set = pathCanvas.set();

				this.x = x || 0;
				this.y = y || 0;
				this.w = w || 50;
				this.h = h || 50;

				this.shape = pathCanvas.rect(this.x, this.y, this.w, this.h);
				this.shape.attr('cursor', 'pointer');

				this.label = pathCanvas.text(x + 15, y + 15, this.type);
				this.set.push(this.shape, this.label);
				this.label.attr({
					'font-size': 15,
					'fill': "white"
				});

				this.color = color;
				this.shape.attr("fill", color);
				this.shape.attr("fill-opacity", 1);
				this.shape.attr("stroke-width", 2);
				this.shape.attr("stroke", "black");

				this.set[0].node.onclick = function () {
					selectedType = {
						type : that.type,
						color : that.color
					};
				};
			};

			var Cell = function (gridLoc, type, x, y, w, h, color) {
				this.type = type;
				var that = this;

				if (this.type === 'start') {

					openList.push(this);
				}

				this.set = pathCanvas.set();
				this.x = x || 0;
				this.y = y || 0;
				this.w = w || 50;
				this.h = h || 50;

				this.f_cost = 0;
				this.h_cost = 0;
				this.g_cost = 0;

				this.shape = pathCanvas.rect(this.x, this.y, this.w, this.h);
				this.gridLoc = gridLoc;
				//this.text = rertCanvas.text(x+15, y+15, '[' + name[0] + ', ' + name[1] + ']');

				this.shape.attr('cursor', 'pointer');

				this.f_text = pathCanvas.text(x + 10, y + 15, this.f_cost);
				this.h_text = pathCanvas.text(x + 10, y + 40, this.h_cost);
				this.g_text = pathCanvas.text(x + 40, y + 40, this.g_cost);

				this.set.push(this.shape, this.f_text, this.h_text, this.g_text);
				this.f_text.attr({
					'font-size': 10,
					'fill': "black"
				});
				this.h_text.attr({
					'font-size': 10,
					'fill': "black"
				});
				this.g_text.attr({
					'font-size': 10,
					'fill': "black"
				});

				this.color = color;
				this.shape.attr("fill", color);
				this.shape.attr("fill-opacity", 1);
				this.shape.attr("stroke-width", 2);
				this.shape.attr("stroke", "black");

				this.set[0].node.onclick = function () {
					if (selectedType) {
						that.type = selectedType.type;
						that.shape.attr('fill', selectedType.color);
						api.setGridLocations(gridLoc);
					}
				};
			};

			var Node = function (name, x, y, color) {
				this.set = pathCanvas.set();
				this.shape = pathCanvas.circle(x, y, 10);
				this.x = x || 0;
				this.y = y || 0;
				this.name = name;
				this.text = pathCanvas.text(x, y - 15, this.name + ': (' + x + ', ' + y + ')');
				this.text.attr({
					'font-size': 10,
					'fill': "black"
				});
				this.color = color;
				this.shape.attr("fill", color);
				this.shape.attr("fill-opacity", 1);
				this.shape.attr("stroke-width", 2);
				this.shape.attr("stroke", "#acff66");
				this.set.push(this.shape, this.text);
			};

			return api;

		})();
	})();

	(function () {
		GlobalObject.PathFinder.init();
	})();

});
