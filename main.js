

// Load assets before setup
function preload() {
	// Load fonts
	font = loadFont('assets/fonts/PixelOperator8.ttf');

	// Load images
	worldTiles = loadImage('assets/sprites/world_tileset.png');
	coinSprite = loadImage('assets/sprites/coin.png');
	playerSheet = loadImage('assets/sprites/knight.png');
	slimeSheet = loadImage('assets/sprites/slime_purple.png');
	fruitSheet = loadImage('assets/sprites/fruit.png')
}

function setup() {
	// Create the canvas in a "pixelated" mode, you can also try x2
	new Canvas(innerWidth / 4, innerHeight / 4, 'pixelated x4');

	// Needed for pixeladed sprites
	allSprites.pixelPerfect = true;

	// 
	world.gravity.y = 9.81;

	// Groups for Tile maps
	ladder = new Group();
	ladder.collider = 'none';
	ladder.spriteSheet = worldTiles;
	ladder.addAni({ w: 16, h: 16, row: 4, col: 7 });
	ladder.offset.y = 0;
	ladder.height = 12;
	ladder.tile = 'H';

	dirt = new Group();
	dirt.collider = 'static';
	dirt.bounciness = 0.1;
	dirt.friction = 0.1;
	dirt.drag = 0;
	dirt.spriteSheet = worldTiles;
	dirt.addAni({ w: 16, h: 16, row: 1, col: 0 });
	dirt.tile = 'd';

	grass = new Group();
	grass.collider = 'static';
	grass.bounciness = 0.1;
	grass.friction = 0.1;
	grass.drag = 0;
	grass.spriteSheet = worldTiles;
	grass.addAni({ w: 16, h: 16, row: 0, col: 0 });
	grass.tile = 'g';

	coins = new Group();
	coins.collider = 'none';
	coins.bounciness = 0.1;
	coins.friction = 0.1;
	coins.drag = 0;
	coins.spriteSheet = coinSprite;
	coins.addAni({ w: 16, h: 16, row: 0, frames: 12 });
	coins.tile = 'c';

	fruits = new Group();
	fruits.collider = 'none';
	fruits.bounciness = 0.1;
	fruits.friction = 0.1;
	fruits.drag = 0;
	fruits.spriteSheet = fruitSheet;
	fruits.addAni({ w: 16, h: 16, row: 3, col: 1 });
	fruits.tile = 'F';

	flower = new Group();
	flower.collider = 'none';
	flower.spriteSheet = worldTiles;
	flower.addAni({ w: 16, h: 16, row: 6, col: 1 });
	flower.tile = 'f';

	flower2 = new Group();
	flower2.collider = 'none';
	flower2.spriteSheet = worldTiles;
	flower2.addAni({ w: 16, h: 16, row: 5, col: 1 });
	flower2.tile = 'l';

	flower3 = new Group();
	flower3.collider = 'none';
	flower3.spriteSheet = worldTiles;
	flower3.addAni({ w: 16, h: 16, row: 3, col: 1 });
	flower3.tile = 's';

	portal = new Group();
	portal.collider = 'none';
	portal.spriteSheet = worldTiles;
	portal.addAni({ w: 16, h: 16, row: 8, col: 1 });
	portal.tile = 'P';

	sign = new Group();
	sign.collider = 'none';
	sign.spriteSheet = worldTiles;
	sign.addAni({ w: 16, h: 16, row: 3, col: 8 });
	sign.tile = 'S';

	sign2 = new Group();
	sign2.collider = 'none';
	sign2.spriteSheet = worldTiles;
	sign2.addAni({ w: 16, h: 16, row: 3, col: 8 });
	sign2.tile = '9';

	// // Generate a procedural map
	// let proceduralMap = mapGenerator(18, 16 * 4, 16);

	// Use map1
	tiles = new Tiles(map1,
		0, 0,
		16, 16
	);

	// Player Sprite
	player = new Sprite(canvas.hw, -100);
	player.rotationLock = true;

	// hitbox
	player.width = 10;
	player.height = 14;

	// center the texture...
	player.anis.offset.y = -3;

	// Animations
	player.spriteSheet = playerSheet;
	player.addAnis({
		run: { w: 32, h: 32, row: 2, frames: 16 },
		roll: { w: 32, h: 32, row: 5, frames: 8, frameDelay: 4 },
		stand: { w: 32, h: 32, row: 0, frames: 4, frameDelay: 6 },
		hurt: { w: 32, h: 32, row: 6, frames: 4, frameDelay: 2 },
		dead: { w: 32, h: 32, row: 7, frames: 4, frameDelay: 16 },
		staydead: { w: 32, h: 32, row: 7, col: 3, frames: 1 }
	});

	// set default ani
	player.changeAni('stand');

	// Add custom props
	player.score = 0;
	player.lives = 3;
	player.dead = false;

	// custom jump props (optional, for jump edge cases, see below)
	player.jumpTimer = 0;
	player.jumpCoolDown = 40;

	// Enemy Sprite
	slime = new Sprite(canvas.hw + 300, -100);
	slime.rotationLock = true;

	// hitbox
	slime.width = 10;
	slime.height = 14;

	// center the texture...
	slime.anis.offset.y = -4;

	// Animations
	slime.spriteSheet = slimeSheet;
	slime.addAnis({
		stand: { w: 24, h: 24, row: 1, frames: 4, frameDelay: 6 },
		hurt: { w: 24, h: 24, row: 2, frames: 4, frameDelay: 9 }
	});

	// set default ani
	slime.changeAni('stand');
}

