var BUMP = Math.PI/3.49;
var player = function(npc, num) {
		
    this.state = 0; //0:待機  1:發球 2:standBy 3:做球 4:normal攻擊 5:殺球攻擊 //6:移動到殺球地點
    this.npc = npc; //1：電腦, 2：玩家
    this.num = num; //背號
    this.standByPosition = new THREE.Vector3(0, 0, 0);
    this.chaseTarget = new THREE.Vector3(0, 0 ,0);
    this.hitMode = 0;
    //發球用
		this.serveAngleLeft = 0;
		this.serveAngleRight = 0;
		this.startTime = 0;
		this.serveIsOn = false;
		this.serveState = 0;//0,左右手往後 1,右手往前 2,打到球後兩手收回
    this.serveTarget;
    this.isLeft = false;
    //update用
    this.updateAngleLeft = BUMP;
    this.updateAngleRight = BUMP;
    //跳越用
    this.jumpIsOn = false;
	this.jumpServeIsOn = false;
    this.jumpStartTime = 0;
	this.jumpServeState = 0//0:拋球動作，1:拋完球standBy不動，2跳起來，3手準備揮,4手揮出，球射出去了,手正在歸位,5手歸完位，身體正在歸位(著地)
  	this.jumpV = new THREE.Vector3(0, 0, 0);
    this.jumpWaitTime = 0;//等待時間，發球跟殺球共用
    this.jumpState = 0;
    
    //玩家操控的攻擊點
    this.attackTarget = new THREE.Vector3(-4, 0, 0);
    //
    this.preTarget = new THREE.Vector3(0, 0, 0);
    
    this.board = new Agent (new THREE.Vector3 (0, 0, 0), new THREE.Vector3(0,0,0));
    this.robot = new robot (scene, npc, this.num);
    scene.add(this.board.mesh);
    
    this.bump();
 	
  	
 		this.sprite = new SpriteText2D('seek', {
    	align: textAlign.center,
    	font: '20px Courier',
    	fillStyle: '#000000',
    	antialias: true
 	 	});
    this.sprite.scale.set(.02, .02, .02);
  	scene.add(this.sprite);
}

player.prototype.bump = function(){
    if(this.npc) {
    	this.robot.body.rotation.x = 0.2; //Math.PI/15.7
		this.robot.hitBallMachineHandLeft.rotation.x = -0.9; //-Math.PI/3.49
		this.robot.hitBallMachineHandRight.rotation.x = -0.9; //-Math.PI/3.49
        this.board.mesh.position.y = 1.1; //Math.PI/2.85
        this.board.mesh.rotation.z = -0.75; //-Math.PI/4.18; //-0.75
    }
    else {
        this.robot.body.rotation.x = -0.2;
		this.robot.hitBallMachineHandLeft.rotation.x = 0.9;
		this.robot.hitBallMachineHandRight.rotation.x = 0.9;
        this.board.mesh.position.y = 1.1;
        this.board.mesh.rotation.z = 0.75;
    } 
}

player.prototype.set = function(){
    if(this.npc) {
        this.robot.body.rotation.x = 0;
    	this.robot.hitBallMachineHandLeft.rotation.x = -2.1;
    	this.robot.hitBallMachineHandRight.rotation.x = -2.1;
    	this.board.mesh.position.y = 2.05;
    	this.board.mesh.rotation.z = -0.75;
    }
    else {
    	this.robot.body.rotation.x = 0;
    	this.robot.hitBallMachineHandLeft.rotation.x = 2.1;
    	this.robot.hitBallMachineHandRight.rotation.x = 2.1;
    	this.board.mesh.position.y = 2.05;
    	this.board.mesh.rotation.z = 0.75;
    }
}

player.prototype.startServe = function (target) {
		this.serveTarget = target;
		this.startTime = clock.getElapsedTime();
    this.serveIsOn = true;
    this.state = 1;
}

player.prototype.startJump = function(target,jumpV,waitTime){
	this.state = 1;
	this.serveTarget = target;
	this.jumpServeIsOn = true;
	this.jumpIsOn = true;
	this.jumpStartTime = clock.getElapsedTime();
	this.jumpV = jumpV;//初速
	this.jumpWaitTime = waitTime;
}
player.prototype.serve = function(dT){
	this.normalServe(dT);
  this.jumpServe(dT);
}


