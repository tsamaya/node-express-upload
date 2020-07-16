const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const _ = require('lodash');

const app = express();

// enable files upload
app.use(
  fileUpload({
    createParentPath: true,
  })
);

//add other middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

//
app.use(express.static('public'));

// serve uploaded files thru /uploads
app.use('/uploads', express.static('uploads'));

app.post('/upload', async (req, res) => {
  try {
    if (!req.files) {
      res.send({
        status: false,
        message: 'No file uploaded',
      });
    } else {
      //Use the name of the input field (i.e. "singlefile") to retrieve the uploaded file
      let uploaded = req.files.singlefile;

      //Use the mv() method to place the file in upload directory (i.e. "uploads")
      uploaded.mv('./uploads/' + uploaded.name);

      //send response
      res.send({
        message: 'File is uploaded',
        data: {
          name: uploaded.name,
          mimetype: uploaded.mimetype,
          size: uploaded.size,
        },
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post('/upload/multiple', async (req, res) => {
  try {
    if (!req.files) {
      res.send({
        status: false,
        message: 'No file uploaded',
      });
    } else {
      let data = [];

      //loop all files (multiplefiles)
      _.forEach(_.keysIn(req.files.multiplefiles), (key) => {
        let file = req.files.multiplefiles[key];

        //move photo to uploads directory
        file.mv('./uploads/' + file.name);

        //push file details
        data.push({
          name: file.name,
          mimetype: file.mimetype,
          size: file.size,
        });
      });

      //return response
      res.send({
        message: 'Files are uploaded',
        data: data,
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

//start app
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`App is listening on port ${port}.`));
