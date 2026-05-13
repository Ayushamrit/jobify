import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
    try {
        let token = req.cookies.token || req.headers.authorization?.split(" ")[1];
        
        console.log("DEBUG: Token received:", token ? "YES (Exists)" : "NO (Missing)");
        console.log("DEBUG: Headers:", req.headers.authorization ? "Bearer present" : "No Bearer");

        if (!token) {
            return res.status(401).json({
                message: "User not authenticated",
                success: false,
            })
        }
        const decode = await jwt.verify(token, process.env.SECRET_KEY);
        if(!decode){
            console.log("DEBUG: Token verification FAILED (No decode)");
            return res.status(401).json({
                message:"Invalid token",
                success:false
            })
        };
        req.id = decode.userId;
        next();
    } catch (error) {
        console.log("DEBUG: Auth Error:", error.message);
        return res.status(401).json({
            message: "Authentication failed: " + error.message,
            success: false,
        });
    }
}
export default isAuthenticated;