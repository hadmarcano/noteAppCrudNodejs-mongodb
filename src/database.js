const mongoose = require('mongoose');
const {MONGODB_HOST,MONGODB_DATABASE} = process.env;
const mongodb_url = `mongodb://${MONGODB_HOST}/${MONGODB_DATABASE}`;
mongoose.connect(mongodb_url,{
    useCreateIndex:true,
    useNewUrlParser:true,
    useFindAndModify:false,
    useUnifiedTopology:true
})
.then(db => console.log('DB is connected'))
.catch(e => console.error(e));
