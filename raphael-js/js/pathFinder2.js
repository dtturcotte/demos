document.addEventListener("DOMContentLoaded", function(event) {

	(function () {
		GlobalObject.PathFinder = GlobalObject.PathFinder || {};

		GlobalObject.PathFinder = (function () {
			var api = {},
				pathCanvas = null,
				selectedType = {};

			api.init = function () {
				pathCanvas = new Raphael(document.getElementById("pathCanvas"), 600, 700);

				this.grids = this.createGrid();

				this.grid = new PF.Grid(this.grids[0]);
				this.nodeGrid = this.grids[1];

				var finder = new PF.AStarFinder();
				var path = finder.findPath(1, 4, 7, 4, this.grid);

				/*
					- path is returning array of X,Y coordinates
					- nodeGrid's values are in grid[y, x]...

					So I need to swap them when filling the path
				 */

				for (var i = 0; i < path.length; i++) {
					this.nodeGrid[path[i][1]][path[i][0]].shape.attr('fill', 'cyan');
				}
			};

			api.setGridLocations = function (gridLoc) {
				document.getElementById("startSearch").addEventListener("click", this.startSearch.bind(this, gridLoc), false);
			};

			api.createGrid = function () {
				var grid = [];
				var nodeGrid = [];
				var xLoc = 50;
				var yLoc = 50;

				for (var y = 0; y < 10; y++) {
					grid[y] = [];
					nodeGrid[y] = [];
					for (var x = 0; x < 10; x++) {
						var type = 'walkable';
						var val = 0;
						if (x === 1 && y === 5) {
							type = 'start';
						} else if (x === 7 && y === 5) {
							type = 'end';
						} else if (x === 4 && (y === 3 || y === 4 || y === 5 || y === 6)) {
							type = 'unwalkable';
							val = 1;
						}
						nodeGrid[y][x] = new Cell(val, [x, y], type, xLoc, yLoc, 50, 50);
						grid[y][x] = val;
						xLoc+=50;
					}
					xLoc = 50;
					yLoc +=50;
				}

				return [
					grid,
					nodeGrid
				];
			};


			var Cell = function (val, gridLoc, type, x, y, w, h) {
				this.type = type;
				var that = this;
				var color = 'white';

				if (this.type === 'start') {
					color = 'green';
				} else if (this.type === 'end') {
					color = 'red';
				} else if (this.type === 'unwalkable') {
					color = 'blue';
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

				this.text = pathCanvas.text(x + 20, y + 15, '(' + gridLoc[0] + ', ' + gridLoc[1] + ')');
				this.text2 = pathCanvas.text(x + 25, y + 30, val);

				this.set.push(this.shape, this.text, this.text2);
				this.text.attr({
					'font-size': 10,
					'fill': "black"
				});

				var fill = 'blue';
				if (type === 'unwalkable') {
					fill = 'orange'
				}
				this.text2.attr({
					'font-size': 10,
					'fill': fill
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
