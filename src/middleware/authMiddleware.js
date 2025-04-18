
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protectMentor = (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      if (decoded.role !== "Mentor") {
        return res.status(403).json({ message: "Access denied. Mentors only." });
      }

      req.mentor = decoded; // ✅ Assign mentor details to req
      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};


const adminProtect = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (decoded.role !== "Admin") {
        return res.status(403).json({ message: "Access denied. Admins only." });
      }

      req.admin = decoded; // Assign admin details to req
      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};




const studentProtect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // ✅ Fetch student from DB & attach to `req.user`
      const user = await User.findById(decoded.id).select("-password");

      if (!user || user.role !== "Student") {
        return res.status(403).json({ message: "Access denied. Students only." });
      }

      req.user = user; // ✅ Change from `req.student` to `req.user`
      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};



const employerProtect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // ✅ Fetch student from DB & attach to `req.student`
      const employer = await User.findById(decoded.id).select("-password");

      if (!employer || employer.role !== "Employer") {
        return res.status(403).json({ message: "Access denied. Employer only." });
      }

      req.employer = employer; // ✅ Assign student to `req.student`
      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

const publisherProtect = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (decoded.role !== "Publisher") {
        return res.status(403).json({ message: "Access denied. Publishers only." });
      }

      req.publisher = decoded; // ✅ Assign publisher details to request
      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};


const managerProtect = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (decoded.role !== "Manager") {
        return res.status(403).json({ message: "Access denied. Managers only." });
      }

      req.manager = decoded; // ✅ Assign manager details to request
      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};



const courseCreatorProtect = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      console.log("🧾 Decoded Token:", decoded);

      if (decoded.role !== "Course Creator") {
        return res.status(403).json({ message: "Access denied. Course Creators only." });
      }

      if (!decoded._id) {
        console.log("❌ Missing _id in token");
        return res.status(401).json({ message: "User not found" });
      }

      req.courseCreator = decoded;
      next();
    } catch (error) {
      console.error("❌ JWT error:", error);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};




module.exports = { adminProtect, studentProtect,protectMentor,employerProtect,publisherProtect,courseCreatorProtect,managerProtect };
