const mongoose = require('mongoose');

const connectdb = async()=>{
    try{
      /**
       *   const connectionParams = {
            useNewUrlParser:true,
            useCreateIndex:true,
            useUnifiedTopology:true
        }
       */
        const conn = await mongoose.connect('mongodb+srv://kayjay:dc777jjj@igochecluster.cwn9q.mongodb.net/?retryWrites=true&w=majority')

        console.log(`mongodb is connected: ${conn.connection.host}`)
    }
    catch(error){
         console.log(error)
         process.exit(1)
    }
}

module.exports = connectdb