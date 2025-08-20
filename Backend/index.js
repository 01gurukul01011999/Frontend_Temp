import express from "express";
import mysql from "mysql";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import bodyPrser from "body-parser";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import multer from "multer";


// Storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, ' process.env.UPLOAD_LOCATION');
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

// Init multer
const upload = multer({ storage });


 // or configure as needed

dotenv.config();

const app = express();

app.use(bodyPrser.json());
app.use(cors());
app.use('/uploads', express.static('public/uploads'));

const db = mysql.createPool({
    connectionLimit: 10, // Adjust as needed
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});
// Test the pool connection
db.getConnection((err, connection) => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Connected to the database');
        connection.release();
    }
});
const PORT = process.env.PORT || 4000;

const JWT_SECRET = 'kishan';

app.post("/user", (req, res) => {
   console.log(req.body);
const q = "INSERT INTO user (fname, lname, id, email, password, ac_sta, roll ) VALUES (?)";
const id = Math.floor(Math.random() * 1000000); // Generate a random ID
const value = [ req.body.firstName, req.body.lastName, id, req.body.email, req.body.password, 'reg', 'seller'];
//console.log(value);   
      db.query(q, [value], (err, result) => {
        if (err) {
            //console.error("Error executing query:", err);
            res.status(500).send("Internal Server Error");
        } else {
                //console.log("executing query:", result);
                const token = jwt.sign(
                    { 
                        email: req.body.email, 
                        fname: req.body.fname, 
                        lname: req.body.lname, 
                        id: id, 
                        //avatar: req.body.avatar || null // Assuming avatar is optional
                    }, // payload
                    JWT_SECRET,
                    { expiresIn: 3600 } // token expiry
                );

  res.json({ token });
        //res.json(result);
        }
    });
});


app.post("/user-data", (req, res) => {
   console.log(req.body);
    const q = "SELECT * FROM user WHERE email = ? AND password = ?";
    const values = [req.body.email, req.body.password];
    db.query(q, values, (err, result) => {

        if (err) {
            console.error("Error executing query:", err.message);
            res.status(500).send(err.message || "Internal Server Error");
        } 
        else {
            if (result.length > 0) {
                const user = result[0]; // Assuming the first result is the user we want
                const token = jwt.sign(
                    { 
                        email: user.email, 
                        fname: user.fname, 
                        lname: user.lname, 
                        id: user.id, 
                        //avatar: user.avatar
                    }, // payload
                    JWT_SECRET,
                    { expiresIn: 86400 } // token expiry
                );

  res.json({ token });
                //res.json(result[0]); // Return the first matching user
            } else {
                res.status(404).send("User not found");
            }
        }
    });

});



// ✅ A protected route example
app.get('/protected', (req, res) => {

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) return res.sendStatus(401);

  const user = jwt.verify(token, JWT_SECRET, (err, userData) => {
    if (err) return "token expired"; // Invalid token
//console.log(userData);
    if (userData) {
    const q = "SELECT * FROM user WHERE email = ?";
    const values = [userData.email];
    db.query(q, values, (err, result) => {
        if (err) {
           // console.error("Error executing query:", err);
            res.status(500).send("Internal Server Error");
        } else {
            if (result.length > 0) {
                const userdb = result[0]; 
                //console.log("executing query:", userdb);
                res.json({ message: 'Protected data', user: userdb });
            }
            else{
                res.status(404).send("User not found"); }    
            }
  
            });
        }
}); 
if (user === "token expired") {
                    return res.json({status: "error", user: "Token expired"});
                    }

}); 




app.post("/reset", (req, res) => {
   console.log(req.body);
    const q = "SELECT * FROM user WHERE email = ?";
    const values = [req.body.email];
    //console.log(values);
    db.query(q, values,  (err, result) => {
        if (err) {
            //console.error("Error executing query:", err);
            res.status(500).send("Internal Server Error");
        } else {
            if (result.length > 0) {
               console.log(result[0].email);
               const q = "INSERT INTO `reset_p`( `remail`, `rcode`, `time`) VALUES (?)";
               const code = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit code
               const time = new Date();
               const value = [result[0].email, code, time];
               const email = result[0].email;
              //console.log(value);
                db.query(q, [value], (err, result) => {
                    if (err) {
                        //console.error("Error executing query:", err);
                        res.status(500).send("Internal Server Error");
                    } else {
                        // Here you would typically send the code to the user's email
                        // For this example, we'll just return it in the response
                        //res.json({ code: code });
                        const transporter = nodemailer.createTransport({
                        service: 'Gmail', // or 'hotmail', or use SMTP settings
                        auth: {
                       user: process.env.EMAIL_USER,
                       pass: process.env.EMAIL_PASS, // Use App Password for Gmail
                        },
                      });
                      const mailOptions = {
                       from: process.env.EMAIL_USER,
                        to: email,
                       subject: 'Your Verification Code',
                     text: `Your verification code is: ${code}`,
                            };

                    try {
                      transporter.sendMail(mailOptions);
                  //console.log(`Code ${code} sent to ${email}`);
                   res.json({ message: 'Verification code sent successfully', code: code });
              } catch (error) {
                   console.error(error);
                  res.status(500).json({ message: 'Failed to send email' });
                    }

                    } 

                });


            } else {
                res.status(404).send("User not found");
            }
        }
    });

});



