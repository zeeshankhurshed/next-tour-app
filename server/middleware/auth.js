import jwt from 'jsonwebtoken';
import User from '../models/user.js';


const SECRET_KEY='zeeshankhursheed'

const auth = async (req, res, next) => {
    try {
        // console.log('Request Headers:', req.headers);
        
        const authHeader = req.headers.authorization;
        // console.log('Auth Header:', authHeader);

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log('No token provided or incorrect format');
            return res.status(401).json({ message: 'No token provided or incorrect format' });
        }

        const token = authHeader.split(" ")[1];
        // console.log('Token:', token);

        const isCustomAuth = token.length < 500;
        let decodedData;

        if (isCustomAuth) {
            decodedData = jwt.verify(token, SECRET_KEY);
            req.userId = decodedData?.id;
        } else {
          const decoded = jwt.decode(token, { complete: true });
          // console.log(decoded);
          

            if (!decodedData) {
                // console.log('Invalid Google token');
                return res.status(401).json({ message: 'Invalid Google token' });
            }

            const googleId = decodedData.sub.toString();
            const user = await User.findOne({ googleId });

            if (!user) {
                // console.log('User not found');
                return res.status(404).json({ message: 'User not found' });
            }

            req.userId = user._id;
        }

        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ message: 'Authentication failed' });
    }
};


export default auth;