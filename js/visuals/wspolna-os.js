var WspolnaOs = new (function(){
	GraphicsEngine.call(this, "wspolna-os-canvas");// 'this' is instance of GraphicsEngine
	TriangleFunctions.call(this);// 'this' is instance of tringle operations helper class

	var stepper = new Stepper(this);
	this.pagination = new Pagination("wspolna-os-pagination", stepper.move);// connect pagination controlling object with stepper

	// Triangle
	var p = new Handle(this.width/2-50,100);
	this.add(p);
	this.add(new Letter(p, 'A'));
	var p2 = new Handle(150,this.height-30);
	this.add(p2);
	this.add(new Letter(p2, 'C'));
	var p3 = new Handle(this.width-100,this.height-100);
	this.add(p3);
	this.add(new Letter(p3, 'B'));
	var line = new Line(p,p2);
	this.add(line);
	var line2 = new Line(p2,p3);
	this.add(line2);
	var line3 = new Line(p3,p);
	this.add(line3);

	var middleSideLines=[this.middleSideLine(p, p2, p3),
        this.middleSideLine(p2, p, p3),
        this.middleSideLine(p3, p, p2)];

	var G=this.centerOfMass(p, p2, p3);
    var GLetter=this.add(new Letter(G, "G"));
    AppearMixin.call(GLetter);

	this.add(new Text(50, 50, "Trójkąty o wspólnej prostej Eulera:", "25px Roboto"));

	var text1=this.add(new Text(50, 50+25, "- trójkąt ABC",  "20px Roboto"));
	var text2=this.add(new Text(50, 50+25*2, "- trójkąt XYZ",  "20px Roboto"));
	var text3=this.add(new Text(50, 50+25*3, "- środkowe trókąta ABC",  "20px Roboto"));
	var text4=this.add(new Text(50, 50+25*4, "- punkt G", "20px Roboto"));
	var text5=this.add(new Text(50, 50+25*5, "- ich wspólna prosta Eulera", "20px Roboto"));

	[text1, text2, text3, text4, text5].forEach(function(t){
		t.alpha=0.4;
		AppearMixin.call(t);
	});
	
	var _this=this;

	function middle(A,B){
		return new DynamicVector(function(vector){
			vector.x=(A.x+B.x)/2;
			vector.y=(A.y+B.y)/2;
		}, _this);
	}

	// Triangle points
	var s = middle(p, p2);
	var s2 = middle(p2,p3);
	var s3 = middle(p,p3);
	
	// Letter points
	var l=this.add(new Letter(s, 'X'));
	var l2=this.add(new Letter(s2, 'Z'));
	var l3=this.add(new Letter(s3, 'Y'));

	//Traingle sides
	var line = new Line(s,s2);
	line.color="#4CAF50";
	AppearMixin.call(line);
	this.add(line);
	var line2 = new Line(s2,s3);
	AppearMixin.call(line2);
	this.add(line2);
	line2.color="#4CAF50";
	var line3 = new Line(s3,s);
	AppearMixin.call(line3);
	this.add(line3);
	line3.color="#4CAF50";

	stepper.add(new GroupEnableStep([l, l2, l3, line, line2, line3, text2]));

	stepper.add(new GroupEnableStep([text3].concat(middleSideLines)));

	stepper.add(new GroupEnableStep([GLetter, text4]));

	stepper.add(new GroupEnableStep([this.eulerLine(p, p2, p3), text5]));

	return this;
})();