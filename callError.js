
const tdata = require('./try')
const trial  = (val)=>{
    console.log('b')
    try{
        if(val ==1){
            console.log('a')
            throw new tdata('trying stuff out','please work')
            
        }
    }
    catch(o){
        console.log(o.status)
        console.log(o)
    }
}


trial(1)