import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on("connected", ()=>{console.log("db id connect")})

        let mongodbURI = process.env.MONGODB_URL;
        const projectName = 'resume-builder';

        if(!mongodbURI){
            throw new Error("MONGODB_URI is not available")
        }

        if(mongodbURI.endsWith('/')){
            mongodbURI = mongodbURI.slice(0,-1)
        }

        await mongoose.connect(`${mongodbURI}/${projectName}`)

    }catch (error){
        console.error("error connecting to db :",error)
    }
    
}
export default connectDB;