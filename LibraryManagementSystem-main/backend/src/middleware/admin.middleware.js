

export const adminCheck = (req, res, next)=>{
    try {
        if (req.user.role !== 'ADMIN'){
        return res.status(401).json({success:false,message:"Unauthorized"});
        }
        next();
    } catch (error) {
        next(error);
    }
}