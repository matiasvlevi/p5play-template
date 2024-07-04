let map1 = [
	'                               ',
	'                               ',
	'                               ',
	'                               ',
	'                               ',
	'              ccF              ',
	'             ggggg  S          ',
	'                   gg          ',
	'            F        gg        ',
	'      c    gg    gg      S  P  ',
	'     ggg       ggddgH    gg gH ',
	'    gdddg           H  dddd dH ',
	'   gddddg      F    H        H ',
	'  cc    Fc     ggg  H  ccccc H ',
	'gggg   ggggg        H  gggggggg',
	'ddddgggdddddggccFcccgggdddddddd',
	'ddddddddddddddggggggddddddddddd',
	'ddddddddddddddddddddddddddddddd',
	'ddddddddddddddddddddddddddddddd',
	'ddddddddddddddddddddddddddddddd',
	'ddddddddddddddddddddddddddddddd',
	'ddddddddddddddddddddddddddddddd',
	'ddddddddddddddddddddddddddddddd',
	'ddddddddddddddddddddddddddddddd'
]

let map2 = [
	'                               ',
	'                               ',
	'                               ',
	'                               ',
	'                               ',
	'              cc               ',
	'             ggggg             ',
	'                   gg          ',
	'                P    gg        ',
	'      c    ggHggggg            ',
	'             H                 ',
	'             H                 ',
	'gggg   ggggg H      H  gggggggg',
	'ddddgggdddddggccccccgggdddddddd',
	'ddddddddddddddggggggddddddddddd',
	'ddddddddddddddddddddddddddddddd',
	'ddddddddddddddddddddddddddddddd',
	'ddddddddddddddddddddddddddddddd',
	'ddddddddddddddddddddddddddddddd',
	'ddddddddddddddddddddddddddddddd',
	'ddddddddddddddddddddddddddddddd',
	'ddddddddddddddddddddddddddddddd'
]


function mapGenerator(ymax, xmax, groundLevel = 8) {
	let ans = [];
	for (let i = 0; i < ymax - groundLevel; i++) {
		ans.push(new Array(xmax).fill(' '));
	}

	for (let i = ymax - groundLevel; i < ymax; i++) {
		ans.push(new Array(xmax).fill('d'));
	}

	// set noise for caverns
	for (let i = ymax - groundLevel; i < ymax - (groundLevel / 2); i++) {
		for (let j = 0; j < xmax; j++) {
			const value = noise(j / 8, i / 4);
			const range = value > 0.4 && value < 1;
			if (range) {
				ans[i][j] = ' '
			}
		}
	}

	// set grass
	for (let i = 2; i < ymax; i++) {
		for (let j = 0; j < xmax; j++) {
			if (ans[i][j] === 'd' && ans[i - 1][j] === ' ' && ans[i - 2][j] === ' ') {
				ans[i][j] = 'g';
			}
		}
	}

	// set grass
	for (let i = 2; i < ymax; i++) {
		for (let j = 0; j < xmax; j++) {
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
	for (let i = 2; i < ymax; i++) {
		for (let j = 0; j < xmax; j++) {
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
	for (let i = 2; i < ymax; i++) {
		for (let j = 0; j < xmax; j++) {
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

	// set ladder

	// const MAXLADDER = 5;
	// for (let i = MAXLADDER; i < ymax; i++) {
	// 	for (let j = 0; j < xmax-1; j++) {
			
	// 		if (ans[i][j] === 'g') {
	// 			let k = 1;
	// 			while(k < MAXLADDER && (
	// 				ans[i-k][j+1] !== 'g'
	// 			)){
	// 				k++;
	// 			}
	// 			if (k > 3 && ans[i-k][j+1] !== 'g') {
	// 				for(let l = 1; l < k; l++) {
	// 					ans[i - l][j+1] = 'H'
	// 				}
	// 			}
	// 		}
	// 	}
	// }


	// set tree
	for (let i = 2; i < ymax; i++) {
		for (let j = 0; j < xmax; j++) {
			if (
				random(1) > 0.89 &&
				ans[i][j] === 'g' &&
				ans[i][j - 1] === 'g' &&
				ans[i][j + 1] === 'g' &&
				ans[i - 1][j] === ' ' &&
				ans[i - 2][j] === ' ' &&
				ans[i - 3][j] === ' ' &&
				ans[i - 4][j] === ' ') {
				ans[i - 1][j] = 't';
				ans[i - 2][j] = 'y';
				ans[i - 3][j] = 'u';
			}
		}
	}


	return ans.map(row => row.join(''));
}