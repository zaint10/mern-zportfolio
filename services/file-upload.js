const AWS = require("./AWS");


aws = new AWS();
const s3 = aws.getS3();
const signedUrlExpireSeconds = 60 * 60; // 5 mins


const getSignedUrl = async (filetype, key) => {
	let fileurls = [];
	const params = {
		Bucket: process.env.S3_BUKET_NAME,
		Key: key,
		Expires: signedUrlExpireSeconds,
		ACL: "public-read",
		ContentType: filetype,
	};
	try {
		return await new Promise((resolve, reject) => {
			s3.getSignedUrl("putObject", params, (err, url) => {
				if (err) {
					reject({
						success: false,
						message: "Pre- Signed URL error",
						urls: fileurls,
					});
				} else {
					fileurls[0] = url;
					console.log("The presigned url is: ");
					
					resolve({
						success: true,
						message: "AWS SDK S3 Pre- signed urls generated successfully",
						urls: fileurls,
					});
				}
			});
		});
	} catch (err) {
		throw new Error(err);
	}
};

module.exports = { getSignedUrl };
