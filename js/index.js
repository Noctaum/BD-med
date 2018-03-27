
$(document).on("click", "a.nav-link", function() {
	$('a.nav-link').removeClass('active');
	$(this).addClass('active');
});

