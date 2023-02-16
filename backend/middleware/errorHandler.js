


const catchError = (err,req,res,next)=>{

    const statusCode = res.statusCode? res.statusCode: 500;

    res.status(statusCode)
    res.json({message:err.message,
    stack: err.stack,name:err.name})

}

module.exports = {catchError}