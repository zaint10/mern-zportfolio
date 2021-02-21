const models = require("../models");

const createImageMetaData = (filename, filetype, key, fileurl) => {
	return new Promise((resolve, reject) => {
		models.Images.create({
			name: filename,
			type: filetype,
			key: key,
			url: fileurl,
		})
			.then((docImage) => {
				resolve(docImage);
			})
			.catch((err) => {
				reject(err);
			});
	});
};

const updateImageMetadata = (_id, filename, filetype, key, fileurl) => {
	return new Promise((resolve, reject) => {
		models.Images.findByIdAndUpdate(
			_id,
			{
				name: filename,
				type: filetype,
				key: key,
				url: fileurl,
			},
			{ new: true }
		)
			.then((docImage) => {
				resolve(docImage);
			})
			.catch((err) => {
				reject(err);
			});
	});
};

module.exports = {
	createImageMetaData,
	updateImageMetadata,
};
