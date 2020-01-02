function isScrolledIntoView(el) {
    var elemTop = el.getBoundingClientRect().top;
    var elemBottom = el.getBoundingClientRect().bottom;

    var isVisible = (elemTop >= 0) && (elemBottom <= window.innerHeight);
    return isVisible && el.offsetParent !== null;
}

// Gives easy access to pagination element
var Pagination = function(pagination_id, callback, auto_move=true) {
	// pagination element
    this.pagination=document.getElementById(pagination_id);
    
    this.children = this.pagination.children;
    this.selected=0;
    this.callback=function(i){callback(i)};

    this.select=function(index){
        // bounds check
        if(index<0 || index>this.children.length-3){
            return;
        }
        for (var i = 1; i < this.children.length-1; i++) {// 1 offset in both sides to avoid previous and next buttons
            if(i==index+1){
                // activate the selected page-item
                this.children[i].className="page-item active";
            } else {
                // deactivate the rest
                this.children[i].className="page-item";
            }
        }
        if(index==0){
            // disable left arrow
            this.children[0].className="page-item disabled";
        } else  {
            // enable left arrow
            this.children[0].className="page-item";
        }
        if(index==this.children.length-3){
            // disable right arrow
            this.children[this.children.length-1].className="page-item disabled";
        } else {
            // enable right arrow
            this.children[this.children.length-1].className="page-item";
        }
        this.callback(index+1);
        this.selected=index;
    }

    var _this=this;// remembers current this in event's scope
    this.itemCallback=function(e) {
        auto_move=false;
        var index=0;
        for (var i = 0; i < _this.children.length; i++) {
            if(_this.children[i]==e.currentTarget){
                index=i;
            }
        }
        if(index==0){
            _this.select(_this.selected-1);// left arrow
        }else if(index==_this.children.length-1){
            _this.select(_this.selected+1);// right arrow
        } else{
            _this.select(index-1);// one of numbered buttons
        }
        e.preventDefault();  
    }
    for (var i = 0; i < this.children.length; i++) {
        this.children[i].addEventListener("click", this.itemCallback, false);
    }

    if(auto_move){
        this.autoMove=function() {// clicks next navigation buttons automatically
            if(auto_move){
                if(isScrolledIntoView(this.pagination)){
                    if(this.selected<this.children.length-3){
                        this.selected++;
                    } else {
                        this.selected=0;
                    }
                    this.select(this.selected);
                }
                setTimeout(this.autoMove.bind(this), 10000);
            }
        }
        setTimeout(this.autoMove.bind(this), 10000);
    }

    return this;
}