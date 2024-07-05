/**
 * 
 * @param {number} mapHeight map height in tiles
 * @param {number} mapWidth  map width in tiles
 * @param {number} groundLevel 
 * 
 * @returns {string[]} A p5play tile map
 */
function mapGenerator(mapHeight, mapWidth, groundLevel = 8) {
	let ans = [];
	for (let i = 0; i < mapHeight - groundLevel; i++) {
		ans.push(new Array(mapWidth).fill(' '));
	}

	for (let i = mapHeight - groundLevel; i < mapHeight; i++) {
		ans.push(new Array(mapWidth).fill('d'));
	}

	// set noise for caverns
	for (let i = mapHeight - groundLevel; i < mapHeight - (groundLevel / 2); i++) {
		for (let j = 0; j < mapWidth; j++) {
			const value = noise(j / 8, i / 4);
			const range = value > 0.4 && value < 1;
			if (range) {
				ans[i][j] = ' '
			}
		}
	}

	// set grass
	for (let i = 2; i < mapHeight; i++) {
		for (let j = 0; j < mapWidth; j++) {
			if (ans[i][j] === 'd' && ans[i - 1][j] === ' ' && ans[i - 2][j] === ' ') {
				ans[i][j] = 'g';
			}
		}
	}

	// set grass
	for (let i = 2; i < mapHeight; i++) {
		for (let j = 0; j < mapWidth; j++) {
			if (
				random(1) > 0.8 &&
				ans[i][j] === 'g' &&
				ans[i][j - 1] === 'g' &&
				ans[i][j + 1] === 'g' &&
				ans[i - 1][j] === ' ' &&
				ans[i - 2][j] === ' ') {
				ans[i - 1][j] = random(1) > 0.5 ? 'l' : 'f';
			}
		}
	}

	// set bush
	for (let i = 2; i < mapHeight; i++) {
		for (let j = 0; j < mapWidth; j++) {
			if (
				random(1) > 0.93 &&
				ans[i][j] === 'g' &&
				ans[i][j - 1] === 'g' &&
				ans[i][j + 1] === 'g' &&
				ans[i - 1][j] === ' ' &&
				ans[i - 2][j] === ' ') {
				ans[i - 1][j] = 's';
			}
		}
	}

	// set coin
	for (let i = 2; i < mapHeight; i++) {
		for (let j = 0; j < mapWidth; j++) {
			if (
				random(1) > 0.33 &&
				ans[i][j] === 'g' &&
				ans[i][j - 1] === 'g' &&
				ans[i][j + 1] === 'g' &&
				ans[i - 1][j] === ' ' &&
				ans[i - 2][j] === ' ') {
				ans[i - 1][j] = 'c';
			}
		}
	}

	// // set tree
	// for (let i = 2; i < mapHeight; i++) {
	// 	for (let j = 0; j < mapWidth; j++) {
	// 		if (
	// 			random(1) > 0.89 &&
	// 			ans[i][j] === 'g' &&
	// 			ans[i][j - 1] === 'g' &&
	// 			ans[i][j + 1] === 'g' &&
	// 			ans[i - 1][j] === ' ' &&
	// 			ans[i - 2][j] === ' ' &&
	// 			ans[i - 3][j] === ' ' &&
	// 			ans[i - 4][j] === ' ') {
	// 			ans[i - 1][j] = 't'; // implement t as tree root tile
	// 			ans[i - 2][j] = 'y'; // implement y as tree middle tile
	// 			ans[i - 3][j] = 'u'; // implement u as tree top tile
	// 		}
	// 	}
	// }

	return ans.map(row => row.join(''));
}