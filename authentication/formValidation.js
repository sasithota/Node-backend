// import modules
const joi = require('@hapi/joi');

// create a validator
const loginValidator = (data)=>{
	const Schema = joi.object({
		username : joi.string().min(5).max(15).required(),
		password : joi.string().min(5).max(1024).required()
	});

	return Schema.validate(data);
}
const postValidator = (data)=>{
	const Schema = joi.object({
		title : joi.string().min(5).max(20).required(),
		content : joi.string().min(5).max(40).required()
	});
	return Schema.validate(data);
}

// export module
module.exports.loginValidator = loginValidator;
module.exports.postValidator = postValidator;