async function draw() {
	background(185, 217, 255);

	// different draw call for death screen
	if (player.dead) {
		await gameOver();
		return;
	}

	// Enemy behavior
	slime.moveTowards(player.x, undefined, 0.005);
	if (player.x < slime.x) {
		slime.mirror.x = true
	} else {
		slime.mirror.x = false
	}

	// Attach camera to player
	camera.x = player.x;
	camera.y = player.y;

	// Player Jump
	if (
		kb.pressing('up') &&
		player.colliding(tiles) &&
		player.jumpTimer >= player.jumpCoolDown // Cooldown is optional, added for edge cases
	) {
		player.bearing = -90;
		player.applyForce(45);
		player.jumpTimer = 0;
	} else {
		player.jumpTimer++;
	}

	// Player left/right controls
	if (kb.pressing('left')) {
		player.mirror.x = true;
		player.vel.x = -1.75;
		player.changeAni('run')
	} else if (kb.pressing('right')) {
		player.mirror.x = false;
		player.vel.x = 1.75;
		player.changeAni('run')
	} else {
		// Reset to idle animation

		// Do not override if in one these animation states:
		if (player.ani.name !== 'stand' &&
			player.ani.name !== 'hurt' &&
			player.ani.name !== 'roll'
		) {
			player.changeAni('stand')
		}
	}

	// Player roll mechanic
	if (kb.pressed('down')) {

		// Apply vel in current direction
		if (player.mirror.x == true) {
			player.vel.x = -5
		} else {
			player.vel.x = 5
		}

		await player.changeAni('roll');
		player.changeAni('stand');
	}

	// Player Ladder climb mechanic
	if (player.overlapping(ladder) && kb.pressing('up')) {
		player.move(1, 'up', 1);
	}

	// Player Shoot projectiles
	if (kb.pressed('e')) {
		let proj = new Sprite();

		proj.d = 3;
		proj.color = color(255, 78, 0);

		//					Offset to avoid colliding with player's hitbox
		proj.x = player.x + (player.mirror.x ? -10 : 10);
		proj.y = player.y;

		proj.vel.x = player.mirror.x ? -12 : 12;

		proj.collides(tiles, () => proj.remove());
		proj.collides(slime, async () => {
			// Enemy take damage
			slime.moveAway(player, 0.6);
			await slime.changeAni('hurt');
			slime.remove();
		});
	}

	// Player dies if falls beneath world
	if (player.y > 2000) {
		player.dead = true;
	}

	// Player take damage if touching enemy
	if (player.collides(slime)) {
		if (player.lives <= 1) {

			player.dead = true;
			return;

		} else {

			player.moveAway(slime, 0.2);
			slime.moveAway(player, 0.2);

			await player.changeAni('hurt');
			player.changeAni('stand');

			player.lives--;
		}
	}

	// Player pick coins 
	for (let coin of coins) {
		if (coin.overlaps(player)) {
			coin.remove();
			player.score++;
		}
	}

	// Player pick fruits 
	for (let fruit of fruits) {
		if (fruit.overlaps(player) && player.lives < 3) {
			fruit.remove();
			player.lives++;
		}
	}

	// Player change level
	if (player.overlaps(portal)) {
		tiles.remove();
		player.x = 150;
		player.y = 125;

		tiles = new Tiles(map2,
			0, 0,
			16, 16
		);
	}

	// HUD
	textFont(font)
	textSize(8)

	// Sign HUD tooltip 1
	if (player.overlapping(sign)) {
		push()
		textAlign(CENTER)
		text('Take the purple bottle to win', canvas.hw, canvas.hh - 16);
		pop()
	}

	// Sign HUD tooltip 2
	if (player.overlapping(sign2)) {
		push()
		textAlign(CENTER)
		text('Press the down arrow to roll mid-air', canvas.hw + 32, canvas.hh - 16);
		pop()
	}

	text('Score: ' + player.score, 10, 10);
	text('Vies: ' + player.lives, 10, 20);
}

// Runs every frame when `player.dead` is set
async function gameOver() {

	// Black screen
	background(33);

	// Remove sprites
	slime.remove();
	tiles.remove();

	// Reset values
	player.score = 0;
	player.lives = 0;
	player.vel.x = 0;
	player.vel.y = 0;
	player.x = canvas.hw - 16;
	player.y = canvas.hh - 6;
	camera.x = canvas.hw;
	camera.y = canvas.hh;
	world.gravity.y = 0;

	// Render HUD
	fill(255)
	text('GAME OVER', canvas.hw, canvas.hh);

	if (player.gameOverPassedOnce) return;
	player.gameOverPassedOnce = true;

	await player.changeAni('dead');
	player.changeAni('staydead');
}