import User from "../model/user.model.js"


export const getAllUsers = async (req, res, next) =>{
    try {
        const users = await User.find({},{password: 0}).sort({createdAt: -1});
        res.status(200).json(users);
    } catch (error) {
        console.log("Failed to fetch users:", error)
        res.status(500).json({message:"Internal Server Error"});
        next(error);
    }
}

export const getUserById = async (req, res, next) =>{
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json(user);
    } catch (error) {
        console.log("Failed to fetch users:", error)
        res.status(500).json({message:"Internal Server Error"});
        next(error);
    }
}