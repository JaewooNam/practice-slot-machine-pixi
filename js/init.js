var stage, renderer;
var container, front
var balanceStatus;
var loader;
var bw = 80;
var bh = 90;
var max = 3;
var slots;
var speed = 8;
var radius = 360;
var playBtn, stopBtns;
var timer;
var completed = 0;
var label;
var balance = 1000;
var totalBalanceMoney;
var list;
var checked = 0;

let totalBetMoney = new PIXI.Text(1000, {fontFamily: 'Arial-Bold', fontSize: 36, fill: 0xfffffff, align: 'center'});
let betMoney = new PIXI.Text(10, {fontFamily: 'Arial-Bold', fontSize: 36, fill: 0xfffffff, align: 'left'});
totalBetMoney.x = 100;
betMoney.x = 100;
betMoney.y = 50;

stage = new PIXI.Container();
renderer = PIXI.autoDetectRenderer(1500, 589, {transparent: true, backgroundColor: 0xFFFFFF});
document.body.appendChild(renderer.view);
renderer.view.style.display = "block";
renderer.view.style.width = "1500";

renderer.view.style.marginTop = "40px";
renderer.view.style.marginLeft = "auto";
renderer.view.style.marginRight = "auto";
renderer.view.style.paddingLeft = "0";
renderer.view.style.paddingRight = "0";


// container
container = new PIXI.Container();
stage.addChild(container);
front = new PIXI.Container();
stage.addChild(front);

//Set background image
var backGroundSprite = PIXI.Sprite.fromImage("images/bg_image.png");
stage.addChild(backGroundSprite);
backGroundSprite.addChild(front);

background();

loader = new PIXI.loaders.Loader();
//loader.add("frame", "images/frame.png");c
loader.add("icons", "images/sushi_reel.json");
loader.add("button", "images/button_images.json");
loader.add("button2", "images/bet_images.json")
loader.on("complete", complete);
loader.load();

update();

front.addChild(totalBetMoney);
front.addChild(betMoney);

    
function update() {
	renderer.render(stage);
	requestAnimationFrame(update);

	// stats.update();
}
function complete() {
	initialize();
	setup();
}

function initialize() {
	label = new PIXI.Text("", {"font": "24px Arial", "fill": "#666666", "align": "center"});
	stage.addChild(label);
	label.position.x = 320;
	label.position.y = 20;

	var icons = [];
	icons.push(PIXI.Texture.fromFrame("sushi_01.png"));
	icons.push(PIXI.Texture.fromFrame("sushi_02.png"));
	icons.push(PIXI.Texture.fromFrame("sushi_03.png"));
	icons.push(PIXI.Texture.fromFrame("sushi_04.png"));
	icons.push(PIXI.Texture.fromFrame("sushi_05.png"));
	icons.push(PIXI.Texture.fromFrame("sushi_06.png"));
	icons.push(PIXI.Texture.fromFrame("sushi_07.png"));

	slots = [];
	//var texture = PIXI.Texture.fromImage("images/bg_image.png");
	for (var n = 0; n < max; n++) {
		var content = new PIXI.Container();
		container.addChild(content);
		content.position.x = 120 + 150*n;
		content.position.y = 300;
		var base = new PIXI.Graphics();
		// Fill color in reel
		base.beginFill(0xe9fff8);
		base.drawRect(-bw, -bh, bw*2, bh*2);
		base.endFill();
		content.addChild(base);
		var slot = new Slot(n, bw, bh, speed, radius);
		content.addChild(slot);
		slot.setup(icons);
		slots.push(slot);
		// var frame = new PIXI.Sprite(texture);
		// frame.pivot.x = 110;
		// frame.pivot.y = 120;
		// content.addChild(frame);
	}

	// var frame = new PIXI.Sprite(texture);
	// frame.pivot.x = 10;
	// frame.pivot.y = 10;
	// content.addChild(frame);
}

function play(data) {

    console.log("play btn clicked");
    playBtn.selected(true);
    totalBetMoney.text = totalBetMoney.text - betMoney.text;
    var testNumber;
    testNumber = parseInt(totalBetMoney.text);

    if (testNumber == 990) {
        console.log("totalBetMoney equls 500");
    } else {
        console.log("totalBetMoney not equls 500");
    }
	for (var n = 0; n < max; n++) {
		var stopBtn = stopBtns[n];
		stopBtn.enabled(true);
	}

	start();
}

function start() {
	for (var n = 0; n < max; n++) {
		var slot = slots[n];
		//slot.on("select", selected);
		//slot.on("complete", scrolled);
		slot.once("select", selected);
		slot.once("complete", scrolled);
		slot.start();
	}
	timer = setInterval(tick, 16);

	completed = 0;
	label.text = "";
	list = [];
	checked = 0;
}

function stop(data) {
	var id = data.target.id;

	var stopBtn = stopBtns[id];
	stopBtn.selected(true);

	var slot = slots[id];
	slot.stop();
}

function tick() {
	for (var n = 0; n < max; n++) {
		var slot = slots[n];
		slot.update();
	}
}

function selected(event) {
	//event.off("select", selected);
	list[event.sid] = event.gid;
	checked ++;
	if (checked > max - 1) match();
}

function scrolled(event) {
	//event.off("complete", scrolled);
	completed ++;
	if (completed > max - 1) {
		clearInterval(timer);
		clear();
	}
}

