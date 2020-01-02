var Wstep = new (function(){
	GraphicsEngine.call(this, "wstep-canvas");// 'this' is instance of GraphicsEngine
	TriangleFunctions.call(this);// 'this' is instance of tringle operations helper class

	var stepper = new Stepper(this);
	this.pagination = new Pagination("wstep-pagination", stepper.move);// connect pagination controlling object with stepper

	// Triangle
	var p = new Handle(this.width/2,100);
	this.add(p);
	this.add(new Letter(p, 'A'));
	var p2 = new Handle(this.width-150,this.height-30);
	this.add(p2);
	this.add(new Letter(p2, 'B'));
	var p3 = new Handle(100,this.height-100);
	this.add(p3);
	this.add(new Letter(p3, 'C'));
	var line = new Line(p,p2);
	this.add(line);
	var line2 = new Line(p2,p3);
	this.add(line2);
	var line3 = new Line(p3,p);
	this.add(line3);

	// Texts, four later will be hooked to steps
	this.add(new Text(50, 50, "Czym jest prosta Eulera?", "25px Roboto"));
	var text1=this.add(new Text(50, 50+25, "- wysokości",  "20px Roboto"));
	var text2=this.add(new Text(50, 50+25*2, "- środkowe", "20px Roboto"));
	var text3=this.add(new Text(50, 50+25*3, "- symetralne boków", "20px Roboto"));
	var text4=this.add(new Text(50, 50+25*4, "- prosta Eulera", "20px Roboto"));

	text1.alpha=0.4;
	text2.alpha=0.4;
	text3.alpha=0.4;
	text4.alpha=0.4;

	AppearMixin.call(text1);
	AppearMixin.call(text2);
	AppearMixin.call(text3);
	AppearMixin.call(text4);

	this.cursor=new Sprite(0, 0, "img/cursor.png");
	var cursorSpeed=5;
	var timeoutSet=false;

	this.follow=function(follower, point, speed, onFinished){
		var followUpdate = function(){
			var movement=Vector(point.x-follower.x, point.y-follower.y);
			Vector.normalize(movement);
			follower.x+=movement.x*speed;
			follower.y+=movement.y*speed;
			if(Vector.distance(follower, point)<speed){
				this.updates.splice(this.updates.indexOf(followUpdate), 1);
				onFinished();
			}
		}.bind(this);
		this.updates.push(followUpdate);
	}
	this.makeCircle=function(follower, radius, rounds, speed, onFinished){
		var progress=0;
		var originalPosition=new Vector(follower.x, follower.y);
		var circleUpdate = function(){
			progress+=speed;
			follower.x=originalPosition.x+Math.cos(progress*(2*Math.PI))*radius;
			follower.y=originalPosition.y+Math.sin(progress*(2*Math.PI))*radius;
			if(progress>=rounds){
				this.updates.splice(this.updates.indexOf(circleUpdate), 1);
				onFinished();
			}
		}.bind(this);
		this.updates.push(circleUpdate);
	}

	this.cursorReplacementUpdate=function(){

		this.mousePosition=new Vector(this.cursor.x, this.cursor.y);
		this.mouseDown=true;
	}

	// it blocks updates of points used to create eulers line
	this.follow(this.cursor, p, 6, function(){
		this.cursor.src="img/move-cursor.png";
		this.updates.push(this.cursorReplacementUpdate.bind(this));
		this.makeCircle(this.cursor, 35, 1.6, 0.025, function(){
			console.log(this.updates.splice(this.updates.indexOf(this.cursorReplacementUpdate), 1));
			this.remove(this.cursor);
			this.mouseDown=false;
		}.bind(this));
	}.bind(this));
	this.add(this.cursor);

	// height lines returns array of three lines, so they need to be concated into one array to become a step
	var heightLines=[].concat(this.heightLine(p, p2, p3), 
					 this.heightLine(p2, p3, p), 
					 this.heightLine(p3, p, p2));

	stepper.add(new GroupEnableStep( [text1].concat(heightLines)));

	var middleSideLines=[this.middleSideLine(p, p2, p3),
					 this.middleSideLine(p2, p, p3),
					 this.middleSideLine(p3, p, p2)];
	stepper.add(new GroupEnableStep([text2].concat(middleSideLines)));

	var normals=[this.normal(p, p2),
				 this.normal(p2, p3),
				 this.normal(p3, p)];
	stepper.add(new GroupEnableStep([text3].concat(normals)));

	stepper.add(new MergeSteps([new GroupEnableStep([this.eulerLine(p, p2, p3), text4]), new GroupFadeoutStep([].concat(heightLines, middleSideLines, normals))]));

	return this;
})();