let level1 = [
	'                                 ',
	'                                 ',
	'                                 ',
	'                                 ',
	'                                 ',
	'                                 ',
	'                   ^             ',
	'                 gggggggg        ',
	'      ccc          ddd           ',
	'     gggg b ccc    b b     b     ',
	'gggggddddgggggg   ggggggggggggggg',
	'ddddddddddddddd   ddddddddddddddd',
	'dddddddddddddddcccddddddddddddddd',
	'ddddddddddddddddddddddddddddddddd',
	'ddddddddddddddddddddddddddddddddd',
	'ddddddddddddddddddddddddddddddddd',
	'ddddddddddddddddddddddddddddddddd',
	'ddddddddddddddddddddddddddddddddd',
];

function preload() {
	playerSheet = loadImage('assets/sprites/knight.png');
	blockSheet = loadImage('assets/sprites/world_tileset.png');
	coinSheet = loadImage('assets/sprites/coin.png');
}

function setup() {
	new Canvas(innerWidth/4, innerHeight/4, "pixelated x4");
	allSprites.pixelPerfect = true;

	player = new Sprite();
	player.color = 'red';
	player.x = width / 2;
	player.y = 0;
	player.w = 14;
	player.h = 13;
	player.anis.offset.y = -4 
	player.rotationLock = true;
	player.spriteSheet = playerSheet;
	player.addAni({ w:32, h:32, col:0, row:0, frames:4 });
	player.friction = 1;
	
	player.coins = 0;

	// BLOC DE GAZON
	grass = new Group();
	grass.collider = 'static';
	grass.w = 15;
	grass.h = 16;
	grass.tile = 'g';
	grass.spriteSheet = blockSheet;
	grass.addAni({ w:16, h:16, col:0, row:0 });
	grass.friction = 1;

	// BLOC DE TERRE
	dirt = new Group();
	dirt.collider = 'static';
	dirt.w = 15;
	dirt.h = 16;
	dirt.tile = 'd';
	dirt.spriteSheet = blockSheet;
	dirt.addAni({ w:16, h:16, col:0, row:1 });
	dirt.friction = 1;

	buisson = new Group();
	buisson.collider = 'none';
	buisson.w = 15;
	buisson.h = 16;
	buisson.tile = 'b';
	buisson.spriteSheet = blockSheet;
	buisson.addAni({ w:16, h:16, col:1, row:3 });
	buisson.friction = 1;

	bouncepad = new Group();
	bouncepad.collider = 'static';
	bouncepad.w = 15;
	bouncepad.h = 16;
	bouncepad.tile = '^';
	bouncepad.spriteSheet = blockSheet;
	bouncepad.addAni({ w:16, h:16, col:7, row:6 });
	bouncepad.friction = 1;

	coins = new Group();
	coins.collider = 'none';
	coins.w = 15;
	coins.h = 16;
	coins.tile = 'c';
	coins.spriteSheet = coinSheet;
	coins.addAni({ w:16, h:16, col:0, row:0, frames:12 });

	tiles = new Tiles(level1, 0, 0, 16, 16);
	
	world.gravity.y = 9.81;
}

function draw() {
	background(110, 180, 255);

	// Camera suivre joueur
	camera.x = player.x;
	camera.y = player.y;

	// Prendre les sous
	for (let coin of coins) {
		if (player.overlaps(coin)) {
			coin.remove();
			player.coins = player.coins + 1; 
		}
	}

	// Code du bouncepad
	if (player.colliding(bouncepad)) {
		player.vel.y = -5;
	}

	// Code pour sauter
	if (player.colliding(tiles)) {
		if (kb.pressing('up')) {
			player.vel.y = -3;
		}
	}

	// Aller a gauche
	if (kb.pressing('left')) {
		player.vel.x = -3;
		player.mirror.x = true;
	}

	// Aller a droite
	if (kb.pressing('right')) {
		player.vel.x = 3;
		player.mirror.x = false;
	}

	text("coins: " + player.coins, 5, 14);
}
