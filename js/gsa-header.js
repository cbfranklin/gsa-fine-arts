function gsaHeader(){
		$("#topnav ul li.tab").hoverIntent({
		sensitivity: 7, // number = sensitivity threshold (must be 1 or higher)    
    	interval: 100, // number = milliseconds for onMouseOver polling interval    
    	timeout: 100, // number = milliseconds delay before onMouseOut   
      over:function () {
        $(this).children("a.mainlk").addClass("over");
		$(".submenu",this).css({'display' : 'block'});
		},
      out:function () {
        $(this).children("a.mainlk").removeClass("over");
		$(".submenu",this).css({'display' : 'none'});
		}
		}
		);
	
	$("#topnav ul:first").hoverIntent({
		sensitivity: 7, // number = sensitivity threshold (must be 1 or higher)    
    	interval: 100, // number = milliseconds for onMouseOver polling interval    
    	timeout: 100, // number = milliseconds delay before onMouseOut   
      over:function () {
			$("#gray").fadeIn("fast");
		},
      out:function () {
			$("#gray").fadeOut("fast");
		}
		}
		);
	
	$("#topnav ul li a").focus(function () {
        $(this).parent("li").trigger("focus");
    });
	
	$("#topnav ul li a").blur(function() {
		$(this).parent("li").trigger("blur");
	});

	$("#topnav li.tab").focus(function () {
		$(".mainlk",this).addClass("over");
		$(".submenu",this).css({'display' : 'block'});
    });

	$("#topnav li.tab").focusout(function () {
		$(".mainlk",this).removeClass("over");
		$(".submenu",this).css({'display' : 'none'});
    });

	$("#topnav ul").focus(function(){
		$("#gray").fadeIn("fast");
	});
	$("#topnav ul").focusout(function() {
		$("#gray").fadeOut("fast");
	});

	$("#topnav ul li > a").click(function () {
		$(this).parent("li").trigger("focus");
        $("#gray").fadeOut("fast");
	});
	
	$("#gray").click(function(){
		$(this).fadeOut("fast");
		$('.submenu').css({'display' : 'none'});
	});
}