app.post("/verify-code", (req, res) => {
    //console.log(req.body);              

    const q = "SELECT * FROM reset_p WHERE remail = ? AND rcode = ? AND time >= NOW() - INTERVAL 10 MINUTE";
    const values = [req.body.email, req.body.code]; 

    db.query(q, values, (err, result) => {
        if (err) {          

            console.error("Error executing query:", err);
            res.status(500).send("Internal Server Error");

        } else {
            if (result.length > 0) {
               // console.log("executing query:", result);
                res.json({ message: "Code verified successfully" });

            } else {
                res.status(404).send("Invalid code or email not found");
            }   
        }
    });
});

app.post("/newPassword", (req, res) => {
    console.log(req.body);              
    const q = "UPDATE `user` SET `password`= ? WHERE email = ?";
    const values = [ req.body.newPassword, req.body.email]; 

    db.query(q, values, (err, result) => {
        if (err) {          

            console.error("Error executing query:", err);
            res.status(500).send("Internal Server Error");

        } else {
           
                //console.log("executing query:", result);
                res.json({ message: "Password Changed successfully" });
   
        }
    });
});

//
//app.post("/newuser", (req, res) => {
//   //console.log(req.body);
//    const q = "";
//    const values = [req.body.email, req.body.password];
//    db.query(q, values, (err, result) => {
//        if (err) {
//           // console.error("Error executing query:", err);
//            res.status(500).send("Internal Server Error");
//        } else {
//            if (result.length > 0) {
//                const user = result[0]; // Assuming the first result is the user we want
//                const token = jwt.sign(
//                    { 
//                        email: user.email, 
//                        fname: user.fname, 
//                        lname: user.lname, 
//                        id: user.id, 
//                       // avatar: user.avatar
//                    }, // payload
//                    JWT_SECRET,
//                    { expiresIn: 3600 } // token expiry
//                );
//
//  res.json({ token });
//                //res.json(result[0]); // Return the first matching user
//            } else {
//                res.status(404).send("User not found");
//            }
//        }
//    });
//
//});


app.post("/upload-avatar", upload.single('avatar'), (req, res) => {
    //console.log(req.file); // Uploaded file info
    const id = req.body.userId;

    const filePath = `/uploads/${req.file.filename}`;
//console.log("File path:", filePath);
    const q = "UPDATE user SET avatar = ? WHERE id = ?";
    const values = [filePath, id];
console.log("Query values:", values);
    db.query(q, values, (err, result) => {
        if (err) {
            console.error("Error executing query:", err);
            return res.status(500).send("Internal Server Error");
        }
        //console.log("Avatar updated successfully:", result);

       res.json({ message: "Avatar updated successfully", avatar: filePath });
    });
});





app.post("/update_profile", (req, res) => {
    console.log(req.body);      
  const q = "UPDATE user SET phone= ? ,address= ? , state = ? , city = ? , pincode = ? , ac_sta = ? WHERE email = ?";
   const values = [req.body.phone, req.body.address, req.body.state, req.body.city, req.body.pincode, 'done', req.body.email];
   db.query(q, values, (err, result) => {
      if (err) {
           console.error("Error executing query:", err);
          res.status(500).send("Internal Server Error");
      } else {
           //console.log("Profile updated successfully:", result);
           res.json({ message: "Profile updated successfully" });
      }
   });
});

