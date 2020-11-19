
import * as CONSTANTS from './CONSTANT.js'
import * as UTILS from './utils.js'


$(document).ready(function () {
	$(".bootstrap-tagsinput input").attr("name", "");

	console.log(user);
	console.log(categories);
	addProjects(user.projects);
	

	document.body.addEventListener("animationend", function (event) {
		if (event.animationName === "disapear") {
			removeElemnet(event.target);
		}
	});

	$(document).on("click", "#btn-add-project", function (e) {
		e.preventDefault();
		const $this = $(this);
		const userId = $this.closest("form.form").prop("id");
		$.ajax({
			url: "/api/v1/projects",
			method: "POST",
			dataType: "json",
			data: {
				userId: userId,
				projects: [CONSTANTS.DEFAUL_PROJECT_SCHEMA],
			},
			beforeSend: () => {
				Button($this).processing.start();
			},
			success: (resp) => {
				addProjects(resp.projects);
			},
			error: (resp) => {},
			complete: () => {
				Button($this).processing.finish();
			},
		});
	});

	$(document).on("click", ".delete-project", function (e) {
		e.preventDefault();
		const $project = $(this).closest(".project-wrap");
		const pid = $project.find(".pid").prop("id"),
			userId = $(this).closest("form.form").prop("id");

		$.ajax({
			url: `/api/v1/projects/${pid}`,
			method: "DELETE",
			dataType: "json",
			data: {
				userId: userId,
			},
			beforeSend: () => {
				Button($(this)).processing.start();
			},
			success: (resp) => {
				deleteProject($project);
			},
			error: (resp) => {},
			complete: () => {
				Button($(this)).processing.finish();
			},
		});
	});

	$(document).on("change", ".project-status", function (e) {
		const status = $(this).val();

		if (status == "live") {
			showProjectLiveField($(this).closest(".project-wrap"));
		} else {
			hideProjectLiveField($(this).closest(".project-wrap"));
		}
	});

	$(document).on("click", ".browse", function () {
		let file = $(this).parent().parent().parent().find(".file");
		file.trigger("click");
	});

	$(document).on("change", ".file", async function (e) {
		const projectId = $(this).closest('.project-wrap').find('input.pid').val();
		const fileObj = e.target.files[0];
		const  previewImage = $(this)
			.closest(".project-wrap")
			.find(".image-preview img");
		if (UTILS.fileValidation(fileObj)) {
			
			await UTILS.getUploadUrl('image', fileObj.name, fileObj.type)
			.then(async response => {
				if(response.success){
					const fileuploadurl = response.urls[0];
					await UTILS.upload(fileuploadurl, fileObj.type, fileObj).then(() => {
						addProjectImage(projectId, fileObj.name, fileObj.type, response.key)
					})
				}
			}).catch(() => {

			})
		}
	});

	$("form").ajaxForm({
		method: "POST",
		success: function (response) {
			alert("The server says: " + response);
		},
	});
	
	$('.dropdown button').on('click', function (event) {
		$(this).next('.dropdown-menu').toggleClass('show')
		// $(this).toggleClass('show');
	})
	$('body').on('click', function (e) {
		if (!$('.dropdown').is(e.target) 
			&& $('.dropdown').has(e.target).length === 0 
			&& $('.open').has(e.target).length === 0
		) {
			$('.dropdown .dropdown-menu').removeClass('show')
		}
	});
	
	$(document).on('click', '.dropdown [aria-labelledby="dropdownSelectCategorytogleButton"] .dropdown-item', async function(e) {
		const isSelected = $(this).hasClass('selected');
		if(isSelected){
			return false;
		}
		const projectid = $(this).closest('.project-wrap').find('.pid').val();
		const category_name = $.trim($(this).text())
		await updateProjectCategory(projectid, category_name)
		.then(resp => {
			if(resp.success){
				$(this).closest('.dropdown-menu').find('.dropdown-item').removeClass('selected');
				$(this).addClass('selected');
			}
		})
		
	})
});

function showProjectLiveField($parent) {
	$parent.find(".project-live-link").removeClass("d-none");
}

function hideProjectLiveField($parent) {
	const $selector = $parent.find(".project-live-link");
	$selector.addClass("d-none");
	$selector.val("");
}

