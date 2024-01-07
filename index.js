//server.js
const express = require('express');
const app = express();
const cors = require('cors'); 
const mongoose = require('mongoose')
const bodyParser = require('body-parser'); // Add this line


app.use(express.json()); // To parse JSON bodies
app.use(bodyParser.json()); // Add this line to parse JSON requests
app.use(cors());

mongoose
.connect(
  "mongodb+srv://hundlanijay:hVFEqU8iumiSowXL@registerdata.pqv1sbi.mongodb.net/?retryWrites=true&w=majority"
)
.then(() => console.log("mongo connected"))
.catch((err) => console.log("mongo error", err));


const registerSchema = new mongoose.Schema({
  name: {
  type: String,
  require: true,
  },
  email: {
  type: String,
  require: true,
  },
  mobile: {
  type: String,
  require: true,
  },
  password: {
  type: String,
  require: true,
  },
  works: [
    {
      date: { type: String, required: true },
      work: { type: String, required: true },
    },
  ],
  });

  const Vx = mongoose.model("vxc", registerSchema);

//get register data

app.post('/register', async(req, res) => {
const { name, email, mobile, password } = req.body;


try {

  // Check if the user with the given email already exists
  const existingUser = await Vx.findOne({ email });
 

  if (existingUser) {
    // If user exists, return an error response
    return res.json({ success: false, error: 'Email already registered' });
  }






  
  
  // add data
const result = await Vx.create({
    name,
    email,
    mobile,
    password
              
    });
              
    console.log(result);
 
  
  
  

  
  

  res.json({ success: true, message: 'Registration successful' });
} 




catch (error) {
  console.error('Error during registration:', error);

  res.json({ success: false, error: 'technical issue' });
}








          

          

// console.log('User Registration Data:', { name, email, mobile, password });
          
});

// Update your login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

 try {
  const user = await Vx.findOne({ email });

    if (!user) {
      return res.json({ success: false, error: 'Invalid email' });
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = password == user.password

    if (!passwordMatch) {
      return res.json({ success: false, error: 'Invalid  password' });
    }

    // Return user data (in this case, just the name)
    res.json({ success: true,data:user.name});
 } catch (error) {
  console.error('Error during login:', error);
 }
    // Check if the user with the given email exists
    
 
   
    
  
});

app.get('/user/:username', async (req, res) => {
  const { username } = req.params;


    const user = await Vx.findOne({ name: username });

   

const userData = {
  name: user.name,
  email: user.email,
works: user.works || [],

  
  // Avoid sending sensitive information like passwords to the client
};

res.json({ success: true, data: userData });


});


app.post('/admin', async (req, res) => {
    const { name, date, work } = req.body;
  
    try {
      // Find the user by name
      const user = await Vx.findOne({ name });
  
      if (!user) {
        // If user does not exist, return an error response
        return res.json({ success: false, error: 'User not found' });
      }
  
      // Add the work and date to the user's works array
      
    //   user.works = user.works || [];
    user.works.push({ date, work });
      await user.save();
  
      res.json({ success: true, message: 'Work assigned successfully' });
    } catch (error) {
      console.error('Error assigning work:', error);
      res.json({ success: false, error: 'Technical issue' });
    }
  });
  


          
app.listen(3034, () => {
console.log('Server connected');
});