player.prototype.normalServe = function(dT){
		if (this.serveIsOn === false) return;
    //console.log(this.state);
		var now = clock.getElapsedTime();
      //console.log(this.serveState)
    if(ball.isOn === false)//球跟著手
  		ball.mesh.position.copy(this.robot.handRight.localToWorld(new THREE.Vector3(0,0,0)));//NPC的話其實是左手
		
		if(this.serveState == 0){//如果現在不在Rest中就用BUMP狀態開始用加的
		 	this.serveAngleLeft = BUMP+ (now - this.startTime)*2 ;
		 	this.serveAngleRight = BUMP+ (now - this.startTime)*2*1.5;
		}
    else if(this.serveState == 1){//到Math.PI會迴轉所以從Math.PI開始減
    	this.serveAngleRight = Math.PI*1.3567- (now - this.startTime)*6;
    }
    else{
    	this.serveAngleLeft = Math.PI- (now - this.startTime)*6 ;
    	this.serveAngleRight = Math.PI- (now - this.startTime)*6 ;
    }
    
    
	if (this.serveState == 0 && this.serveAngleLeft > Math.PI){
		this.startTime = clock.getElapsedTime();
		this.serveState = 1;
	}
    if (this.serveState == 1 && this.serveAngleRight < Math.PI &&  ball.isOn === false){
			//ball.isOn=true;
      //ball.shoot(new THREE.Vector3(8, 9, 0));
      //console.log(ball.mesh.position);
      ball.isOn = true;
      this.passTarget(this.serveTarget);
      spikeSound.pause();
			spikeSound.currentTime = 0;
    	spikeSound.play();
      
      this.startTime = clock.getElapsedTime();
      this.serveState=2;
		}
    if(this.serveState == 2 && this.serveAngleLeft < BUMP){
    	this.serveAngleLeft = BUMP;
      this.serveAngleRight = BUMP;
      this.serveState = 0;
      this.serveIsOn = false;
      this.state = 2;///發完球變成stand by
      this.stateTarget = undefined;
    }
    /////////
    var gotTargetAngle = this.makeTargetAngle()/Math.PI*180%180;
    var robotY = this.robot.hitBallMachine.rotation.y/Math.PI*180%180;
      
    if(gotTargetAngle>robotY)
      	this.robot.hitBallMachine.rotation.y +=dT;
    else
      	this.robot.hitBallMachine.rotation.y -=dT;
    ////////////
    if(this.isLeft === true){
      this.robot.hitBallMachineHandLeft.rotation.x = -1*this.serveAngleRight;//-1反過來，左右手也是
      this.robot.hitBallMachineHandRight.rotation.x = -1*this.serveAngleLeft; 
    } 
    else{
    	this.robot.hitBallMachineHandLeft.rotation.x = this.serveAngleRight;
      this.robot.hitBallMachineHandRight.rotation.x = this.serveAngleLeft;  
    }
    
}

player.prototype.jumpServe = function(dT){//dT其實是傳給jump用的，發球動作是用jumpStartTime
	if (this.jumpServeIsOn === false) return;
	var now = clock.getElapsedTime();
	//console.log(this.jumpServeState)
    if(ball.isOn === false)//球跟著手
  		ball.mesh.position.copy(this.robot.handRight.localToWorld(new THREE.Vector3(0,0,0)));//NPC的話其實是左手
	if(this.jumpServeState == 0){
		this.serveAngleLeft = BUMP+ (now - this.jumpStartTime)*2 ;
		this.serveAngleRight = BUMP+ (now - this.jumpStartTime)*2*1.5;
	}
	if(this.jumpServeState == 3){
		this.serveAngleRight = Math.PI*1.3567- (now - this.jumpStartTime)*6;
	}
  if(this.jumpServeState == 4){
    this.serveAngleLeft = Math.PI- (now - this.jumpStartTime)*6 ;
    this.serveAngleRight = Math.PI- (now - this.jumpStartTime)*6 ;
  }

	if (this.jumpServeState == 0 && this.serveAngleLeft > Math.PI){
		this.jumpStartTime = clock.getElapsedTime();
		this.jumpServeState = 1;
		ball.isOn = true;
		ball.shoot(new THREE.Vector3(0, 5.5, 0));
	}
	if(this.jumpServeState == 1 && (now - this.jumpStartTime) > this.jumpWaitTime){
		this.jumpServeState = 2;
	}
	if(this.jumpServeState >= 2){
		this.jump(dT);
	}
	if(this.jumpServeState == 2){
		var ballY =  ball.mesh.position.y;
		var handY = this.robot.handRight.localToWorld(new THREE.Vector3(0,0,0)).y;
		//console.log(Math.abs(ballY-handY));
		if(Math.abs(ballY-handY)<0.85){
		  this.jumpServeState = 3;
		  this.jumpStartTime = clock.getElapsedTime();
		
		}
	}
	if(this.jumpServeState == 3 && this.serveAngleRight < Math.PI){
		this.jumpStartTime = clock.getElapsedTime();
		this.jumpServeState = 4;
		console.log("check");
		ball.isOn = true;
    this.passTarget(this.serveTarget);
    spikeSound.pause();
		spikeSound.currentTime = 0;
    spikeSound.play();
	}
  if(this.jumpServeState == 4 && this.serveAngleLeft < BUMP){
	  this.jumpServeState = 5;
  }
  if(this.jumpServeState == 5 &&  this.jumpIsOn === false){
    this.serveAngleLeft = BUMP;
    this.serveAngleRight = BUMP;
    this.jumpServeState = 0;
    this.jumpServeIsOn = false;
    this.state = 2;///發完球變成stand by
    this.stateTarget = undefined;
  }
    if(this.isLeft === true){
      this.robot.hitBallMachineHandLeft.rotation.x = -1*this.serveAngleRight;//-1反過來，左右手也是
      this.robot.hitBallMachineHandRight.rotation.x = -1*this.serveAngleLeft; 
    } 
    else{
    	this.robot.hitBallMachineHandLeft.rotation.x = this.serveAngleRight;
      this.robot.hitBallMachineHandRight.rotation.x = this.serveAngleLeft;  
    }
}


