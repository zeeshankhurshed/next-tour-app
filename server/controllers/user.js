import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


const SECRET_KEY='zeeshankhursheed'

export const signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ message: "User does not exist" });
        }

        // Compare the provided password with the stored hashed password
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { email: existingUser.email, id: existingUser._id },
            SECRET_KEY,
            { expiresIn: '1h' }
        );

        // Return user and token in response
        res.status(200).json({ message:'User login Successfully',user: existingUser, token });
    } catch (error) {
        console.error('Error during user sign in:', error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

export const signup = async (req, res) => {
    const { email, password, confirmPassword, firstName, lastName } = req.body;

    console.log('Password:', password);
    console.log('Confirm Password:', confirmPassword);
    

    try {
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }
        
        if (await User.findOne({ email })) {
            return res.status(400).json({ message: "User already exists" });
        }
        
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = await User.create({
            email,
            password: hashedPassword,
            name: `${firstName} ${lastName}`
        });

        // Generate JWT token
        const token = jwt.sign(
            { email: newUser.email, id: newUser._id },
            SECRET_KEY,
            { expiresIn: '1h' }
        );

        res.status(201).json({ user: newUser, token });

    } catch (error) {
        console.error('Error during user signup:', error);
        res.status(500).json({ message: "Something went wrong" });
    }
};


export const google = async (req, res) => {
    try {
        const { email, name, photo } = req.body;
        let user = await User.findOne({ email });

        if (user) {
            const token = jwt.sign({ id: user._id }, SECRET_KEY);
            const expiryDate = new Date(Date.now() + 3600000);
            res.cookie('token', token, {
                httpOnly: true,
                expires: expiryDate,
            });
            return res.status(200).json({ user, token });
        } else {
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcrypt.hashSync(generatedPassword, 10);

            const newUser = new User({
                name,
                email,
                password: hashedPassword,
                profilePicture: photo,
            });

            await newUser.save();
            const token = jwt.sign({ id: newUser._id }, SECRET_KEY);
            const expiryDate = new Date(Date.now() + 3600000);
            res.cookie('token', token, {
                httpOnly: true,
                expires: expiryDate,
            });
            return res.status(200).json({ user: newUser, token });
        }
    } catch (error) {
        console.error('Could not sign in with Google', error);
        res.status(500).json({ message: "Could not sign in with Google" });
    }
};

