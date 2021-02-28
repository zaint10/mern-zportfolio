$(document).ready(function () {
	let dest = window.location.hash;
	if (dest) {
		scrollToTargetSection($(dest));
	}

	shortcut.add("alt+z", function () {
		window.open(
			`${window.location.origin}/manage_portfolio/users/${user.username}`
		);
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

	$("#project-details").on("show.bs.modal", function (event) {
		const button = $(event.relatedTarget); // Button that triggered the modal
		const category = button.closest(".project-card").attr("data-Category"),
			idx = button.closest(".project-card").attr("data-Idx");

		const project = projects[category][idx];
		console.log(project);

		var modal = $(this);
		if (project.image) {
			modal.find(".modal-body img").prop("src", project.image.url);
		}
		modal.find(".modal-body .project-name").empty().text(project.name);
		modal.find(".modal-body .project-desc").empty().text(project.desc);

		modal.find(".modal-body .boxes-wrap .box:not(:first-child)").remove();
		const techUsedArr = project.tech_used.split(",").filter(tech => tech);
		const $targetDiv = modal.find(".modal-body .boxes-wrap");
		for (let tech of techUsedArr) {
			let $boxSelector = modal.find(".modal-body .box.flex:eq(0)").clone();
			$boxSelector.find(".skill-name").text(tech);
			$boxSelector.appendTo($targetDiv);
			$boxSelector.removeClass("d-none");
		}
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
