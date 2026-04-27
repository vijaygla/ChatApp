import { User } from "../models/userModel.js";
import { Conversation } from "../models/conversationModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        const { fullName, username, password, confirmPassword, gender } = req.body;
        if (!fullName || !username || !password || !confirmPassword || !gender) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Password do not match" });
        }

        const user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: "Username already exit try different" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        // profilePhoto
        const maleProfilePhoto = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const femaleProfilePhoto = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        await User.create({
            fullName,
            username,
            password: hashedPassword,
            profilePhoto: gender === "male" ? maleProfilePhoto : femaleProfilePhoto,
            gender
        });
        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
};
export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: "All fields are required" });
        };
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect username or password",
                success: false
            })
        };
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect username or password",
                success: false
            })
        };
        const tokenData = {
            userId: user._id
        };

        const token = await jwt.sign(tokenData, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' }).json({
            _id: user._id,
            username: user.username,
            fullName: user.fullName,
            profilePhoto: user.profilePhoto
        });

    } catch (error) {
        console.log(error);
    }
}
export const logout = (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "logged out successfully."
        })
    } catch (error) {
        console.log(error);
    }
}
export const getOtherUsers = async (req, res) => {
    try {
        const loggedInUserId = req.id;
        const otherUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
        return res.status(200).json(otherUsers);
    } catch (error) {
        console.log(error);
    }
}

export const getSidebarChats = async (req, res) => {
    try {
        const loggedInUserId = req.id;
        
        // 1. Get all other users
        const otherUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
        
        // 2. For each user, find the last message in their conversation with the logged-in user
        const chatsWithLastMessage = await Promise.all(otherUsers.map(async (user) => {
            const conversation = await Conversation.findOne({
                participants: { $all: [loggedInUserId, user._id], $size: 2 },
                isGroup: false
            }).populate({
                path: "messages",
                options: { sort: { createdAt: -1 }, limit: 1 }
            });

            return {
                ...user._doc,
                lastMessage: conversation?.messages[0] || null
            };
        }));
        
        // 3. Get all group conversations user is part of
        const groups = await Conversation.find({
            participants: { $in: [loggedInUserId] },
            isGroup: true
        }).populate("participants", "-password")
          .populate({
            path: "messages",
            options: { sort: { createdAt: -1 }, limit: 1 }
          });

        const formattedGroups = groups.map(group => ({
            _id: group._id,
            fullName: group.groupName,
            profilePhoto: "https://cdn-icons-png.flaticon.com/512/166/166258.png",
            isGroup: true,
            participants: group.participants,
            lastMessage: group.messages[0] || null
        }));

        // Combine them
        const allChats = [...chatsWithLastMessage, ...formattedGroups];
        
        // Sort all chats by last message time if available
        allChats.sort((a, b) => {
            const timeA = a.lastMessage?.createdAt ? new Date(a.lastMessage.createdAt) : new Date(0);
            const timeB = b.lastMessage?.createdAt ? new Date(b.lastMessage.createdAt) : new Date(0);
            return timeB - timeA;
        });

        return res.status(200).json(allChats);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

