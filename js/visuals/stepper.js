// Calls next steps when user requests it
var Stepper = function(engine){

	this.steps=[];
	this.current=1;

	this.add=function(step){
    	this.steps.push(step);
    }

    // first step is always empty
    this.add(new Step());

    var _this = this;// preserve this in move scope

    this.move=function(index){
        //incorrect index handling
        if(index<0){
            index=0;
        }
        if(index>_this.steps.length){
            index=_this.steps.length
        }

        if(_this.current<index){
            // do all steps <= index
            for (var i = _this.current+1; i <= index; i++){
                _this.steps[i-1].forward();
            }
        } else if(_this.current>index){
            // undo all steps > index
            for (var i = _this.current; i > index; i--){
                _this.steps[i-1].backward();
            }
        }
        _this.current=index;
    }

    return this;
}

var Step= function(){

    this.forward=function(){}
    this.backward=function(){}

    return this;
}

// Merges multiple steps into one
var MergeSteps=function(steps){
    this.steps=steps;
    this.forward=function(){
        for (var i = 0; i < this.steps.length; i++){
            this.steps[i].forward();
        }
    }
    this.backward=function(){
        for (var i = 0; i < this.steps.length; i++){
            this.steps[i].backward();
        }
    }
    return this;
}

// Makes group (array) of objects less opaque
var GroupFadeoutStep=function(group){
    this.group=group;
    this.forward=function(){
        for (var i = 0; i < this.group.length; i++){
            this.group[i].stopAppearing();
            this.group[i].alpha=0.5;
        }
    }
    this.backward=function(){
        for (var i = 0; i < this.group.length; i++){
            this.group[i].alpha=1;
        }
    }
    return this;
}

// Unhides group (array) of objects
var GroupEnableStep= function(group){

    this.group=group;

    for (var i = 0; i < this.group.length; i++){
        if("alpha" in this.group[i]){
            this.group[i].alpha=0;
        } else{
            this.group[i].disabled=true;
        }
    }

    this.forward=function(){
        for (var i = 0; i < this.group.length; i++){
            if("appear" in this.group[i]){
                this.group[i].appear();
            } else{
                this.group[i].disabled=false;
            }
        }
    }
    this.backward=function(){
        for (var i = 0; i < this.group.length; i++){
            if("disappear" in this.group[i]){
                this.group[i].disappear();
            } else{
                this.group[i].disabled=true;
            }
        }
    }

    return this;
}