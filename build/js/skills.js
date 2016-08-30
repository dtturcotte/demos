
$(document).ready(function () {

	var filter_tags = tags.filter(function (t) {
		return t.type === 'skill';
	});

	var tag_names = filter_tags.map(function (t) {
		return t.name;
	});

	var ctx = $("#chart");
	var myChart = new Chart(ctx, {
		type: 'bar',
		data: getData(tag_names, filter_tags),
		options: getOptions()
	});

	function getOptions() {
		return {
			legend : {
				display : false
			},
			responsive: true,
			maintainAspectRatio: false,
			scales: {
				gridLines : {
					display : false,
					zeroLineWidth : 0
				},
				xAxes: [{
					stacked: true
				}],
				yAxes: [{
					stacked: true,
					ticks: {
						max: 10,
						min: 0,
						stepSize: 5
					}
				}]
			}
		}
	}

	function getData(tag_names, filter_tags) {

		var data_obj = {
			labels: tag_names,
			datasets: [
				{
					label: "Dev Skills",
					backgroundColor: [],
					borderColor: [],
					borderWidth: 1,
					data: []
				}
			]
		};

		filter_tags.forEach(function (t) {
			data_obj.datasets[0].backgroundColor.push(t.colors.background);
			data_obj.datasets[0].borderColor.push(t.colors.border);
			data_obj.datasets[0].data.push(t.strength);
		});

		return data_obj;
	}
});
