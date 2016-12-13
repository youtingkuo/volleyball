var coach = function(npc) {
  this.isOn = false;
  this.npc = npc;
  this.bumpTarget = new THREE.Vector3(0, 0, 0);
  this.jumpTarget = new THREE.Vector3(0, 0, 0);
  this.groundTarget = new THREE.Vector3(0, 0, 0);
  this.jumpTime = 0;
  this.isOne;
}

coach.prototype.update = function() {
	if (this.isOn === false) return;
  this.isOn = false;
  
  if(this.npc) {
  	npcPlayer1.board.vel = new THREE.Vector3(0, 0, 0);
    npcPlayer2.board.vel = new THREE.Vector3(0, 0, 0);
    
  	if(this.groundTarget.x < -8 || this.groundTarget.z < -4 || this.groundTarget.z > 4) {
    	npcPlayer1.state = 2;
    	npcPlayer2.state = 2;
      return;
    }
    
  	var dis1 = this.bumpTarget.clone().sub(npcPlayer1.board.mesh.position.clone()).lengthSq();
    var dis2 = this.bumpTarget.clone().sub(npcPlayer2.board.mesh.position.clone()).lengthSq();
	  //這邊要一個if來判斷攻擊方式?
///////////////////////////////////////////////////////////// 
		if(dis1 >= dis2) {
      if(referee.playerLastMode === 5) {
      	this.isOne = false;
    		npcPlayer2.state = 3; //做球
      	npcPlayer2.chaseTarget = this.bumpTarget;
      }
      else if(referee.playerLastMode != 5 && this.bumpTarget.x > -4) {
				this.isOne = true;
      	npcPlayer2.state = 4; //攻擊
      	npcPlayer2.chaseTarget = this.bumpTarget;
      }
      else {
      	var needToSpike = true;
      	this.isOne = false;
    		npcPlayer2.state = 3; //做球
      	npcPlayer2.chaseTarget = this.bumpTarget;
      }
      
			tmp = Math.random() - 0.5;
      if(npcPlayer2.state === 4) {
      	npcPlayer1.state = 2;
      }
      else if(needToSpike) {
      	npcPlayer1.state = 6; //殺球
        npcPlayer1.chaseTarget = new THREE.Vector3(-2, 1.1, 0);
        needToSpike = false;
      }
      else if(tmp > 0 && npcPlayer2.state != 4) {
      	npcPlayer1.state = 6; //殺球
        npcPlayer1.chaseTarget = new THREE.Vector3(-2, 1.1, 0);
      }
      else if(tmp < 0 && npcPlayer2.state != 4) {
      	npcPlayer1.state = 4; //攻擊
      	npcPlayer1.chaseTarget = new THREE.Vector3(-2, 1.1, 0);
      }
    }
    else {
    	if(referee.playerLastMode === 5) {
      	this.isOne = false;
    		npcPlayer1.state = 3; //做球
      	npcPlayer1.chaseTarget = this.bumpTarget;
      }
      else if(referee.playerLastMode != 5 && this.bumpTarget.x > -4) {
				this.isOne = true;
      	npcPlayer1.state = 4; //攻擊
      	npcPlayer1.chaseTarget = this.bumpTarget;
      }
      else{
      	var needToSpike = true;
      	this.isOne = false;
    		npcPlayer1.state = 3; //做球
      	npcPlayer1.chaseTarget = this.bumpTarget;
      }

      tmp = Math.random() - 0.5;
      if(npcPlayer1.state === 4) {
      	npcPlayer2.state = 2;
      }
      else if(needToSpike) {
      	npcPlayer2.state = 6; //殺球
        npcPlayer2.chaseTarget = new THREE.Vector3(-2, 1.1, 0);
        needToSpike = false;
      }
      else if(tmp > 0 && npcPlayer1.state != 4) {
      	npcPlayer2.state = 6; //殺球
        npcPlayer2.chaseTarget = new THREE.Vector3(-2, 1.1, 0);
      }
      else if (tmp < 0 && npcPlayer1.state != 4){
      	npcPlayer2.state = 4; //攻擊
      	npcPlayer2.chaseTarget = new THREE.Vector3(-2, 1.1, 0);
      }
    }
    
/////////////////////////////////////////////////////////////

  }
  else {
  	player1.board.vel = new THREE.Vector3(0, 0, 0);
    player2.board.vel = new THREE.Vector3(0, 0, 0);
    
  	if(this.groundTarget.x > 8 || this.groundTarget.z < -4 || this.groundTarget.z > 4) {
    	player1.state = 2;
    	player2.state = 2;
      return;
    }
    
  	var dis1 = this.bumpTarget.clone().sub(player1.board.mesh.position.clone()).lengthSq();
    var dis2 = this.bumpTarget.clone().sub(player2.board.mesh.position.clone()).lengthSq();
    
    if(dis1 >= dis2) {
    	if(pass) {
      	this.isOne = false;
    		player2.state = 3; //做球
      	player2.chaseTarget = this.bumpTarget;
        if(spike) {
        	player1.state = 6; //殺球
        }
        else player1.state = 4; //攻擊
      	player1.chaseTarget = new THREE.Vector3(2, 1.1, 0);
      }
      else {
      	this.isOne = true;
      	if(spike) {
        	player2.state = 5; //殺球
      		player2.chaseTarget = this.jumpTarget;
	  			player2.jumpWaitTime = this.jumpTime;
	  			player2.jumpV = new THREE.Vector3(0, 5, 0);
	  			player2.jumpIsOn = true;
        }
        else {
        	player2.state = 4; //攻擊
      		player2.chaseTarget = this.bumpTarget;
        }
        player1.state = 2; //stand by
      }
    }
    else {
    	if(pass) {
      	this.isOne = false;
    		player1.state = 3; //做球
      	player1.chaseTarget = this.bumpTarget;
        if(spike) {
        	player2.state = 6; //殺球
        }
        else player2.state = 4; //攻擊
        player2.chaseTarget = new THREE.Vector3(2, 1.1, 0);
      }
      else {
      	this.isOne = true;
      	if(spike) {
        	player1.state = 5; //殺球
      		player1.chaseTarget = this.jumpTarget;
	  			player1.jumpWaitTime = this.jumpTime;
	  			player1.jumpV = new THREE.Vector3(0, 5, 0);
	  			player1.jumpIsOn = true;
        }
        else {
        	player1.state = 4; //攻擊
      		player1.chaseTarget = this.bumpTarget;
        }
        player2.state = 2; //stand by
      }
    }
  }
}