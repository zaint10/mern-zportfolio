$(document).ready(function () {
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
