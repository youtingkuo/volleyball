var Ball = function (scene){
  this.v = new THREE.Vector3(0, 0, 0);
  this.angle = 0;
  this.isOn = false;
  
  THREE.ImageUtils.crossOrigin = '';
  var texture =
  THREE.ImageUtils.loadTexture('https://i.imgur.com/vSpU7ik.png');
  
	this.mesh = new THREE.Mesh(new THREE.SphereGeometry(0.2, 32, 32), new THREE.MeshBasicMaterial({map: texture, 
                         transparent: true, 
                         side:THREE.DoubleSide}));
  this.mesh.position.set(0, 0.2, 0);
 	scene.add(this.mesh);
  
  this.start = function () {
    this.isOn = true;
  };
  
  this.update = function(dT) {
  	if (this.isOn === false) return;
	
  	var f = new THREE.Vector3(0, -9.8, 0);
    this.v.add ( f.clone().multiplyScalar(dT) );
  	this.mesh.position.add ( this.v.clone().multiplyScalar(dT) );
    this.mesh.rotation.z += 0.03; 
    
    this.netCollisionDetection();
    
    var n = new THREE.Vector3(0, 1, 0);
		var p0 = new THREE.Vector3(0, 0.2, 0); 
    	
		if (!ball.collisionDetection(ball.mesh.position, p0, n)){	
    	if(referee.whoLastHit != 0) {
    		player1.board.vel = new THREE.Vector3(0, 0, 0);
    		player2.board.vel = new THREE.Vector3(0, 0, 0);
    		npcPlayer1.board.vel = new THREE.Vector3(0, 0, 0);
    		npcPlayer2.board.vel = new THREE.Vector3(0, 0, 0);
   	 	}
    	if(referee.whoLastHit === 1) {
      	if(this.mesh.position.x > -8 && this.mesh.position.x < 0 && this.mesh.position.z < 4 && this.mesh.position.z > -4) {
        	referee.rHandUp = true;
          referee.whoServe = 2;
          pPoint++;
          ppoAngle = Math.PI*2;
          ppoPic = pPoint%10;
          if(ppoPic === 0) {
          	pptAngle = Math.PI*2;
            pptPic = pPoint/10;
          }
        }
        else {
      		referee.lHandUp = true;
          referee.whoServe = 1;
          nPoint++;
          npoAngle = Math.PI*2;
          npoPic = nPoint%10;
          if(npoPic === 0) {
          	nptAngle = Math.PI*2;
            nptPic = nPoint/10;
          }
        }
        referee.whoLastHit = 0;
      }
      else if(referee.whoLastHit === 2) {
      	if(this.mesh.position.x < 8 && this.mesh.position.x > 0 && this.mesh.position.z < 4 && this.mesh.position.z > -4) {
        	referee.lHandUp = true;
          referee.whoServe = 1;
          nPoint++;
          npoAngle = Math.PI*2;
          npoPic = nPoint%10;
          if(npoPic === 0) {
          	nptAngle = Math.PI*2;
            nptPic = nPoint/10;
          }
        }
        else {
      		referee.rHandUp = true;
          referee.whoServe = 2;
          pPoint++;
          ppoAngle = Math.PI*2;
          ppoPic = pPoint%10;
          if(ppoPic === 0) {
          	pptAngle = Math.PI*2;
            pptPic = pPoint/10;
          }
        }
        referee.whoLastHit = 0;
      }
    	//referee.playing = false; //遊戲停止
      //referee.resetPlayerPosition();
      referee.startCount = true;
      player1.state = 8;
      player2.state = 8;
      npcPlayer1.state = 8;
      npcPlayer2.state = 8;
      var tmp = this.v.clone().dot(n);
      var v1 = n.clone().multiplyScalar(tmp);
    	var v2 = this.v.clone().sub(v1);
      v1.multiplyScalar(-0.4);
    	this.v = v1.add(v2);
      this.mesh.position.y = 0.205;
		}
    
  };
  
  this.shoot = function(v) {//傳入vector3，會從現在的ball的mesh的位置發射
		this.v = v;//初速
  };

};

Ball.prototype.collisionDetection = function(p, p0, n){
	var tmp = p.clone().sub(p0).dot(n);
  if (tmp < 0) return false;
  else return true;
}

Ball.prototype.netCollisionDetection = function(){
	var n, p0;
  if(this.mesh.position.x < 0) {
  	p0 = new THREE.Vector3(-0.2, 1.43, -4);
  	n = new THREE.Vector3(-1, 0, 0);
  }
  else {
  	p0 = new THREE.Vector3(0.2, 1.43, -4);
  	n = new THREE.Vector3(1, 0, 0);
  }
  var tmp = this.mesh.position.clone().sub(p0);
  
  if( tmp.y <= 1 && tmp.y >= 0 && tmp.z <= 8 && tmp.z >= 0 ) {
    if(!this.collisionDetection(this.mesh.position, p0, n)) {
    	tmp = this.v.clone().dot(n);
      var v1 = n.clone().multiplyScalar(tmp);
    	var v2 = this.v.clone().sub(v1);
      v1.multiplyScalar(-0.3);
    	this.v = v1.add(v2);
      if(ball.mesh.position.x < 0) this.mesh.position.x = -0.2;
      else if(ball.mesh.position.x > 0) this.mesh.position.x = 0.2;
    }
  }
}

function rotation(vector3, theta, phi) {
  var x = vector3.x * Math.cos(theta) - vector3.y * Math.sin(theta);
  var y = vector3.x * Math.sin(theta) + vector3.y * Math.cos(theta);
  vector3.x = x; 
  vector3.y = y;
  x = vector3.x * Math.cos(phi) + vector3.z * Math.sin(phi);
  var z = vector3.z * Math.cos(phi) - vector3.x * Math.sin(phi);
  vector3.x = x;
  vector3.z = z;
  return vector3;
}
