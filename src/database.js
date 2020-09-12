const mongoose = require('mongoose');
const {MONGODB_URL} = process.env;
const mongodb_url = MONGODB_URL;
mongoose.connect(mongodb_url,{
    useCreateIndex:true,
    useNewUrlParser:true,
    useFindAndModify:false,
    useUnifiedTopology:true
})
.then(db => console.log('DB is connected'))
.catch(e => console.error(e));
