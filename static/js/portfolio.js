$(document).ready(function () {
	
	let dest = window.location.hash;
	if (dest) {
		scrollToTargetSection($(dest));
	}

	shortcut.add("alt+z", function() {
		window.open(`${window.location.origin}/manage_portfolio/users/${user.username}`)
    });

	$(document).on("click", 'a[href^="#"]', function (e) {
		if (!$(this).hasClass("active") || $(this).hasClass("goto-home")) {
			// target element id
			var dest = $(this).attr("href");

			// target element
			let $dest = $(dest);
			if ($dest.length === 0) {
				return;
			}

			$('.nav-header a[href^="#"].page-link').removeClass("active");
			$(this).addClass("active");
			scrollToTargetSection($dest);
		}
	});


	$(".tab-link").click(function () {
		const tabID = $(this).attr("data-tab");

		$(this).addClass("active").siblings().removeClass("active");

		$("#tab-" + tabID)
			.addClass("active")
			.siblings()
			.removeClass("active");
	});


	$("form").ajaxForm({
		method: "POST",
		success: function (response) {
			alert("The server says: " + response.message);
		},
	});


});

function scrollToTargetSection($dest) {
	$("html, body").animate(
		{
			scrollTop: $dest.offset().top,
		},
		800
	);
}
