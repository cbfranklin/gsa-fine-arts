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
    });
	
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

    $(".mainlk").focus(function () {
        $(this).addClass("over");
        $(this).parent('.tab').find('.submenu').css({'display': 'block'});
        $(this).parent('.tab').find('.submenu').find('ul:first li:first a').trigger("focus");
    });
    $(".last-child-selected").blur(function () {
        $(this).parents('.tab').find('.mainlk').removeClass('over');
        $(this).parents('.tab').find('.submenu').css({'display': 'none'});
    });
	$("#gray").click(function(){
		$(this).fadeOut("fast");
		$('.submenu').css({'display' : 'none'});
	});
}