function addProject(project) {
	
	let currIndex = $(".project-wrap").length;
	const currCount = currIndex + 1;
	const keyname = "projects";
	const defaultImagePlaceholder = 'https://mdbootstrap.com/img/Photos/Others/placeholder.jpg'
	const projectMarkup = `<li class="project-wrap">
                                
                                <div class="project-lable">
                                    <label class='label' data-count=${currCount}>Project# ${currCount}</label>
                                    <button class="btn delete-project content-right">
                                        <i class="fa fa-trash-o trash-btn-icon "></i>
                                    </button>
                                </div>
                                <input class='text-input project-name' id='pn-${currCount}' name='${keyname}[${currIndex}][name]' 
                                type='text' placeholder="Project Name" value='${project.name}'>
                                
                                <textarea class='textarea project-desc' id='pd-${currCount}' name='${keyname}[${currIndex}][desc]' 
                                cols='50' rows='4' placeholder="Description" >${project.desc}</textarea>
                                
                                <input  class='text-input skill-tags d-none' id='psk-${currCount}' name='${keyname}[${currIndex}][tech_used]' 
                                value='${project.tech_used}' placeholder="Add Skills & Tech Used.." data-role="tagsinput" >
                                
                                <select class='select project-status' name="${keyname}[${currIndex}][status]">
                                    <option selected value=''>Select Project Status</option>
                                    <option value='completed'>Completed</option>
                                    <option value='in developement'>In Developement</option>
                                    <option value='live'>Live</option>
								</select>
								<div class="dropdown">
									<button id="dropdownSelectCategorytogleButton" class="btn dropdown-toggle" type='button' aria-haspopup='true' aria-expanded='false'>
										Select Project Cateogry
									</button>
									<div class="dropdown-menu " aria-labelledby='dropdownSelectCategorytogleButton'>
										<h6 class="dropdown-header">Choose categories to assign</h6>
										${
											categories.map(cat => {
												return `<button class='dropdown-item ${project.category.name == cat.name ? "selected" : ""}' type="button">
													${cat.name}
												</button>`
											}).join('\n')
										}
										
									</div>
								</div>
          
                                <input class='text-input project-live-link d-none' name='${keyname}[${currIndex}][live_link]' type="url" value='${project.live_link}' placeholder="Live Project Link">
								<input type="file" name="img[]" class="file"  accept=".jpg,.jpeg,.png" >
									<div class="input-group col-xs-12 image-wrapper">
										<span class="image-preview">
											<img src="${project.image ? project.image.url : defaultImagePlaceholder}" class="img-fluid project-thumbnail" alt="example placeholder">

										</span>
										<input type="text" class="form-control lable-filename" disabled placeholder="Upload Image" value="${project.image ? project.image.name : ''}">
										<span class="input-group-btn">
											<button class="browse btn btn-primary" type="button"><i class="fa fa-search"></i> Browse</button>
										</span>
									</div>
							</li> `;

	$(".main-projects-wrapper").fadeIn("slow", function () {
		$(this).append(projectMarkup);
		$(this).find(".project-wrap:last .project-status").val(project.status);
		
		if (keyname == "projects") {
			$(this)
				.find(".project-wrap:last")
				.prepend(
					`<input hidden id="${project._id}" class="pid" name="${keyname}[${currIndex}][_id]" value="${project._id}"/>`
				);
		}
	});
}

async function addProjects(projects) {
	await projects.forEach((project) => {
		addProject(project);
	});
	UTILS.initTagsinputs()
}

function deleteProject($this) {
	$this.addClass("removed");
}

function removeElemnet(element) {
	$(element).remove();
	$(".project-lable .label").each(function (index) {
		$(this).attr("data-count", index + 1);
		$(this).text(`Project# ${index + 1}`);
	});
}

const Button = ($button) => {
	return {
		processing: {
			start: () => {
				$button.prop("disabled", true);
				$button.find(".processing-dots").removeClass("d-none");
			},

			finish: () => {
				$button.prop("disabled", false);
				$button.find(".processing-dots").addClass("d-none");
			},
		},
	};
};

function addProjectImage(projectId, filename, filetype, key){
	if(projectId){
		$.ajax({
			url: `/api/v1/create-project-image/${projectId}`,
			data: {
				imageData: {
					filename: filename,
					filetype: filetype,
					key: key
				}
			},
			method: 'POST',
			success: (resp) => {
				if(resp.success){
					const $imageSelector = $(`.pid#${projectId}`).closest('.project-wrap').find('.image-wrapper')
					$imageSelector.find('.project-thumbnail').prop('src', resp.imageUrl);
					$imageSelector.find('input.lable-filename').val(resp.imageName)
				}
				
				
	
			},
			error: (resp) => {
				console.log(resp)
			}
		})
	}
	
}

async function updateProjectCategory(projectid, category){
	return new Promise((resolve, reject) => {
		$.ajax({
			url: `/api/v1/project-category/${projectid}`,
			method: 'PUT',
			data: {
				category: category
			},
			success: (resp) => {
				resolve(resp)
			},
			error: () => {
				reject()
			},
			complete: () => {
	
			}
	
		})
	}) 
}