function clear() {
	playBtn.selected(false);
	for (var n = 0; n < max; n++) {
		var stopBtn = stopBtns[n];
		stopBtn.selected(false);
		stopBtn.enabled(false);
	}
}

function match() {
	if ((list[0] == list[1]) && (list[0] == list[2])) {
		label.setStyle({"font": "24px Arial", "fill": "#CC0000", "align": "center"});
		label.text = "test1";
	} else if (list[0] == list[1] || list[0] == list[2] || list[1] == list[2]) {
		label.setStyle({"font": "24px Arial", "fill": "#333333", "align": "center"});
		//label.text = "reach";
		label.text = "test2";
	} else {
		label.setStyle({"font": "24px Arial", "fill": "#999999", "align": "center"});
		//label.text = "no match";
		label.text = "test3";
	}
	label.position.x = 320 - (label.width >> 1);
}

//layout
function setup() {
	var textures_play = {
		"btn_up" : PIXI.Texture.fromFrame("start_btn_3.png"), 
		"btn_over" : PIXI.Texture.fromFrame("start_btn_1.png"), 
		"btn_selected" : PIXI.Texture.fromFrame("start_btn_1.png"), 
		"btn_disabled" : PIXI.Texture.fromFrame("start_btn_2.png"), 
	};
	var textures_stop = {
		"btn_up" : PIXI.Texture.fromFrame("stop_btn_3.png"), 
		"btn_over" : PIXI.Texture.fromFrame("stop_btn_1.png"), 
		"btn_selected" : PIXI.Texture.fromFrame("stop_btn_1.png"), 
		"btn_disabled" : PIXI.Texture.fromFrame("stop_btn_2.png")
	};

	var buttonSample = {
		"btn1" : PIXI.Texture.fromFrame("stop_btn_3.png"), 
		"btn2" : PIXI.Texture.fromFrame("stop_btn_3.png"),
		"btn3" : PIXI.Texture.fromFrame("stop_btn_3.png"),
		"btn4" : PIXI.Texture.fromFrame("stop_btn_3.png"),
	};

	stopBtns = [];
	for (var n = 0; n < max; n++) {
		var stopBtn = new Button(textures_stop);
		front.addChild(stopBtn);
		stopBtn.id = n;
		// content.position.x = 120 + 150*n;
		// content.position.y = 300;
		stopBtn.position.x = 130 + 150*n;
		stopBtn.position.y = 380;
		stopBtn.click = stopBtn.touchstart = stop;
		stopBtn.enabled(false);
		stopBtns.push(stopBtn);
	}

	playBtn = new Button(textures_play);
	front.addChild(playBtn);
	playBtn.position.x = 270;
	playBtn.position.y = 480;
	playBtn.click = playBtn.touchstart = play;
	// console.log("play btn clicked!");


	// Set bet status pannel
	let bet = PIXI.Sprite.fromImage('images/bet.png');
	bet.x = 50;
	bet.y = 510;
	bet.width = 100;
	bet.height = 70;
	front.addChild(bet);

	// Set balance pannel
	let balanceStatus = PIXI.Sprite.fromImage('images/balance.png');
	balanceStatus.x = 500;
	balanceStatus.y = 10;
	balanceStatus.width = 100;
	balanceStatus.height = 60;
	front.addChild(balanceStatus);

	// Set Plus, Minus Buttons
	let plusBtn = PIXI.Sprite.fromImage('images/add_btn_on.png');
	let minusBtn = PIXI.Sprite.fromImage('images/minus_btn_on.png');
	plusBtn.x = 160;
	plusBtn.y = 550;
	plusBtn.width = 30;
	plusBtn.height = 30;
	front.addChild(plusBtn);
	plusBtn.interactive = true;
	plusBtn.buttonMode = true;
	plusBtn.on('pointerdown', addOneHero);

	minusBtn.x = 10;
	minusBtn.y = 550;
	minusBtn.width = 30;
	minusBtn.height = 30;
	front.addChild(minusBtn);
	minusBtn.interactive = true;
	minusBtn.buttonMode = true;
	minusBtn.on('pointerdown', addOneHero);

}

function background() {
	var version = PIXI.VERSION;
	var rendererType;
	switch (renderer.type) {
		case PIXI.RENDERER_TYPE.WEBGL :
			rendererType = "WebGL";
			break;
		case PIXI.RENDERER_TYPE.CANVAS :
			rendererType = "Context2D";
			break;
	}
	var txt = "Sushi Slot";
	var basic = new PIXI.Text(txt, {"font": "20px Arial", "fill": "#000000", "align": "left"});
	front.addChild(basic);

	basic.position.x = 4;
	basic.position.y = 0;
	basic.alpha = 0.6;
}


function addOneHero () {
    console.log("it is true");
    console.log(typeof(betMoney.text));
    var a;
    a = parseInt(betMoney.text);
    console.log(typeof(a));
    betMoney.text = a+ 10;
	// heroBetCounterNumber.text++;
	// totalBets.text++;
	// console.log(totalBets.text);
	// balanceLeft.text--;
	// if(balanceLeft.text <0) {
	// 	alert("You are out of cash!");
	// 	balanceLeft.text++;
	// 	totalBets.text --;
	// 	heroBetCounterNumber.text--;
	// 	console.log(totalBets.text);
	// }
	// var audio_bet = document.getElementById("audio_bet");
	// if (audio_bet.paused) {
	// 	audio_bet.play();        
	// } else {
	// 	audio_bet.currentTime = 0;
	// }
}
