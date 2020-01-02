$(document).ready(function(){

	// display link texts in header when mouse is over them
	$("a[hover-text]").hover(
	  function() {
	  	this.hover=true;

		if(this.writting!==true){
			var textToSwitch=$(this).attr("hover-text");
			this.writting=true;

			var letterIndex=0;
			$(this).addClass("nav-link-selected");
			$(".link-typing-area").text("");

			this.letterAnimation=setInterval(function(){
				if(letterIndex<textToSwitch.length){
					$(".link-typing-area").text($(".link-typing-area").text()+textToSwitch[letterIndex]);
					letterIndex++;
				} else if(this.hover){
					$(".link-typing-area").text(textToSwitch);
				}else{
					$(".link-typing-area").text("");
					clearInterval(this.letterAnimation);
					this.writting=false;
				}
			}.bind(this), 5);
		}
	  }, 
	  function() {
		  this.hover=false;
		  $(this).removeClass("nav-link-selected");
	  }
	);

	// display fullscreen version of clicked image
	$("img").click( function(){
		$(".img-fullscreen").attr("src", $(this).attr("src"));
		$(".img-fullscreen-container").css("display", "initial");
		$(".img-fullscreen-backgound").css("display", "initial");
	});

	// close fullscreen image
	$(".img-fullscreen-backgound, .img-fullscreen-close").click( function(){
		$(".img-fullscreen").attr("src", "");
		$(".img-fullscreen-container").css("display", "none");
		$(".img-fullscreen-backgound").css("display", "none");
	});

    $('[data-toggle="tooltip"]').tooltip();

});