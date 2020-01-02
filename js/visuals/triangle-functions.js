var TriangleFunctions = function(){
	// ortocentrum (wysokosci)
	this.heightLine=function(A, B, C){
		var H = new DynamicVector(function(__this){
			//vector of the AB line
			var vector= new Vector((B.x-A.x), (B.y-A.y));

			//side equation
			var a=vector.y/vector.x;
			var b=A.y-a*A.x;

			//height equation
			var a2=a==0?-1000000000000000000000000:-1/a;// max and infinity values for some reason didn't work
			var b2=C.y-a2*C.x;

			__this.x=(b-b2)/(a2-a);
			__this.y=a*__this.x+b;
		}, this);

		//height line
		var line = new Line(C,H);
		line.color="#4CAF50";
		this.add(line);
		AppearMixin.call(line);

		//sides' extensions
		var line2 = new Line(A,H);
		line2.alpha=0.2;
		line2.dashed=true;
		this.add(line2);
		AppearMixin.call(line2);
		var line3 = new Line(B,H);
		line3.dashed=true;
		line3.alpha=0.2;
		this.add(line3);
		AppearMixin.call(line3);

		return [line, line2, line3];
	}
	// srodkek ciezkosci (srodkowe)
	this.middleSideLine=function(A, B, C){
		var M = new DynamicVector(function(__this){
			__this.x=(B.x+C.x)/2;
			__this.y=(B.y+C.y)/2;
		}, this);

		//line from middle of the side to opposed vertex
		var line = new Line(A,M);
		line.color="#4CAF50";
		this.add(line);
		AppearMixin.call(line);
		return line;
	}

	// syemtralna boku
	this.normal=function(A, B){
		var left = new DynamicVector(function(__this){
			var middle= new Vector((A.x+B.x)/2, (A.y+B.y)/2);
			var vector= new Vector((B.x-A.x), (B.y-A.y));
			var a=vector.y/vector.x;
			a=-1/a;
			var b=middle.y-a*middle.x;
			__this.x=0;
			__this.y=b;
		}, this);

		var right = new DynamicVector(function(__this){
			var middle= new Vector((A.x+B.x)/2, (A.y+B.y)/2);
			var vector= new Vector((B.x-A.x), (B.y-A.y));
			var a=vector.y/vector.x;
			a=-1/a;
			var b=middle.y-a*middle.x;
			__this.x=800;
			__this.y=800*a+b;
		}, this);

		//line from middle of the 
		var line = new Line(left,right);
		line.color="#4CAF50";
		this.add(line);
		AppearMixin.call(line);
		return line;
	}

	this.angleBisector=function(A, B, C){
		var left = new DynamicVector(function(__this){
			var middle= new Vector((A.x+B.x)/2, (A.y+B.y)/2);
			var a=(middle.y-C.y)/(middle.x-C.x);
			var b=C.y-a*C.x;
			__this.x=800;
			__this.y=800*a+b;
		}, this);

		var right = new DynamicVector(function(__this){
			var middle= new Vector((A.x+B.x)/2, (A.y+B.y)/2);
			var a=(middle.y-C.y)/(middle.x-C.x);
			var b=C.y-a*C.x;
			__this.x=0;
			__this.y=b;
		}, this);

		//line from middle of the 
		var line = new Line(left,right);
		line.color="#4CAF50";
		this.add(line);
		AppearMixin.call(line);
		return line;
	}

	this.reflection=function(A, B){
		return new DynamicVector(function(_this){
			_this.x=2*B.x-A.x;
			_this.y=2*B.y-A.y;
		}, this);
	}

	this.centerOfMass=function(A, B, C){
		return new DynamicVector(function(_this){
			_this.x=(A.x+B.x+C.x)/3;
			_this.y=(A.y+B.y+C.y)/3;
		}, this);
	}

	this.eulerLine=function(A, B, C){

		//middle side lines intersection point
		var MSLIntersection = function(){
			//line goes from |AB| middle to C
			var middle= new Vector((A.x+B.x)/2, (A.y+B.y)/2);
			var vector= new Vector((C.x-middle.x), (C.y-middle.y));
			var a=vector.y/vector.x;
			var b=C.y-a*C.x;

			//line goes from |AC| middle to B
			var middle= new Vector((A.x+C.x)/2, (A.y+C.y)/2);
			var vector= new Vector((B.x-middle.x), (B.y-middle.y));
			var a2=vector.y/vector.x;
			var b2=B.y-a2*B.x;

			var intersection=new Vector(0, 0);

			intersection.x=(b2-b)/(a-a2)
			intersection.y=a*intersection.x+b;

			return intersection;
		};


		var NormalIntersection = function(){
			//line must go through the point where middle side lines intersect and where normals intersect
			var middle= new Vector((A.x+B.x)/2, (A.y+B.y)/2);
			var vector= new Vector((B.x-A.x), (B.y-A.y));
			var a=vector.y/vector.x;
			a=-1/a;
			var b=middle.y-a*middle.x;

			var middle= new Vector((A.x+C.x)/2, (A.y+C.y)/2);
			var vector= new Vector((C.x-A.x), (C.y-A.y));
			var a2=vector.y/vector.x;
			a2=-1/a2;
			var b2=middle.y-a2*middle.x;

			var intersection=new Vector(0, 0);

			intersection.x=(b2-b)/(a-a2)
			intersection.y=a*intersection.x+b;

			return intersection;
		};

		var left = new DynamicVector(function(__this){
			var P=MSLIntersection();
			var R=NormalIntersection();
			var middle= new Vector((P.x+R.x)/2, (P.y+R.y)/2);
			var vector= new Vector((P.x-R.x), (P.y-R.y));
			var a=vector.y/vector.x;
			var b=middle.y-a*middle.x;
			__this.x=0;
			__this.y=b;
		}, this);

		var right = new DynamicVector(function(__this){
			var P=MSLIntersection();
			var R=NormalIntersection();
			var middle= new Vector((P.x+R.x)/2, (P.y+R.y)/2);
			var vector= new Vector((P.x-R.x), (P.y-R.y));
			var a=vector.y/vector.x;
			var b=middle.y-a*middle.x;
			__this.x=800;
			__this.y=800*a+b;
		}, this);


		var line = new Line(left, right);
		AppearMixin.call(line);
		this.add(line);
		return line;
	}
	return this;
};