player.prototype.jump = function(dT){
  if (this.jumpIsOn === false) return;
	//console.log(this.robot.hitBallMachine.position.y);
	/*
  if(this.jumpV.y==5)
	this.recordTime = 0;
  else
	this.recordTime+=dT;
*/
  var f = new THREE.Vector3(0, -9.8, 0);
  var robotPos = new THREE.Vector3(0, 0, 0);
  this.jumpV.add ( f.clone().multiplyScalar(dT) );
  robotPos.copy(this.robot.hitBallMachine.position);
  robotPos.add ( this.jumpV.clone().multiplyScalar(dT) );
  this.robot.hitBallMachine.position.y = robotPos.y;
  if(this.jumpV.y<0){
	  //console.log(ball.mesh.position.y);
  }
  if(this.robot.hitBallMachine.position.y <= 0.39){
    this.robot.hitBallMachine.position.y = 0.4;
  	this.jumpIsOn=false; 
  } 
}

player.prototype.bisection = function(v0,theta,length,ys,ye){//predict bisection
	return (v0*Math.cos(theta)*(-1*v0*Math.sin(theta)+Math.sqrt( v0*Math.sin(theta)*v0*Math.sin(theta) - 2*9.8*(ye-ys) ))-length*9.8);
}

player.prototype.predict = function(end){//傳進預測點end

	var predictTargetPosForSpike = new THREE.Vector3(0, 0, 0);
  predictTargetPosForSpike.copy(end); 
  
  end.y=ball.mesh.position.y;
  var predictTargetPos = new THREE.Vector3(0, 0, 0);
  predictTargetPos.copy(end); //為不改變end值，這邊複製給另外一個
  var length = predictTargetPos.sub(ball.mesh.position).length(); //計算目前位置跟預測點的水平距離

  if(this.state===1 ){
      var theta = 25/180*Math.PI;
      var v0 = Math.sqrt(length*9.8/Math.sin(2*theta));
    }
    else if(this.state===5){
    	
  		var ballCopy  = new THREE.Vector3(0, 0, 0);
  		ballCopy.copy(ball.mesh.position);
      var ye = predictTargetPosForSpike.y;
      ballCopy.y=ye;
      
      length = predictTargetPosForSpike.sub(ballCopy).length();
      
      var ys = ball.mesh.position.y;
      var theta = 0;//-10/180*Math.PI;
      var v0 = 0;
      
      var a = 0;
      var b = 50;
      var e = 0.0001;
      while(1){
      	var m = (a+b)/2;
        var fm = this.bisection(m,theta,length,ys,ye);
        var fa = this.bisection(a,theta,length,ys,ye);
        if(fm*fa<0)
        	b = m;
        else
        	a = m;
      	if((b-a)/2<e){
        	v0 = a;
        	break;
        }
      }
      
    }
    else if(this.state===3){
    	if(length < 2.5){
        var theta = 82.5/180*Math.PI;
        var v0 = Math.sqrt(length*9.8/Math.sin(2*theta));
      }
      else{
        var theta = 75/180*Math.PI;
        var v0 = Math.sqrt(length*9.8/Math.sin(2*theta));
      }
    }
    else{
      var theta = 50/180*Math.PI;
      var v0 = Math.sqrt(length*9.8/Math.sin(2*theta));
    }
    
	predictTargetPos.copy(end);
    var ballPos = new THREE.Vector3(0, 0, 0);
    ballPos.copy(ball.mesh.position);
    var temp3 = new THREE.Vector3(1, 0, 0);
    
    if(ball.mesh.position.z<end.z)
    	var phi = -1* temp3.angleTo(predictTargetPos.sub(ballPos));
    else
    	var phi = 1* temp3.angleTo(predictTargetPos.sub(ballPos));
    
    return [v0, theta, phi];
}

