//Class managing drawing objects on canvas and input
var GraphicsEngine = function(canvas_id) {
	//rendering canvas
    this.canvas=document.getElementById(canvas_id);
    this.ctx = this.canvas.getContext("2d");
    this.width=this.canvas.width;
    this.height=this.canvas.height;
    // input
	this.mousePosition=new Vector(0,0);
	this.mouseDown=false;

    // objects list
    this.objects=[];
    this.add=function(object){
    	this.objects.push(object);
        return object;
    }
    this.remove=function(object){
        if(this.objects.indexOf(object)>0){
            this.objects.splice(this.objects.indexOf(object), 1); 
        }
    }

    // adding a function to this array will make it executed every 60 seconds
    this.updates=[];

    // update
    this.update=function(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);// clear canvas
        this.canvas.style.cursor="default";// reset cursor

        // call update functions
        for (var j = 0; j < this.updates.length; j++) {
            this.updates[j]();
        }

        // draw objects
    	for (var i = 0; i < this.objects.length; i++) {
            if(!this.objects[i].disabled){
    		  this.objects[i].draw(this);
            }
    	}
    }
    setInterval(this.update.bind(this), 1000/60);

    // events
	var _this=this;// remembers current this in events' scope
	this.mousemove=function(e) {
		var rect=e.currentTarget.getBoundingClientRect();
		_this.mousePosition=new Vector((e.clientX-rect.left)/rect.width*_this.width, (e.clientY-rect.top)/rect.height*_this.height);
	}
    this.mousedown=function(e) {
        _this.mouseDown=true;
    }
    this.mouseup=function(e) {
        _this.mouseDown=false;
    }
    this.canvas.addEventListener("mousemove", this.mousemove, false);
    this.canvas.addEventListener("mouseup", this.mouseup, false);
    this.canvas.addEventListener("mousedown", this.mousedown, false);
    
    return this;
}

// Handle graphic displayed as circle
// If moveable can be moved by mouse
// It can be used as a Vector
var Handle = function(x, y) {
	//properties
    this.x=x;
    this.y=y;
    this.moveable=true;
    this.size=10;

    //internals
    this.selected=false;

    this.draw=function(engine){
		if(this.moveable){
	        if(Vector.distance(this, engine.mousePosition)<20){  
                engine.canvas.style.cursor="move";
                this.size=14;
                if(engine.mouseDown && engine.selected==undefined){
                   this.selected=true;
                   engine.selected=this;
                }
	        } else {
                this.size=10;
            }
	        if(!engine.mouseDown){
	            this.selected=false; 
                if(engine.selected==this){
                    engine.selected=undefined;
                }
	        }
	        // if it is selected move it to the mouse position
	        if(this.selected){
	        	this.x=engine.mousePosition.x;
	            this.y=engine.mousePosition.y;
                this.size=16;
        	}
	    }
        engine.ctx.save();
        engine.ctx.strokeStyle="#4CAF50";
        engine.ctx.lineWidth=2;
    	engine.ctx.beginPath();
		engine.ctx.arc(this.x,this.y,this.size,0,2*Math.PI);
		engine.ctx.stroke();
		engine.ctx.restore();
    }
    return this;
}

var HandleInCircle = function(x, y, circle) {
    //properties
    this.x=x;
    this.y=y;
    this.moveable=true;
    this.size=10;
    this.circle=circle;

    //internals
    this.selected=false;

    this.draw=function(engine){
        if(this.moveable){
            if(Vector.distance(this, engine.mousePosition)<20){
                engine.canvas.style.cursor="move";
                this.size=14;
                if(engine.mouseDown && engine.selected==undefined){
                   this.selected=true;
                   engine.selected=this;
                }
            } else {
                this.size=10;
            }
            if(!engine.mouseDown){
                this.selected=false;
                if(engine.selected==this){
                    engine.selected=undefined;
                }
            }
            // if it is selected move it to the mouse position
            if(this.selected){
                this.x=engine.mousePosition.x;
                this.y=engine.mousePosition.y;
                this.size=16;
            }
        }
        this.relativePosition=new Vector(this.x-this.circle.x, this.y-this.circle.y);
        Vector.normalize(this.relativePosition);
        this.x=this.circle.x+this.relativePosition.x*circle.radius;
        this.y=this.circle.y+this.relativePosition.y*circle.radius;

        engine.ctx.save();
        engine.ctx.strokeStyle="#4CAF50";
        engine.ctx.lineWidth=2;
        engine.ctx.beginPath();
        engine.ctx.arc(this.x,this.y,this.size,0,2*Math.PI);
        engine.ctx.stroke();
        engine.ctx.restore();
    }
    return this;
}

