var referee = function() {
	//若接發球方贏得一球，除了得一分之外，並取得發球權。而只要發球權交換，獲得發球權球隊球員也必須輪替。
  this.playing = false;
  this.whoServe = 2; //1:player 2:npc
  this.whoLastHit;
  this.lHandUp = false;
  this.rHandUp = false;
  this.playerLastMode = 0;
  this.npcLastMode = 0;
  this.startCount = false;
  this.restartCount = 2;
  
  this.hitBallMachine = new THREE.Object3D();
  THREE.ImageUtils.crossOrigin = '';
	var geometry = new THREE.CylinderGeometry(0.24, 0.24, 1.2, 32);
	var material = new THREE.MeshLambertMaterial({color: 0x008000});
	this.body = new THREE.Object3D();
	var mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(0, 0.6, 0);
	this.body.add(mesh);
	this.hitBallMachine.add(this.body);
  
	geometry = new THREE.SphereGeometry(0.25, 32, 32);
  material = new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture('https://i.imgur.com/f9dNfsj.jpg')});
	var head = new THREE.Mesh(geometry, material);
	head.position.set(0, 1.4, 0);
	this.body.add(head);
  
  material = new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture('https://i.imgur.com/yNp5hMw.jpg')});
	this.hitBallMachineHandLeft = new THREE.Object3D();
	this.body.add(this.hitBallMachineHandLeft);
	this.hitBallMachineHandLeft.rotation.z = 2.7;
  this.hitBallMachineHandLeft.position.x = -0.3;
	this.hitBallMachineHandLeft.position.y = 1.1;
	var armLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1, 32), material);
	armLeft.position.set(0, 0.5, 0);
	this.hitBallMachineHandLeft.add(armLeft);
  var cylinder = new THREE.Mesh( new THREE.CylinderGeometry( 0.04, 0.04, 1.2, 32 ), new THREE.MeshBasicMaterial( {color: 0x804000}) );
  cylinder.rotation.z = 1.7;
  cylinder.position.set(0.4, 1.1, 0);
	this.hitBallMachineHandLeft.add( cylinder );

	var plane = new THREE.Mesh( new THREE.PlaneGeometry( 0.4, 0.7, 32 ), new THREE.MeshBasicMaterial( {color: 0xff0000, side: 	THREE.DoubleSide} ) );
	plane.rotation.z = 1.7 + Math.PI/2;
  plane.position.set(0.75, 1.5, 0);
	this.hitBallMachineHandLeft.add( plane );
	
	this.hitBallMachineHandRight = new THREE.Object3D();
	this.body.add(this.hitBallMachineHandRight);
  this.hitBallMachineHandRight.rotation.z = Math.PI - 2.7;
  this.hitBallMachineHandRight.position.x = 0.3;
	this.hitBallMachineHandRight.position.y = 1.1;
	var armRight = armLeft.clone();
	armRight.position.set(0, -0.5, 0);
	this.hitBallMachineHandRight.add(armRight);
  var cylinder2 = new THREE.Mesh( new THREE.CylinderGeometry( 0.04, 0.04, 1.2, 32 ), new THREE.MeshBasicMaterial( {color: 0x804000}) );
  cylinder2.rotation.z = 1.5;
  cylinder2.position.set(0.4, -1.1, 0);
	this.hitBallMachineHandRight.add( cylinder2 );

	var plane2 = new THREE.Mesh( new THREE.PlaneGeometry( 0.4, 0.7, 32 ), new THREE.MeshBasicMaterial( {color: 0xff0000, side: 	THREE.DoubleSide} ) );
	plane2.rotation.z = 1.5 + Math.PI/2;
  plane2.position.set(0.75, -1.5, 0);
	this.hitBallMachineHandRight.add( plane2 );
  
	var handLeft = new THREE.Mesh(new THREE.SphereGeometry(0.1, 32, 32), material);
	handLeft.position.set(0, 1, 0);
	this.hitBallMachineHandLeft.add(handLeft);
	handRight = handLeft.clone();
	handRight.position.set(0, -1, 0);
	this.hitBallMachineHandRight.add(handRight);
  	
	var foot = new THREE.Mesh(new THREE.SphereGeometry(0.4, 32, 32), material);
	this.hitBallMachine.add(foot);
  
	this.hitBallMachine.rotation.y = -0.6;
	this.hitBallMachine.position.set(0, 0.4, 5.5);
	scene.add(this.hitBallMachine);
}

