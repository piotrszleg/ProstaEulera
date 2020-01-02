var Dwusieczna = new (function(){
	GraphicsEngine.call(this, "dwusieczna-canvas");// 'this' is instance of GraphicsEngine
	TriangleFunctions.call(this);// 'this' is instance of tringle operations helper class

	var stepper = new Stepper(this);
	this.pagination = new Pagination("dwusieczna-pagination", stepper.move, false);// connect pagination controlling object with stepper

	var radius=220;
	var circle=this.add(new Circle(this.width/2, this.height/2, radius));


	// Triangle
	var p = new HandleInCircle(this.width/2-80,100, circle);
	this.add(p);
	this.add(new Letter(p, 'B'));
	var p2 = new HandleInCircle(100,this.height-200, circle);
	this.add(p2);
	this.add(new Letter(p2, 'A'));
	var p3 = new HandleInCircle(this.width-150,this.height-170, circle);
	this.add(p3);
	this.add(new Letter(p3, 'C'));
	var line = new Line(p,p2);
	this.add(line);
	var line2 = new Line(p2,p3);
	this.add(line2);
	var line3 = new Line(p3,p);
	this.add(line3);

	this.K=new DynamicVector(function(_this){

		var A=p;
		var B=p2;
		var C=p3;
		var middle= new Vector((A.x+B.x)/2, (A.y+B.y)/2);
		var la=(middle.y-C.y)/(middle.x-C.x);
		var lb=C.y-la*C.x;

		var a=1+la*la;
		var b=2*la*lb-2*la*circle.y-2*circle.x;
		var c=circle.x*circle.x+lb*lb-2*lb*circle.y+circle.y*circle.y-radius*radius;
		
		var delta=b*b-4*a*c;
		if(C.x>(B.x+A.x)/2){
			_this.x=(-b-Math.sqrt(delta))/(2*a);
		} else {
			_this.x=(-b+Math.sqrt(delta))/(2*a);
		}
		_this.y=_this.x*la+lb;

	}.bind(this), this);
	var letterK=this.add(new Letter(this.K, 'K'));

	this.add(new Text(50, 50, "Okrąg opisany na trójkącie ABC:", "25px Roboto"));

	var text1=this.add(new Text(50, 50+25, "- dwusieczna kąta ACB",  "20px Roboto"));
	var text2=this.add(new Text(50, 50+25*2, "- punkt K", "20px Roboto"));

	text1.alpha=0.4;
	text2.alpha=0.4;

	AppearMixin.call(text1);
	AppearMixin.call(text2);

	stepper.add(new GroupEnableStep([this.angleBisector(p, p2, p3), text1]));
	stepper.add(new GroupEnableStep([text2, this.K, letterK]));

	return this;
})();