var Circle=function(x, y, radius) {
    //properties
    this.x=x;
    this.y=y;
    this.radius=radius;

    this.draw=function(engine){
        engine.ctx.beginPath();
        engine.ctx.arc(this.x,this.y,this.radius,0,2*Math.PI);
        engine.ctx.stroke();
    }
    return this;
}

var AppearMixin=function(){
    this.speed=0.05;
    this.finished=false;
    if (!('alpha' in this)){
        this.alpha=1;
    }
    this.initialAlpha=this.alpha;

    this.stopAppearing=function(){
        clearTimeout(this.animation);
    }

    this.appear=function(){
        if(this.finished){
            this.finished=false;
            this.alpha=0;
        }
        if(this.alpha<this.initialAlpha){
            this.alpha=Math.min(this.alpha+this.speed, this.initialAlpha);
            this.animation=setTimeout(this.appear.bind(this), 1000/60);
        } else{
            this.finished=true;
        }
    }
    this.disappear=function(){
        if(this.finished){
            this.finished=false;
            this.alpha=this.initialAlpha;
        }
        if(this.alpha>0){
            this.alpha=Math.max(this.alpha-this.speed, 0);
            this.animation=setTimeout(this.disappear.bind(this), 1000/60);
        } else {
            this.finished=true;
        }
    }
    return this;
}

// Vector that is updated every frame using passed 'update' function
var DynamicVector = function(update, engine){
	this.x=0;
	this.y=0;
	var _this=this;

	//calls update function every frame
	this.update=function(){update(_this);};
	this.update();
	engine.updates.push(this.update);

    return this;
}

// Line graphic
var Line = function(A, B) {
	// A and B Point objects connected by the line
    this.A=A;
    this.B=B;
    this.alpha=1;
    this.color="black";
    this.dashed=false;

    this.draw=function(engine){
    	engine.ctx.save();
    	engine.ctx.strokeStyle=this.color;
        engine.ctx.globalAlpha=this.alpha;
        if(this.dashed==true){
            engine.ctx.setLineDash([7, 10]);
        }
    	engine.ctx.beginPath();
    	engine.ctx.moveTo(this.A.x, this.A.y);
		engine.ctx.lineTo(this.B.x,this.B.y);
		engine.ctx.stroke();
		engine.ctx.restore();
    }
    return this;
}

var Letter = function(point, letter){
    this.point=point;
    this.letter=letter;
    this.offset=new Vector(8, -10);
    this.font="25px Roboto";

    this.draw=function(engine){
        engine.ctx.save();
        if("alpha" in this.point){
            engine.ctx.globalAlpha=this.point.alpha;
        } else if("alpha" in this){
            engine.ctx.globalAlpha=this.alpha;
        }
        engine.ctx.font = this.font;
        engine.ctx.fillText(this.letter, this.point.x+this.offset.x, this.point.y+this.offset.y);
        engine.ctx.restore();
    }
    return this;
}

var Sprite = function(x, y, src){
    this.x=x;
    this.y=y;
    this.src=src;
    this.image=new Image();
    this.image.src=src;

    this.draw=function(engine){
        if(this.image.src!=this.src){
            this.image.src=this.src;
        }
        engine.ctx.drawImage(this.image, this.x-this.image.width/2, this.y-this.image.height/2);
    }
    return this;
}

var Text = function(x, y, text, font=""){
    this.x=x;
    this.y=y;
    this.text=text;
    this.font=font;
    this.alpha=1;
    this.draw=function(engine){
        engine.ctx.save();
        engine.ctx.globalAlpha=this.alpha;
        if(this.font!=""){
            engine.ctx.font = this.font;
        }
        engine.ctx.fillText(this.text, this.x, this.y);
        engine.ctx.restore();
    }
    return this;
}

var Vector = function(x, y) {
    this.x=x;
    this.y=y;
    return this;
}
Vector.distance=function(A, B){
    x=A.x-B.x;
    y=A.y-B.y;
    return Math.sqrt(x*x+y*y);
}
Vector.normalize=function(A){
    var length=Math.sqrt(A.x*A.x+A.y*A.y);
    A.x=A.x/length;
    A.y=A.y/length;
}