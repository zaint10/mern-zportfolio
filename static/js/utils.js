import * as CONSTANTS from "./CONSTANT.js";

export function fileValidation(file) {
	if (!/^image/.test(file.type)) {
		alert("Select an image file.");
	} else if (!getSizeinMB(file.size) >= CONSTANTS.MAX_FILE_SIZE_IN_MB) {
		alert(`File should be less than ${CONSTANTS.MAX_FILE_SIZE_IN_MB} MB`);
	} else {
		return true;
	}
}

export function getSizeinMB(KB) {
	return KB / 1000000;
}

export function imageProview(file, $previewImage) {
	const reader = new FileReader();

	reader.addEventListener("load", function () {
		console.log(this);
		$previewImage.prop("src", this.result);
	});

	reader.readAsDataURL(file);
}

export async function getUploadUrl(filetypeName, filename, filetype) {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: `/service/upload/request_upload_url/${filetypeName}/?filename=${filename}&&filetype=${filetype}`,
			method: "GET",
			beforeSend: () => {},
			success: (resp) => {
				resolve(resp);
			},
			error: () => {
				reject();
			},
			complete: () => {},
		});
	});
}

export async function upload(url, contentype, file) {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: url,
			method: "PUT",
			timeout: 0,
			processData: false,
			contentType: contentype,
			data: file,
			success: (resp) =>{
				resolve(resp)
			},
			error: (resp)=> {
				console.log(resp)
			}
		});
	})
	
}

export async function testupload(url, contenttype, fileform) {
	const headers = new HttpHeaders({ 'Content-Type': contenttype });
	const req = new HttpRequest(
		'PUT',
		url,
		fileform,
		{
		  headers: headers, 
		});
	return this.http.request(req);
	
}

export function initTagsinputs(){
	$("input[data-role=tagsinput]").tagsinput();
	$(".bootstrap-tagsinput input").attr("name", "");
}
