/* global WordCloud */
function makeCloud() {
	const main = document.querySelector('main');
	const canvas = document.createElement('canvas');
	canvas.id = 'canvas_cloud';
	canvas.style = 'position:absolute;top:0;left:0;right:0;bottom:0;';
	main.appendChild(canvas);

	const arr6 = [
		['Pear', '9'],
		['Grape', '9'],
		['Pine', '4'],
		['Banana', '6'],
		['Lemon', '9'],
		['Parigi', '5'],
		['Apple', '5'],
		['Mear', '4'],
		['Torino', '4'],
		['Mescola', '8'],
		['Gigi', '6'],
		['Roma', '9'],
		['Empoli', '5'],
		['Mela', '5'],
		['Alessandro', '9'],
		['Imola', '4'],
		['Hp', '4'],
		['Harry', '6'],
		['Potter', '9'],
		['Amsterdam', '5'],
		['Como', '5'],
	];
	const options = {

		list: arr6,
		gridSize: Math.round(2 * document.getElementById('canvas_cloud').offsetWidth / 1024),
		weightFactor(size) {
			return size ** 2 * document.getElementById('canvas_cloud').offsetWidth / 1024;
		},
	};

	WordCloud(document.getElementById('canvas_cloud'), options);
}
setTimeout(() => {
	makeCloud();
}, 5000);