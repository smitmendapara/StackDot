const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

// * models
const User = require('./models/SDuser.models');

// * express app
const app = express();
app.use(express.json());

// * define port and db url
const port =  process.env.PORT || 4000;
const db_url = process.env.DB_URL;

// * database conncted
mongoose.connect(db_url)
    .then(() => console.log('database connected'))
    .catch(error => console.log('error on connecting ',  error));

// * server started
app.listen(port,  () => {
    console.log('server is running on port ', port);
});

// * we can validate with jwt token for security
// * also check some basic validation with using middleware

// * register user api
app.post('/register', async (req, res) => {
    try {
        const { institute_type, medium, education_board, class_category, standards, subjects, exam_center, degree, university } = req.body;

        // *initial validation
        if (!['College', 'School', 'Playhouse', 'Competitive Exam Center'].includes(institute_type)) {
            return  res.status(200).json({ status: false, message: 'institute type must be College, School, Playhouse, or Competitive Exam Center' });
        }

        // * validate with institute type
        if (institute_type === 'School') {
            if (['CBSE', 'GSAB'].includes(education_board)) {
                if (['English', 'Hindi'].includes(medium)) {
                    if (['Pre-Primary', 'Primary', 'Secondary', 'Higher-Secondary'].includes(class_category)) {
                        if (class_category === 'Pre-Primary') {
                            if (!['LKG', 'HKG'].includes(standards)) {
                                return res.status(200).json({
                                    status: false,
                                    message: 'Standard must be LKG or HKG'
                                });
                            }
                            else if (!['A', 'B'].includes(subjects)) {
                                return res.status(200).json({
                                    status: false,
                                    message: 'Subjects must be A or B'
                                });
                            }
                        }
                        else if (class_category === 'Higher-Secondary') {
                            if (!(standards> 7 &&  standards <= 12)) {
                                return res.status(200).json({
                                    status: false,
                                    message: 'Standard must be between 8th to 12th'
                                });
                            } else if (!['Math', 'Science', 'English', 'Hindi', 'Social-Science'].includes(subjects)) {
                                return res.status(200).json({
                                    status: false,
                                    message: 'Subjects must be between Math, Science,  English, Hind or Social-Science'
                                });
                            }
                        }
                        else if (class_category === 'Secondary') {
                            if (!(standards > 4 &&  standards <= 7)) {
                                return res.status(200).json({
                                    status: false,
                                    message: 'Standard must be between 5th to 7th'
                                });
                            } else if (!['Gujarati', 'Science', 'English'].includes(subjects)) {
                                return res.status(200).json({
                                    status: false,
                                    message: 'Subjects must be between Gujarati, Science or English'
                                });
                            }
                        }
                        else if (class_category === 'Primary') {
                            if (!(standards > 0 &&  standards <= 4)) {
                                return res.status(200).json({
                                    status: false,
                                    message: 'Standard must be between 1th to 4th'
                                });
                            } else if (!['Gujarati', 'English'].includes(subjects)) {
                                return res.status(200).json({
                                    status: false,
                                    message: 'Subjects must be between Gujarati or English'
                                });
                            }
                        }
                    } else {
                        return res.status(200).json({
                            status: false,
                            message: 'Class Category must be Pre-Primary, Primary, Secondary or Higher-Secondary'
                        });
                    }
                }
                else {
                   return res.status(200).json({
                        status: false,
                        message: 'Medium must be English or Hindi'
                    });
                }
            } else {
                return res.status(200).json({
                    status: false,
                    message: 'Education board must be CBSE or GSAB'
                });
            }
        } 
        else if (institute_type === 'Competitive Exam Center') {
            if (!['IIM', 'IIT'].includes(exam_center)) {
                return res.status(200).json({
                    status: false,
                    message: 'Exam center must be IIM or IIT'
                });
            }
        }
        else if (institute_type === 'College') {
            if (!['Bachelor', 'Master'].includes(degree)) {
                return  res.status(200).json({
                    status: false,
                    message: 'Degree must be selected Bachelor or Master'
                });
            }
           else if (!['IIM', 'IIT'].includes(university)) {
                return res.status(200).json({
                    status: false,
                    message: 'University must be IIM or IIT'
                });
            }
        }

        // * user registered with course
        const createdDocument = await User.create({
            institute_type, 
            medium, 
            education_board,
            class_category, 
            standards, 
            subjects
        });

        // * api response
        if (createdDocument)
            return res.status(200).json({ status: true, message: 'User registered!' });
        res.status(200).json({ status: false, message: 'Try after some times!' });
    } 
    catch (error) {
        console.log(error);
        res.status(400).json({
            status: false,
            message: 'Something was broken!'
        })
    }
})