//app.post("/category", (req, res) => {
//    console.log(req.body);
//     const catId = 'cat'+Math.floor(100000 + Math.random() * 900000); 
//    const q = "INSERT INTO `category`(`catId`, `catPhoto`, `title`, `parentCat`, `slug`, `metaTitle`, `keyWord`, `descrip`, `featured`, `footer`, `sta`, `datestamp`, `userid`) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)";
//    const values = [ catId, req.body.image, req.body.title, req.body.parent, req.body.slug, req.body.metaTitle, req.body.metaKeywords, req.body.metaDescription , req.body.featured, req.body.showInFooter, req.body.status, new Date(), req.body.userId];
//    console.log("Query values:", values);
//    db.query(q, values, (err, result) => {
//        if (err) {
//            console.error("Error executing query:", err);
//            res.status(500).send("Internal Server Error");
//        } else {
//            //console.log("Category added successfully:", result);
//            res.json({ message: "Category added successfully" });
//        }
//    });
//});
//
//app.post("/categoryfetch", (req, res) => {
//     const q = "SELECT * FROM category WHERE userid = ? ";
//    const values = [req.body.userId];
//    //console.log("Query values:", values);
//    db.query(q, values, (err, result) => {
//        if (err) {
//            console.error("Error executing query:", err);
//            res.status(500).send("Internal Server Error");
//        } else {
//             if (result.length > 0) {
//                //console.log("executing query:", result);
//                res.json( result);
//
//            } else {
//                res.status(204).send("No categories found for this user"); 
//            }   
//        }
//    });
//});
//
//
//
//// Assuming you have Express and a Category model (e.g., Mongoose or Sequelize)
//app.delete('/category/:catId', async (req, res) => {
//  const { catId } = req.params;
//  //console.log("Deleting category with ID:", catId);
//  try {
//    // Example with Mongoose:
//    // await Category.findByIdAndDelete(catId);
//
//    // Example with SQL:
//    await db.query('DELETE FROM category WHERE catId = ?', [catId]);
//
//    res.status(200).json({ message: 'Category deleted successfully' });
//  } catch (error) {
//    res.status(500).json({ message: 'Error deleting category', error });
//  }
//});
//
//
//
//app.get("/categoryeditfetch/:catid/:userid", (req, res) => {
//     const q = "SELECT * FROM category WHERE catId = ? AND userid = ? ";
//    const values = [req.params.catid, req.params.userid];
//    console.log("Query values:", values);
//    db.query(q, values, (err, result) => {
//        if (err) {
//            console.error("Error executing query:", err);
//            res.status(500).send("Internal Server Error");
//        } else {
//             if (result.length > 0) {
//                console.log("executing query:", result);
//                res.json( result);
//
//            } else {
//                res.status(204).send("No categories found for this user"); 
//            }   
//        }
//    });
//});
//
//
//
//app.post("/categoryedit", upload.single('image'), (req, res) => {
//   console.log(req.body); // all your fields
//  console.log(req.file); 
//  const filePath = `/uploads/${req.file.filename}`;
//  const q = "UPDATE category SET catPhoto= ?, title= ?, parentCat= ?, slug= ?, metaTitle= ?, keyWord= ?, descrip= ?, featured= ?, footer= ?, sta= ?, editon= ? WHERE catId = ? AND userid = ?";
//    const values = [ filePath, req.body.title, req.body.parent, req.body.slug, req.body.metaTitle, req.body.metaKeywords, req.body.metaDescription , req.body.featured, req.body.showInFooter, req.body.status, new Date(), req.body.catid, req.body.userId];
//    console.log("Query values:", values);
//   db.query(q, values, (err, result) => {
//        if (err) {
//            console.error("Error executing query:", err);
//          res.status(500).send("Internal Server Error");
//      } else {
//          //console.log("Category added successfully:", result);
//          res.json({ message: "Category edited successfully" });
//      }
//  });
//});


app.post("/orderfetch", (req, res) => {
    console.log(req.body);
    const q = "SELECT * FROM orders WHERE userId = ? ";
    const values = [req.body.userId];
    //console.log("Query values:", values);
    db.query(q, values, (err, result) => {
        if (err) {
            console.error("Error executing query:", err);
            res.status(500).send("Internal Server Error");
        } else {
            if (result.length > 0) {
                //console.log("executing query:", result);
                res.json(result);
            } else {
                res.status(204).send("No orders found for this user");
            }
        }
    });
});


app.post('/api/bulkImgupload', upload.array('images'), async (req, res) => {
  
  console.log(req.files); // Log the uploaded files for debugging
  const uploader_id = req.body.uploaderId; // Get uploader_id from request body
  const results = [];
  for (let i = 0; i < req.files.length; i++) {
    const file = req.files[i];
    const img_id = 'img' + Date.now() + '-' + Math.floor(Math.random() * 1000000);
    const img_name = file.filename;
     const original_name = file.originalname; // <-- add this
    const datestamp = new Date();
    // sn is usually auto-increment, so pass NULL or let DB handle it
    const q = "INSERT INTO images (img_id, img_name, original_name, datestamp, uploader_id) VALUES (?, ?, ?, ?, ?)";
    const values = [img_id, img_name, original_name, datestamp, uploader_id];
    try {
      await new Promise((resolve, reject) => {
        db.query(q, values, (err, result) => {
          if (err) {
            console.error("Error inserting image:", err);
            reject(err);
          } else {
            results.push({ img_id, img_name, original_name, datestamp, uploader_id });
            resolve();
          }
        });
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
  res.json({ success: true, files: results });
});






app.listen(PORT, () => {
    console.log(`connected to backend on port ${PORT}`);
});
