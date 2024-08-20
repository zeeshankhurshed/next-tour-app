import mongoose from "mongoose";
import Tour from "../models/tour.js";


export const createTour=async(req,res)=>{
const tour=req.body;

const newTour=new Tour({
    ...tour,
    creator:req.userId,
    createdAt:new Date().toISOString(),
});
try {
    await newTour.save();
    res.status(201).json(newTour);
} catch (error) {
    console.error("Error creating tour:", error);
    res.status(500).json({message:"Unable to create tour. Please try again later. "})
}
}

// export const getTours=async(req,res)=>{
// try {
//     const tours=await Tour.find();
//     res.status(200).json(tours);
// } catch (error) {
//     console.error("Error creating tour:", error);
//     res.status(500).json({message:"Unable to Fetch tour. Please try again later. "})
// }
// }

export const getTours = async (req, res) => {
  const { page } = req.query;
  try {
    const limit = 6; // Number of tours per page
    const startIndex = (Number(page) - 1) * limit; // Calculate starting index for pagination
    const total = await Tour.countDocuments({}); // Total number of tours
    const tours = await Tour.find().limit(limit).skip(startIndex); // Fetch paginated tours
    res.status(200).json({
      data: tours,
      currentPage: Number(page),
      totalTours: total,
      numberOfPages: Math.ceil(total / limit), // Corrected Math.ceil
    });
  } catch (error) {
    console.error('Error fetching tours:', error.message);
    res.status(500).json({ message: 'Unable to fetch tours. Please try again later.' });
  }
};

export const getTour=async(req,res)=>{
    const {id}=req.params;
    try {
        const tour=await Tour.findById(id);
        if(!tour){
            return res.status(404).json({message:"Tour not found"});
        }
        res.status(200).json({message:"Tour fetch successfully",tour});
    } catch (error) {
        console.error('Error fetching tour:',error.message);
        res.status(500).json({message:"Something went Wrong"});
            }
}

export const getToursByUser = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "User does not exist" });
    }
    try {
      const userTours = await Tour.find({ creator: id });
      res.status(200).json({ message: 'User Tours fetched successfully', userTours });
    } catch (error) {
      console.error('User Tours cannot be fetched', error);
      res.status(500).json({ message: 'Something went wrong' });
    }
  };
  
  export const deleteTour = async (req, res) => {
    const { id } = req.params;
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: `No Tour exists with ID: ${id}` });
      }
      await Tour.findByIdAndDelete(id);
      res.json({ message: "Tour deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
    }
  };
  export const updateTour = async (req, res) => {
    const { id } = req.params;
    const { title, description, creator, imageFile, tags } = req.body;
  
    try {
      // Validate the provided id
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: `No Tour exists with id: ${id}` });
      }
  
      // Create the update object
      const updatedTour = {
        creator,
        title,
        description,
        tags,
        imageFile,
      };
  
      // Update the tour and return the updated document
      const tour = await Tour.findByIdAndUpdate(id, updatedTour, { new: true });
      
      // Check if the tour was found and updated
      if (!tour) {
        return res.status(404).json({ message: `No Tour found with id: ${id}` });
      }
  
      res.json({ message: "Updated Tour successfully", updatedTour: tour });
    } catch (error) {
      console.error("Error updating tour:", error); // Log error details
      res.status(500).json({ message: "Something went wrong while updating the tour" });
    }
  };

  export const getTourBySearch = async (req, res) => {
    const { searchQuery } = req.query;
    
    console.log('Search Query:', searchQuery); // Debugging line
  
    if (!searchQuery) {
      return res.status(400).json({ message: 'Search query cannot be empty' });
    }
  
    try {
      const title = new RegExp(searchQuery, 'i');
      const tours = await Tour.find({ title });
      res.status(200).json(tours);
    } catch (error) {
      res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
  };

  export const getToursByTag=async(req,res)=>{
    const {tag}=req.params;
    try {
      const tours=await Tour.find({tags:{$in:tag}});
      res.status(200).json(tours);
    } catch (error) {
      res.status(500).json({message:'Something went Wrong',error:error.message})
    }
    }

    export const getRelatedTours = async (req, res) => {
      const { tags } = req.body;
      console.log('Received tags:', tags); // Verify correct tags input
      if (!tags || !Array.isArray(tags)) {
        return res.status(400).json({ message: 'Tags must be provided and must be an array.' });
      }
      try {
        const tours = await Tour.find({ tags: { $in: tags } });
        res.status(200).json(tours);
      } catch (error) {
        res.status(500).json({ message: 'Something went wrong', error: error.message });
      }
    };
    
    export const likeTour = async (req, res) => {
      const { id } = req.params;
      try {
        if (!req.userId) {
          return res.status(404).json({ message: "User is not authenticated" });
        }
    
        if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(404).json({ message: `No tour exists with id: ${id}` });
        }
    
        const tour = await Tour.findById(id);
    
        const index = tour.likes.findIndex((userId) => userId === String(req.userId));
    
        if (index === -1) {
          tour.likes.push(req.userId);  // Add the user's ID to the likes array
        } else {
          tour.likes = tour.likes.filter((userId) => userId !== String(req.userId));  // Remove the user's ID to unlike
        }
    
        const updatedTour = await Tour.findByIdAndUpdate(id, tour, { new: true });
        return res.status(200).json(updatedTour);
      } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error: error.message });
      }
    };
    
    