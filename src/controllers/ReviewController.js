const Review = require("../models/review");
const Register= require("../models/register");

const PostReview = async (req,res) => {
    try {
      console.log(req.body);
      const user = await Register.findOne({ _id: req.session.user_id });
      console.log(req.session.user_id);
  
      if (!user) {
        // Handle the case where the user is not found
        // You might want to redirect to a login page or show an error message
        return res.status(401).render("login", { errorMessage: "User not found" });
      }
  
      const newReview = new Review({
        Email: user.Email,
        Name: user.Name,
        Rating: req.body.Rating,
        Feedback: req.body.Feedback
      });
  
      const newRe = await newReview.save();
      res.status(204).send();
    } catch (err) {
      console.error(err);
    }
}

module.exports={
    PostReview
};