referee.prototype.update = function() {
	if(!this.playing) { //遊戲停止，所有player待機
  	npcPlayer1.state = 0;
    npcPlayer2.state = 0;
    player1.state = 0;
    player2.state = 0;
  }
  this.leftHandUp();
	this.rightHandUp();
  this.leftHandDown();
  this.rightHandDown();

}

referee.prototype.resetPlayerPosition = function() {
	npcPlayer1.state = 0;
  npcPlayer2.state = 0;
  player1.state = 0;
  player2.state = 0;
  
  if(spike) {
  	spike = !spike;
    $("#spike").toggleClass("btn-active");
  }
  if(!pass) {
  	pass = !pass;
    $("#pass").toggleClass("btn-active");
  }
	if(referee.whoServe === 1) {
  	npcPlayer1.board.mesh.position.set(-9, 1.1, 0);
 npcPlayer1.robot.hitBallMachine.position.set(npcPlayer1.board.mesh.position.x-0.8, 0.4, npcPlayer1.board.mesh.position.z);
 	npcPlayer1.bump();
  	npcPlayer2.board.mesh.position.set(-4, 1.1, 1.8);
 npcPlayer2.robot.hitBallMachine.position.set(npcPlayer2.board.mesh.position.x-0.8, 0.4, npcPlayer2.board.mesh.position.z);
 		npcPlayer2.bump();
  	player1.board.mesh.position.set(4, 1.1, -1.8);
 player1.robot.hitBallMachine.position.set(player1.board.mesh.position.x+0.8, 0.4, player1.board.mesh.position.z);
 		player1.bump();
  	player2.board.mesh.position.set(3, 1.1, 1.8);
 player2.robot.hitBallMachine.position.set(player2.board.mesh.position.x+0.8, 0.4, player2.board.mesh.position.z);
 		player2.bump();
  }
  else {
  	npcPlayer1.board.mesh.position.set(-3, 1.1, -1.8);
 npcPlayer1.robot.hitBallMachine.position.set(npcPlayer1.board.mesh.position.x-0.8, 0.4, npcPlayer1.board.mesh.position.z);
 	npcPlayer1.bump();
    npcPlayer2.board.mesh.position.set(-4, 1.1, 1.8);
 npcPlayer2.robot.hitBallMachine.position.set(npcPlayer2.board.mesh.position.x-0.8, 0.4, npcPlayer2.board.mesh.position.z);
 		npcPlayer2.bump();
    player1.board.mesh.position.set(9, 1.1, 0);
 player1.robot.hitBallMachine.position.set(player1.board.mesh.position.x+0.8, 0.4, player1.board.mesh.position.z);
 		player1.bump();
  	player2.board.mesh.position.set(3, 1.1, 1.8);
 player2.robot.hitBallMachine.position.set(player2.board.mesh.position.x+0.8, 0.4, player2.board.mesh.position.z);
 		player2.bump();
  }
  
  
}

referee.prototype.leftHandUp = function() {
	if(this.lHandUp) {
  	if(this.hitBallMachineHandLeft.rotation.z > 1.4)
    	this.hitBallMachineHandLeft.rotation.z -= 0.03;
		else this.lHandUp = false;
  }
}
referee.prototype.leftHandDown = function() {
	if(!this.lHandUp) {
		if(this.hitBallMachineHandLeft.rotation.z < 2.7)
    	this.hitBallMachineHandLeft.rotation.z += 0.03;
  }
}
referee.prototype.rightHandUp = function() {
	if(this.rHandUp) {
  	if(this.hitBallMachineHandRight.rotation.z < Math.PI - 1.4)
    	this.hitBallMachineHandRight.rotation.z += 0.03;
    else this.rHandUp = false;
  }
}
referee.prototype.rightHandDown = function() {
	if(!this.rHandUp) {
		if(this.hitBallMachineHandRight.rotation.z > Math.PI - 2.7)
  		this.hitBallMachineHandRight.rotation.z -= 0.03;
  }
}