const winston = require("winston");
const { format } = require("winston");
const { combine } = format;
const dateFormat = () => {
	return new Date(Date.now()).toUTCString();
};

const logFormat = (route, info) => {
	// const coloriezed = winston.format.colorize(info.level, `${route}.log | ${info.message}`)
	let message = `${dateFormat()} | ${info.level.toUpperCase()} | ${route}.log | ${
		info.message
	} | `;
	message = info.obj
		? message + `data:${JSON.stringify(info.obj)} | `
		: message;
	message = this.log_data
		? message + `log_data:${JSON.stringify(this.log_data)} | `
		: message;
	return message;
};

class LoggerService {
	constructor() {
		this.log_data = null;
		this.name = '';
	}

	setLogName(name) {
		this.name = name;
	}

	init() {
		const logger = winston.createLogger({
			transports: [
				new winston.transports.Console({
					format: winston.format.combine(
						winston.format.printf((info) =>
							winston.format
								.colorize()
								.colorize(info.level, logFormat(this.name, info))
						)
					),
				}),
				new winston.transports.File({
					filename: `./logs/${this.name}.log`,
				}),
			],
			format: winston.format.combine(
				winston.format.printf((info) => logFormat(this.name, info))
			),
		});
		this.logger = logger;
	}

	setLogData(log_data) {
		this.log_data = log_data;
	}

	async error(message) {
		this.logger.log("error", message);
	}
	async error(message, obj) {
		this.logger.log("error", message, {
			obj,
		});
	}
	async warn(message) {
		this.logger.log("warn", message);
	}
	async warn(message, obj) {
		this.logger.log("warn", message, {
			obj,
		});
	}
	async info(message) {
		this.logger.log("info", message);
	}
	async info(message, obj) {
		this.logger.log("info", message, {
			obj,
		});
	}
}
module.exports = LoggerService;
