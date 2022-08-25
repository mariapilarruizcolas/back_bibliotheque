const { setupRoutes } = require('./routes');
const express = require('express');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser')

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser())


app.use(cors());



setupRoutes(app);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

