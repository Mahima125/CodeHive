const mongoose = require("mongoose");

module.exports = () => {
	try {
		mongoose.connect("mongodb+srv://mahimadhawan125:mahimadhawan125@cluster0.6rmwt.mongodb.net/");
		console.log("Connected to database successfully");
	} catch (error) {
		console.log(error);
		console.log("Could not connect database!");
	}
};