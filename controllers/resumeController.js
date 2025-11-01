
import imageKit from "../configs/imageKit.js";
import Resume from "../models/Resume.js";
import fs from 'fs';
// controller for creating a new resume
// post : /api/resume/create



export const createResume = async (req, res) => {
    try {

        const userId = req.userId;

        // create new resume
        const { title } = req.body;
        const newResume = await Resume.create({ userId, title })
        // return success message
        return res.status(201).json({ message: 'Resume created successfully', resume: newResume })

    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}


// controller for del a new resume
// post : /api/resume/delete

export const deleteResume = async (req, res) => {
    try {

        const userId = req.userId;

        // create new resume
        const { resumeId } = req.params;

        await Resume.findOneAndDelete({ userId, _id: resumeId })

        // return success message
        return res.status(200).json({ message: 'Resume deleted successfully' })

    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}


// get user resume by id
// post : /api/resume/get

export const getResumeById = async (req, res) => {
    try {

        const userId = req.userId;

        // create new resume
        const { resumeId } = req.params;

        const resume = await Resume.findOne({ userId, _id: resumeId })

        if (!resume) {
            return res.status(404).json({ message: "Resume not found" })
        }

        // return success message
        resume._v = undefined;
        resume.createdAt = undefined;
        resume.updatedAt = undefined;

        return res.status(200).json({ resume })

    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

// get resume by id public
// get: /api/resume/public
export const getPublicResumeById = async (req, res) => {
    try {
        const { resumeId } = req.params;
        const resume = await Resume.findOne({ public: true, _id: resumeId })

        if (!resume) {
            return res.status(404).json({ message: "Resume not found" })
        }

        return res.status(200).json({ resume })

    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

// controller updating resume
export const updateResume = async (req, res) => {
    try {
        const userId = req.userId;
        const { resumeId, resumeData, removeBG } = req.body

        const image = req.file;


        let resumeDataCopy;
        if(typeof resumeData === 'string'){
            resumeDataCopy = await JSON.parse(resumeData)
        }else{
            resumeDataCopy = structuredClone(resumeData)
        }


        if (image) {

            const imageBufferData = fs.createReadStream(image.path)

            const response = await imageKit.files.upload({
                file: imageBufferData,
                fileName: 'resume.png',
                folder: 'user-resumes',
                transformation: {
                    pre: 'w-300 , h-300, fo-face,z-0.75' + (removeBG ? ',e-bgremove' : '')
                }
            });

            resumeDataCopy.personal_info.image =response.url

        }

        const resume = await Resume.findByIdAndUpdate({ userId, _id: resumeId }, resumeDataCopy, { new: true })

        return res.status(200).json({ message: 'saved successfully', resume })

    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}
