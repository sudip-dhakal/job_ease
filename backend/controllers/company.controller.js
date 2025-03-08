const Company = require("../models/company.model");
const cloudinary = require("../utilities/cloudinary");
const getDataUri  = require("../utilities/datauri");
const User = require("../models/user.model");

const registerCompany = async (req, res) => {
    try {
        console.log("Request Body:", req.body);

        const { companyName, description, website, location } = req.body;
        const file = req.files;

        
        if (!companyName) {
            return res.status(400).json({
                error: "Company name is required",
                success: false
            });
        }
        if (!description) {
            return res.status(400).json({
                error: "Company description is required",
                success: false
            });
        }

        if (!location) {
            return res.status(400).json({
                error: "Company location is required",
                success: false
            });
        }

      
       
        let company = await Company.findOne({ name: companyName });
        if (company) {
            return res.status(400).json({
                error: "Company already exists",
                success: false
            });
        }

         let logoUrl = "";

        if (req.files && req.files["logo"]) {
         
                const logo = req.files["logo"][0];

                const fileUri = getDataUri(logo);
                const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
                 
                    logoUrl = cloudResponse.secure_url;
                
         
            }
        

        company = await Company.create({
            name: companyName,
            description,
            website,
            location,
            logo:logoUrl,
            userId: req.id
        });
       
        return res.status(201).json({
            message: "Company created successfully",
            success: true,
            company,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: err.message,
            success: false
        });
    }
};


const getCompany = async(req,res)=>{
    try{
        const userId= req.id; //logged in user Id
        const companies=  await Company.find({userId});
        if(!companies){
            return res.status(404).json({error: "No companies found",
                success:false
            });
        }
        
            return res.status(200).json({
                companies,
                success:true,
            })
        
    }
    catch(err){
        console.error(err);
    }
}

const getCompanyById= async(req,res)=>{
    try{
        const companyId= req.params.id;
        const company= await Company.findById(companyId);
        if(!company){
            return res.status(404).json({error: "No companies found",
                success:false
            });

        }

        else{
            return res.status(200).json({success:true,
                message:"Company fetched successfully",
                company});
        }
    }
    catch(error){
        console.error(error);
    }
}

const updateCompany = async (req, res) => {
    try {
        const { companyName, description, website, location } = req.body;

       

        let company = await Company.findById(req.params.id);
        if (!company) {
            return res.status(404).json({
                message: "Company not found",
                success: false
            });
        }

        if (company.userId.toString() !== req.id) {
            return res.status(403).json({
                message: "Unauthorized to update this company",
                success: false
            });
        }

        let logoUrl = "";

        // Check if new logo is uploaded
        if (req.files && req.files["logo"]) {
            const logo = req.files["logo"][0];
            const fileUri = getDataUri(logo);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            logoUrl = cloudResponse.secure_url;
        }

        // Prepare update data
        const updateData = { name:companyName, description, website, location };
        
        // Only update logo if a new one was uploaded
        if (logoUrl) {
            updateData.logo = logoUrl;
        }

        company = await Company.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        return res.status(200).json({
            message: "Company updated successfully",
            success: true,
            company
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

const deleteCompany = async(req,res)=>{
    try{
        const company= await Company.findById(req.params.id);
        if(!company){
            return res.status(404).json({error: "Company not found",
                success:false
            });
        }

        if(company.userId.toString() !== req.id){
            return res.status(403).json({error: "Unauthorized to delete this company",
                success:false
            });
        }

        await Company.findByIdAndDelete(req.params.id);
        return res.status(200).json({success:true,
            message:"Company deleted successfully"
        });
    }
    catch(err){
        console.error(err);
        res.status(500).json({error:err.message});
    }

}

module.exports={
    registerCompany , updateCompany , getCompany, getCompanyById,deleteCompany
}