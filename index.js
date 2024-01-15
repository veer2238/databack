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
      link: { type: String },
      unison: { type: String },
  
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


    const user = await Vx.findOne({ name: username});

    // const filteredWorks = user.works.filter(task => task.unison !== 'veer');

    const userData = {
      name: user.name,
      email: user.email,
      works: user.works || [],
      // Avoid sending sensitive information like passwords to the client
    };

  
  // Avoid sending sensitive information like passwords to the client


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
      const workexist = user.works.find(task => task.work === work);
  
      if (workexist) {
        // If there is no match, return an error response
        return res.json({ success: false, error: 'work already assigned' });
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

  app.post('/submitLink', async (req, res) => {
    const { name, date, work, link } = req.body;
  
    try {
      // Find the user by name
      const user = await Vx.findOne({ name });
  
      // Find the index of the task in the user's works array that matches both date and work
      const taskIndex = user.works.findIndex(task => task.date === date && task.work === work);
  
      if (taskIndex === -1) {
        // If there is no match, return an error response
        return res.json({ success: false, error: 'User not found or date and work do not match' });
      }
  
      // Update the link for the matched task
      user.works[taskIndex].link = link;
      await user.save();
  
      res.json({ success: true, message: 'Link sent successfully' });
    } catch (error) {
      console.error('Error updating link:', error);
      res.json({ success: false, error: 'Technical issue' });
    }
  });
  

  app.get("/accept", async (req, res) => {
    try {
      // Find documents where at least one 'works' item has a 'link'
      const allAttendanceData = await Vx.find({
        "works.link": { $exists: true },
        
      });
  
      res.status(200).json(allAttendanceData);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });


  app.post('/delete', async (req, res) => {
    const { name, work } = req.body;
  
    try {
      // Find the user by name
      const user = await Vx.findOne({ name });
  
      // Find the index of the task in the user's works array that matches both date and work
      const taskIndex = user.works.findIndex(task => task.work === work);
  
      if (taskIndex === -1) {
        // If there is no match, return an error response
        return res.json({ success: false, error: 'can nott delete' });
      }
  
      // Update the link for the matched task
      user.works[taskIndex].unison = "veer";
      await user.save();
  
      res.json({ success: true, message: 'work accepted' });
    } catch (error) {
      console.error('Error updating link:', error);
      res.json({ success: false, error: 'Technical issue' });
    }
  });

  
  
  

 


 





  


          
app.listen(3034, () => {
console.log('Server connected');
});