const express = require("express");

const { hasPermissions } = require("../authorization");
const { getSignedUrl } = require("../services/file-upload");
const utilities = require('../utilities')
const { ImageMetadataController } = require("../controllers");


const router = express.Router();


router.get("/request_upload_url/:filetypeName/", async (req, res) => {
	const user  = req.session.user;
	console.log(user)
	if (user) {
		const isAuthorized = await hasPermissions(user, "FILE", "upload");
		if (isAuthorized) {
			const { filetypeName } = req.params;
			const { filename, filetype } = req.query;
			
			// Making Key for S3 object
			const key = utilities.makeS3Key(user.username, filename, filetypeName).get()
			const response = await getSignedUrl(filetype, key);
            response['key'] = key
            console.log(response)
			return res.status(200).send(response);
		} else {
            res.status(401).send({ success: false, message: "You are not authorized to request for upload url from AWS S3." });
			
		}
	}

	res.status(400).send({ success: false, message: "No authenticate user logged in." });
});

router.post("/upload_file", async (req, res) => {});

module.exports = router;
