const GRAV = 0.981;
let dirt;
let tiles;
let player;

let score = 0;
let vies = 3;

let jumpCoolDown = 40, jumpTimer = 0;

function preload() {
	worldTiles = loadImage('assets/sprites/world_tileset.png');
	coinSprite = loadImage('assets/sprites/coin.png');
	font = loadFont('assets/fonts/PixelOperator8.ttf');
	playerSheet = loadImage('assets/sprites/knight.png');
	slimeSheet = loadImage('assets/sprites/slime_purple.png');
	fruitSheet = loadImage('assets/sprites/fruit.png')
}

function setup() {
	new Canvas(innerWidth / 4, innerHeight / 4, 'pixelated x4');

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

	

	flower3 = new Group();
	flower3.collider = 'none';
	flower3.spriteSheet = worldTiles;
	flower3.addAni({ w: 16, h: 16, row: 5, col: 0 });
	flower3.tile = 't';

	flower3 = new Group();
	flower3.collider = 'none';
	flower3.spriteSheet = worldTiles;
	flower3.addAni({ w: 16, h: 16, row: 4, col: 0 });
	flower3.tile = 'y';

	flower3 = new Group();
	flower3.collider = 'none';
	flower3.spriteSheet = worldTiles;
	flower3.addAni({ w: 16, h: 16, row: 3, col: 0 });
	flower3.tile = 'u';

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

	// let m = mapGenerator(18, 16 * 4, 16);
	// console.log(m);
	tiles = new Tiles(map1,
		0, 0,
		16, 16
	);


	player = new Sprite(canvas.hw, -100);
	player.color = 'white';
	player.width = 10;
	player.height = 14;
	player.spriteSheet = playerSheet;
	player.anis.offset.y = -3;
	player.addAnis({
		run: { w: 32, h: 32, row: 2, frames: 16 },
		roll: { w: 32, h: 32, row: 5, frames: 8, frameDelay: 4 },
		stand: { w: 32, h: 32, row: 0, frames: 4, frameDelay: 6 },
		hurt: {w:32, h:32, row: 6, frames: 4,  frameDelay: 2},
		dead: {w:32, h:32, row: 7, frames: 4,  frameDelay: 12 },
		staydead: {w:32, h:32, row: 7, col:3,frames: 1}
	});

	slime = new Sprite();
	slime.width = 10;
	slime.height = 14;
	slime.x = canvas.hw+300
	slime.y = -100;
	slime.spriteSheet = slimeSheet;
	slime.anis.offset.y = -4;

	slime.drag = 0;
	slime.rotationLock = true;
	slime.addAni({ w: 24, h: 24, row: 1, frames: 4, frameDelay: 6 });
	
	player.changeAni('stand');
	//player.debug = true;
	player.drag = 0;
	player.rotationLock = true;

	allSprites.pixelPerfect = true;
	world.gravity.y = 9.81;
}

let dead = false;
async function draw() {
	background(200, 230, 255);

	for (let coin of coins) {
		if(coin.overlaps(player)){
			coin.remove();
			score++;
		}
	}

	for (let fruit of fruits) {
		if(fruit.overlaps(player)){
			fruit.remove();
			score+=3;
		}
	}

	if (player.overlaps(portal)) {
		tiles.remove();
		player.x = 0;
		player.y = 0;

		tiles = new Tiles(map2,
			0, 0,
			16, 16
		);
	
	}

	if (player.collides(slime)) {
		if(vies <= 1) {
			dead = true;



		} else {

			player.moveAway(slime, 0.1);
			await player.changeAni('hurt');

			vies--;
			player.changeAni('stand')
		}
	}

	if (dead) {

		slime.remove();
		tiles.remove();
		text('GAME OVER', canvas.hw, canvas.hh)

		score = 0;
		vies = 0;
		player.vel.x = 0;
		player.vel.y = 0;
		player.x = canvas.hw-16;
		player.y = canvas.hh;
		camera.x = canvas.hw;
		camera.y = canvas.hh;
		world.gravity.y = 0;

		await player.changeAni('dead');


		return;
	}

	if (abs(slime.x - player.x) < 370)
		slime.moveTowards(player.x, undefined, 0.005);
	if( player.x < slime.x) {
		slime.mirror.x = true
	} else {
		slime.mirror.x = false
	}

	if(player.overlapping(ladder)) {
		player.move(1, 'up', 1);
	}

	if (player.colliding(dirt)) {
		allowJump = true;
	}

	if (keyIsDown(LEFT_ARROW)) {
		player.mirror.x = true;

		player.vel.x = -1.75;
		player.changeAni('run')
	} else if (keyIsDown(RIGHT_ARROW)) {
		player.mirror.x = false;
		player.vel.x = 1.75;
		player.changeAni('run')
	}  else {
		if (player.ani.name !== 'stand' &&
			player.ani.name !== 'hurt' &&
			player.ani.name !== 'roll' 
		) 
			player.changeAni('stand')
	}



	if (
		keyIsDown(UP_ARROW) && 
		player.colliding(tiles) && 
		jumpTimer >= jumpCoolDown) 
	{
		player.bearing = -90;
		player.applyForce(45);
		jumpTimer = 0;
	} else jumpTimer++;

	
	if (kb.pressed('down')) {
		player.bearing = player.mirror.x ? 180 : 0;
		player.vel.x += player.mirror.x ? -1.5 : 1.5;
		await player.changeAni('roll');
		player.changeAni('stand');
	}

	textFont(font)
	textSize(8)
	text('Score: ' + score, 10, 10);

	text('Vies: ' + vies, 10, 20)


	camera.x = player.x;

	camera.y = player.y;

	if(player.overlapping(sign)) {
		push()
		textAlign(CENTER)
		text('Take the purple bottle to win', canvas.hw, canvas.hh-16);
		pop()
	}

	if(player.y > 2000){
		dead = true;
	}
}