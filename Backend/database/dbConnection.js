import mongoose from "mongoose";

export const dbConnection = ()=>{
    mongoose.connect(process.env.MONGO_URL,{
        dbName: "TO_DO_LIST_DEPLOYED"   //it is a general syntax to check the database which we are using is connected successfully
    }).then(()=>{
        console.log("Connected to database!")
    }).catch(err=>{
        console.log(`Some error occured while connecting to database ${err}`)
    })
}
