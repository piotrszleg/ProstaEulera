var Odbicia = new (function(){
	GraphicsEngine.call(this, "odbicia-canvas");// 'this' is instance of GraphicsEngine
	TriangleFunctions.call(this);// 'this' is instance of tringle operations helper class

	var stepper = new Stepper(this);
	this.pagination = new Pagination("odbicia-pagination", stepper.move);// connect pagination controlling object with stepper

	// Origninal triangle
	var A = new Handle(this.width/2,270);
	this.add(A);
	this.add(new Letter(A, 'A'));
	var B = new Handle(this.width-300,this.height-170);
	this.add(B);
	this.add(new Letter(B, 'B'));
	var C = new Handle(290,this.height-170);
	this.add(C);
	this.add(new Letter(C, 'C'));
	var line = new Line(A,B);
	this.add(line);
	var line2 = new Line(B,C);
	this.add(line2);
	var line3 = new Line(C,A);
	this.add(line3);

	// Texts, four later will be hooked to steps
	this.add(new Text(50, 50, "Trójkąty o wspólnym środku ciężkości:", "25px Roboto"));
	var text1=this.add(new Text(50, 50+25, "- trójkąt ABC",  "20px Roboto"));
	var text2=this.add(new Text(50, 50+25*2, "- trójkąt KLM", "20px Roboto"));
	var text3=this.add(new Text(50, 50+25*3, "- ich środkowe", "20px Roboto"));
	var text4=this.add(new Text(50, 50+25*4, "- ich wspólny środek ciężkości", "20px Roboto"));

	text1.alpha=0.4;
	text2.alpha=0.4;
	text3.alpha=0.4;
	text4.alpha=0.4;

    AppearMixin.call(text2);
	AppearMixin.call(text3);
    AppearMixin.call(text4);

    // Second traingle
	var K = this.reflection(A,C);
	var KLetter=this.add(new Letter(K, 'K'));
	var L = this.reflection(C,B);
	var LLetter=this.add(new Letter(L, 'L'));
	var M = this.reflection(B,A);
	var MLetter=this.add(new Letter(M, 'M'));
    var KL = new Line(K,L);
	this.add(KL);
    var LM= new Line(L,M);
	this.add(LM);
    var MK = new Line(M,K);
    this.add(MK);
    
    var KA = new Line(K,A);
    KA.color="#4CAF50";
	this.add(KA);
    var LC = new Line(L,C);
    LC.color="#4CAF50";
	this.add(LC);
    var MB = new Line(M,B);
    MB.color="#4CAF50";
    this.add(MB);

    var G=this.centerOfMass(A, B, C);
    var GLetter=this.add(new Letter(G, "G"));
    AppearMixin.call(GLetter);

    var secondTriangle=[KL, LM, MK, KA, LC, MB, KLetter, LLetter, MLetter, text2];
    secondTriangle.forEach(function(t){
        AppearMixin.call(t);
    })

    stepper.add(new GroupEnableStep(secondTriangle));

    var middleSideLines=[this.middleSideLine(A, B, C),
        this.middleSideLine(B, A, C),
        this.middleSideLine(C, A, B)];

    var middleSideLines2=[this.middleSideLine(K, L, M),
        this.middleSideLine(L, K, M),
        this.middleSideLine(M, K, L)];
    stepper.add(new MergeSteps([new GroupEnableStep([].concat(middleSideLines, middleSideLines2, text3)), new GroupFadeoutStep([KA, LC, MB])]));

	stepper.add(new GroupEnableStep([GLetter, text4]));

	return this;
})();