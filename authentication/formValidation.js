// import modules
const joi = require('@hapi/joi');

// create a validator
const Validator = (data)=>{
	const Schema = joi.object({
		username : joi.string().min(5).max(15).required(),
		password : joi.string().min(5).max(1024).required()
	});

	return Schema.validate(data);
}

// export module
module.exports.Validator = Validator;