player.prototype.predictY = function(v0, theta, phi, ye){
  var ys = ball.mesh.position.y;
  var a = 4.9; // 9.8/2
  var b = -v0 * Math.sin(theta);
  var c = ye - ys;
  var t = (b*(-1) + Math.sqrt(Math.pow(b, 2) - 4*a*c)) / (2*a);
  //console.log(t);
  
  var L = v0 * Math.cos(theta) * t;
  var movement = new THREE.Vector3(L, 0, 0);
  var axis = new THREE.Vector3( 0, 1, 0 );
  movement.applyAxisAngle(axis, phi);
  var finalP = new THREE.Vector3( 0, 0, 0 );
  finalP.addVectors(ball.mesh.position.clone(), movement);
  finalP.y = ye;
  /*
	var predictMesh = new THREE.Mesh(new THREE.SphereGeometry(0.2, 32, 32), new THREE.MeshBasicMaterial({transparent: true, 
						 side:THREE.DoubleSide,color: 0x00ffff}));
	predictMesh.position.copy(finalP);
	scene.add(predictMesh);	
*/
  
  
  
  return [finalP,t];
}

player.prototype.makeTarget = function(){
//npc判斷
	
  //predictMesh.position.clone();
	if(this.state === 4){
    var x = Math.random() * 3.5 + 2.5;
    var z = Math.random() * 6 - 3;
    this.preTarget.copy(predictMesh.position);
    if(this.isLeft){
      if(x < 3) x++;
      if(x < 3.5) {
        if(z < 2 && z > -2) z = 2.5;
      }
      this.preTarget.set(x,1.1,z);
      //this.faceTargetAngle = -1*Math.PI/2 - (Math.PI-phi)
    }
  }
  else if(this.state === 5) {
	  var x = Math.random() * 3 + 4.5;
      var z = Math.random() * 5 - 2.5;
      if(x < 5.5) {
          	if(z < 3 && z > -3) {
            	if(z > 0) z = 3;
              else z = -3;
          }
      }
	  if(this.isLeft) {
		  this.preTarget.set(x,0,z);
      }
      else {
		this.preTarget.copy(predictMesh.position);
      }
  }
}

player.prototype.makeTargetAngle = function(){
	var robotPosTemp = new THREE.Vector3(0, 0, 0);
  robotPosTemp.copy(this.robot.hitBallMachine.position);
  if(this.isLeft===false)
  	var temp = new THREE.Vector3(0, 0, -1);
  else
  	var temp = new THREE.Vector3(0, 0, 1);
  var targetTemp = new THREE.Vector3(0, 0, 0);
  if(this.state==3){
  	if(this.isLeft == true){
    	if(this.num === 1){
      	targetTemp.copy(npcPlayer2.robot.hitBallMachine.position);
  			var phi = 1* temp.angleTo(targetTemp.sub(robotPosTemp));
  			return  phi;
      }
      else{
      	targetTemp.copy(npcPlayer1.robot.hitBallMachine.position);
  			var phi = 1* temp.angleTo(targetTemp.sub(robotPosTemp));
  			return  phi;
      }
    }
    else{
    	if(this.num === 1){
      	targetTemp.copy(player2.robot.hitBallMachine.position);
  			var phi = 1* temp.angleTo(targetTemp.sub(robotPosTemp));
  			return  phi;
      }
      else{
      	targetTemp.copy(player1.robot.hitBallMachine.position);
  			var phi = 1* temp.angleTo(targetTemp.sub(robotPosTemp));
  			return  phi;
      }
    }
  	
  }
  
  else if(this.state === 1){
  	targetTemp.copy(this.serveTarget);
  	var phi = 1* temp.angleTo(targetTemp.sub(robotPosTemp));
  	return  phi;
  }
  else{
  	if(this.isLeft==false)
    	targetTemp.copy(predictMesh.position);
    else
  		targetTemp.copy(this.preTarget);
  	var phi = 1* temp.angleTo(targetTemp.sub(robotPosTemp));
  	return  phi;
  }
}
  
player.prototype.update = function(dT){
	if(player1.state === 0 && player2.state === 0 && npcPlayer1.state === 0 && npcPlayer2.state === 0) {
  	if(referee.whoServe === 1) {
    	referee.npcLastMode = 1;
    	referee.whoLastHit = 2;
    	referee.whoServe = 2;
			ball.isOn = false;
  		referee.playing = true;
  		var tmp = Math.random();
      //console.log(tmp);
  		if(tmp > 0.5)
				npcPlayer1.startJump(new THREE.Vector3(3, 2.51, 0),new THREE.Vector3(0, 5, 0),0.1);  
  		else 
				npcPlayer1.startServe(new THREE.Vector3(3, 2.51, 0));
        
      player1.state = 2;
     	player2.state = 2;
     	npcPlayer2.state = 2;
    }
  	return;
  }
	if(this.state === 1){
  	this.serve(dT);
    return;//必要，不然會被下面的調整手臂洗掉機器人的手的位置
  }

	//if(this.state === 0 || this.state === 1) return;
  
  else if(this.state === 2){ //standBy
  //console.log(this.isLeft);
	//console.log(this.robot.hitBallMachine.rotation.y);
  	if(Math.abs(Math.PI/2-this.robot.hitBallMachine.rotation.y)>0.1){
      if(this.robot.hitBallMachine.rotation.y<Math.PI/2)
      	this.robot.hitBallMachine.rotation.y +=dT;
      else
      	this.robot.hitBallMachine.rotation.y -=dT;
    }
  	this.board.target.copy(this.standByPosition);
  	this.board.pos.copy(this.board.mesh.position);
		this.board.step(dT);
  	this.board.mesh.position.x = this.board.pos.x;
  	this.board.mesh.position.z = this.board.pos.z;
    if(this.npc) var frontOrBack = -0.8;
    else var frontOrBack = 0.8;	this.robot.hitBallMachine.position.set(this.board.mesh.position.x+frontOrBack, 0.4, this.board.mesh.position.z);
    
    if(this.hitMode === 0) {
    	if(this.board.mesh.position.y > 1.1)
      	this.board.mesh.position.y -= 0.02;
        
      if(this.updateAngleLeft>BUMP){
    		this.updateAngleLeft -= dT * 3;
    		this.updateAngleRight -= dT * 3;
      }
    }
  }
  
  else if(this.state === 3){ //做球
  	var n = rotation(new THREE.Vector3(0, 1, 0), this.board.mesh.rotation.z, 0); //板子(手)的法線向量
		var p0 = this.board.mesh.localToWorld(new THREE.Vector3(0, -0.1, 0)); 
    // p0為板子(手)上的一點
    var distance = ball.mesh.position.clone().sub(this.board.mesh.localToWorld(new THREE.Vector3(0, 0.3, 0))).lengthSq(); //球與板子(手)的距離
    
  	
    if(distance < 3) { //球跟板子(手)距離小於3，手就開始往上揮
    	this.board.mesh.position.add(n.clone().multiplyScalar(dT*3));
    	this.updateAngleLeft += dT*3;
    	this.updateAngleRight +=  dT*3;
    
    }
    var gotTargetAngle = this.makeTargetAngle()/Math.PI*180%180;
    var robotY = this.robot.hitBallMachine.rotation.y/Math.PI*180%180;

    //console.log(gotTargetAngle+" "+ robotY);
    //this.robot.hitBallMachine.rotation.y = gotTargetAngle;
    if(gotTargetAngle>robotY)
      this.robot.hitBallMachine.rotation.y +=dT;
    else
      this.robot.hitBallMachine.rotation.y -=dT;
    
    if (!ball.collisionDetection(ball.mesh.position, p0, n)){	
    //球運動到跟板子(手)同平面
    	var r = ball.mesh.position.clone().sub(p0);
      var r1 = r.clone().sub(n.clone().multiplyScalar(r.clone().dot(n))).lengthSq();
      if (Math.abs(r1) <= 0.16) { //球在板子(手)的範圍內      	
      	if(this.isLeft) {
        	referee.npcLastMode = 3;
        	referee.whoLastHit = 2;
        	//this.passTarget(new THREE.Vector3(2, 0, 0));
          var tmp = this.predict(new THREE.Vector3(-2, 0, 0)); //算出到(x, 0, z)的速度與角度
          var jumpTarget = this.predictY(tmp[0], tmp[1], tmp[2], 3.7);
  ball.shoot(rotation(new THREE.Vector3(tmp[0], 0, 0), tmp[1], tmp[2]));
  
          if(!(jumpTarget[1] < 2)) jumpTarget[1] = 1;
          if(this.num === 1) {
          	if(npcPlayer2.state === 6) {
            	npcPlayer2.state = 5; //殺球
      				npcPlayer2.chaseTarget = new THREE.Vector3(-2, 3.7, 0);
	  					npcPlayer2.jumpWaitTime = jumpTarget[1];
	  					npcPlayer2.jumpV = new THREE.Vector3(0, 5, 0);
	  					npcPlayer2.jumpIsOn = true;
              npcPlayer2.chaseTarget = jumpTarget[0];
							npcPlayer2.board.vel = new THREE.Vector3(0, 0, 0);
            }
          }
          else if(this.num === 2) {
          	if(npcPlayer1.state === 6) {
            	npcPlayer1.state = 5; //殺球
      				npcPlayer1.chaseTarget = new THREE.Vector3(-2, 3.7, 0);
	  					npcPlayer1.jumpWaitTime = jumpTarget[1];
	  					npcPlayer1.jumpV = new THREE.Vector3(0, 5, 0);
	  					npcPlayer1.jumpIsOn = true;
              npcPlayer1.chaseTarget = jumpTarget[0];
							npcPlayer1.board.vel = new THREE.Vector3(0, 0, 0);
            }
          }
        }
        else {
        	referee.playerLastMode = 3;
        	referee.whoLastHit = 1;
        	//this.passTarget(new THREE.Vector3(-2, 0, 0));
          var tmp = this.predict(new THREE.Vector3(2, 0, 0)); //算出到(x, 0, z)的速度與角度
          var jumpTarget = this.predictY(tmp[0], tmp[1], tmp[2], 3.7);
  ball.shoot(rotation(new THREE.Vector3(tmp[0], 0, 0), tmp[1], tmp[2]));
					if(!(jumpTarget[1] < 2)) jumpTarget[1] = 1;
          if(this.num === 1) {
          	if(player2.state === 6) {
            	player2.state = 5; //殺球
      				player2.chaseTarget = new THREE.Vector3(2, 3.7, 0);
	  					player2.jumpWaitTime = jumpTarget[1];
	  					player2.jumpV = new THREE.Vector3(0, 5, 0);
	  					player2.jumpIsOn = true;
              player2.chaseTarget = jumpTarget[0];
              player2.board.vel = new THREE.Vector3(0, 0, 0);
            }
          }
          else if(this.num === 2) {
          	if(player1.state === 6) {
            	player1.state = 5; //殺球
      				player1.chaseTarget = new THREE.Vector3(2, 3.7, 0);
	  					player1.jumpWaitTime = jumpTarget[1];
	  					player1.jumpV = new THREE.Vector3(0, 5, 0);
	  					player1.jumpIsOn = true;
              player1.chaseTarget = jumpTarget[0];
              player1.board.vel = new THREE.Vector3(0, 0, 0);
            }
          }
        }
    		slapSound.pause();
				slapSound.currentTime = 0;
    		slapSound.play();
      }
      this.state = 2;
    }
    
  	//追落點
  	this.board.target.copy(this.chaseTarget);
  	this.board.pos.copy(this.board.mesh.position);
		this.board.step(dT);
  	this.board.mesh.position.x = this.board.pos.x;
  	this.board.mesh.position.z = this.board.pos.z;
    if(this.npc) var frontOrBack = -0.8;
    else var frontOrBack = 0.8;	this.robot.hitBallMachine.position.set(this.board.mesh.position.x+frontOrBack, 0.4, this.board.mesh.position.z);
  }
  
  
  else if(this.state === 4){ //normal attack
  	var n = rotation(new THREE.Vector3(0, 1, 0), this.board.mesh.rotation.z, 0); //板子(手)的法線向量
		var p0 = this.board.mesh.localToWorld(new THREE.Vector3(0, -0.1, 0)); 
    // p0為板子(手)上的一點
    var distance = ball.mesh.position.clone().sub(this.board.mesh.localToWorld(new THREE.Vector3(0, 0.3, 0))).lengthSq(); //球與板子(手)的距離
    
    if(distance < 3) { //球跟板子(手)距離小於3，手就開始往上揮
    	this.board.mesh.position.add(n.clone().multiplyScalar(dT*3));
    	this.updateAngleLeft += dT*3;
    	this.updateAngleRight +=  dT*3;
    
    }
    var robotPosTemp = new THREE.Vector3(0, 0, 0);
    robotPosTemp.copy(this.robot.hitBallMachine.position);
    if(robotPosTemp.sub(ball.mesh.position).length()<5 && this.preTarget.x==0 && this.preTarget.z==0){
    	this.makeTarget();
      //console.log("makeTarget fin");
    }
    
    if(this.preTarget.x!=0 && this.preTarget.z!=0){
    	var gotTargetAngle = this.makeTargetAngle()/Math.PI*180%180;
      var robotY = this.robot.hitBallMachine.rotation.y/Math.PI*180%180;
      
      //console.log(gotTargetAngle+" "+ robotY);
      //this.robot.hitBallMachine.rotation.y = gotTargetAngle;
      if(gotTargetAngle>robotY)
      	this.robot.hitBallMachine.rotation.y +=dT;
      else
      	this.robot.hitBallMachine.rotation.y -=dT;
    }
    
    if (!ball.collisionDetection(ball.mesh.position, p0, n)){	
    //球運動到跟板子(手)同平面
    	var r = ball.mesh.position.clone().sub(p0);
      var r1 = r.clone().sub(n.clone().multiplyScalar(r.clone().dot(n))).lengthSq();
      if (Math.abs(r1) <= 0.16) { //球在板子(手)的範圍內     
        if(this.isLeft) {  
        	this.passTarget(this.preTarget);
          this.preTarget.set(0,0,0);
        }
        else {
        	referee.playerLastMode = 4;
        	referee.whoLastHit = 1;
        	this.passTarget(predictMesh.position.clone());
          this.preTarget.set(0,0,0);
        }
        this.state = 2;
        
        slapSound.pause();
				slapSound.currentTime = 0;
    		slapSound.play();
      }
      if(!this.isLeft){
      	if(playerCoach.isOne) this.state = 2;
      }
      else if(this.isLeft){
      	if(npcCoach.isOne) this.state = 2;
      }
    }
    
    //追落點
	this.board.target.copy(this.chaseTarget);
	this.board.pos.copy(this.board.mesh.position);
		this.board.step(dT);
	this.board.mesh.position.x = this.board.pos.x;
	this.board.mesh.position.z = this.board.pos.z;
	if(this.npc) var frontOrBack = -0.8;
	else var frontOrBack = 0.8;	this.robot.hitBallMachine.position.set(this.board.mesh.position.x+frontOrBack, 0.4, this.board.mesh.position.z);
  
  
  
  }
  
  else if(this.state === 5){ //殺球
	
	this.jumpWaitTime -=dT;
	
	if(this.updateAngleRight <= Math.PI && this.jumpState === 0){
    	this.updateAngleLeft += dT*5;
    	this.updateAngleRight +=  dT*5;	
	}
	//if(this.jumpWaitTime<0.1 && this.jumpWaitTime>-0.1 )
		//console.log(this.robot.handRight.localToWorld(new THREE.Vector3(0,0,0)));
		
	
  var robotPosTemp = new THREE.Vector3(0, 0, 0);
    robotPosTemp.copy(this.robot.hitBallMachine.position);
    if(robotPosTemp.sub(ball.mesh.position).length()<3 && this.preTarget.x==0 && this.preTarget.z==0){
    	this.makeTarget();
      //console.log("makeTarget fin");
    }
    
    if(this.preTarget.x!=0 && this.preTarget.z!=0){
    	var gotTargetAngle = this.makeTargetAngle()/Math.PI*180%180;
      var robotY = this.robot.hitBallMachine.rotation.y/Math.PI*180%180;
      
      //console.log(gotTargetAngle+" "+ robotY);
      //this.robot.hitBallMachine.rotation.y = gotTargetAngle;
      if(gotTargetAngle>robotY)
      	this.robot.hitBallMachine.rotation.y +=dT;
      else
      	this.robot.hitBallMachine.rotation.y -=dT;
    }
  
	if(this.jumpWaitTime<0 && this.jumpState === 0){
		  if(this.isLeft) {
      	referee.npcLastMode = 5;
      	referee.whoLastHit = 2;
        	this.passTarget(this.preTarget);
          this.preTarget.set(0,0,0);
      }
      else {
      	referee.playerLastMode = 5;
      	referee.whoLastHit = 1;
        this.passTarget(predictMesh.position.clone());
        this.preTarget.set(0,0,0);
      }
			this.jumpState = 1;
      spikeSound.pause();
			spikeSound.currentTime = 0;
    	spikeSound.play();
	}
	
	if(this.jumpIsOn == false){
		this.state = 2;
		this.jumpState = 0;
	}
	
	if(this.jumpWaitTime<0.7){
		this.jump(dT);
		
    	this.updateAngleLeft -= dT*3;
    	this.updateAngleRight -=  dT*3;	
	}
	else
		console.log("check wait");
	
	//追落點
	this.board.target.copy(this.chaseTarget);
	this.board.pos.copy(this.board.mesh.position);
		this.board.step(dT);
	this.board.mesh.position.x = this.board.pos.x;
	this.board.mesh.position.z = this.board.pos.z;
	if(this.npc) var frontOrBack = -0.8;
	else var frontOrBack = 0.8;	
	
	//this.robot.hitBallMachine.position.x = this.board.mesh.position.x;
	this.robot.hitBallMachine.position.x = this.board.mesh.position.x+frontOrBack;
	this.robot.hitBallMachine.position.z = this.board.mesh.position.z;

  }
  else if(this.state === 6){ //移動到殺球位置
  	//追落點
		this.board.target.copy(this.chaseTarget);
		this.board.pos.copy(this.board.mesh.position);
		this.board.step(dT);
		this.board.mesh.position.x = this.board.pos.x;
		this.board.mesh.position.z = this.board.pos.z;
		if(this.npc) var frontOrBack = -0.8;
		else var frontOrBack = 0.8;	
	
		this.robot.hitBallMachine.position.x = this.board.mesh.position.x+frontOrBack;
	this.robot.hitBallMachine.position.z = this.board.mesh.position.z;
  }
  
  else if(this.state === 7){ //回到起始位置
  	//追落點
    if(referee.whoServe === 1) {
    	if(this.isLeft) {
    		if(this.num === 1) this.chaseTarget = new THREE.Vector3(-9, 1.1, 0);
      	else this.chaseTarget = this.standByPosition;
    	}
    	else {
    		if(this.num === 1) this.chaseTarget = this.standByPosition;
      	else this.chaseTarget = this.standByPosition;
    	}
    }
    else {
    	if(this.isLeft) {
    		if(this.num === 1) this.chaseTarget = this.standByPosition;
      	else this.chaseTarget = this.standByPosition;
    	}
    	else {
    		if(this.num === 1) this.chaseTarget = new THREE.Vector3(9, 1.1, 0);
      	else this.chaseTarget = this.standByPosition;
    	}
    }
		this.board.target.copy(this.chaseTarget);
		this.board.pos.copy(this.board.mesh.position);
		this.board.step(dT);
		this.board.mesh.position.x = this.board.pos.x;
		this.board.mesh.position.z = this.board.pos.z;
		if(this.npc) var frontOrBack = -0.8;
		else var frontOrBack = 0.8;	
	
		this.robot.hitBallMachine.position.x = this.board.mesh.position.x+frontOrBack;
	this.robot.hitBallMachine.position.z = this.board.mesh.position.z;
  
  	//回到待機狀態
  	if(this.board.mesh.position.clone().sub(this.chaseTarget).length() < 1) {
    	this.board.vel = new THREE.Vector3(0, 0, 0);
    	this.state = 0;
    }
  }
  else if(this.state === 8){
    return;
  }
  
  
  //實際改robot的數值
  
  if(this.isLeft === true){
    this.robot.hitBallMachineHandLeft.rotation.x = -1*this.updateAngleRight;//-1反過來，左右手也是
    this.robot.hitBallMachineHandRight.rotation.x = -1*this.updateAngleLeft; 
    
  } 
  else{
    this.robot.hitBallMachineHandLeft.rotation.x = this.updateAngleRight;
    this.robot.hitBallMachineHandRight.rotation.x = this.updateAngleLeft;  
  }
  
}


player.prototype.passTarget = function(end){
  var tmp = this.predict(end); //算出到(x, 0, z)的速度與角度
  ball.shoot(rotation(new THREE.Vector3(tmp[0], 0, 0), tmp[1], tmp[2])); //將球射出去
  var bumpTarget = this.predictY(tmp[0], tmp[1], tmp[2], 1.1); //算出球運動到y=1.1時的位置
  var jumpTarget = this.predictY(tmp[0], tmp[1], tmp[2], 3.7);
  var groundTarget = this.predictY(tmp[0], tmp[1], tmp[2], 0.2);
  //將y=1.1時的位置傳給對場的coach
  if(this.isLeft) {
  	playerCoach.isOn = true;
    playerCoach.groundTarget = groundTarget[0];
  	playerCoach.bumpTarget = bumpTarget[0];
		playerCoach.jumpTarget = jumpTarget[0];
		playerCoach.jumpTime = jumpTarget[1];
	
  }
  else {
   	npcCoach.isOn = true;
    npcCoach.groundTarget = groundTarget[0];
  	npcCoach.bumpTarget = bumpTarget[0];
  	npcCoach.jumpTarget = jumpTarget[0];
		npcCoach.jumpTime = jumpTarget[1];
  }
}
