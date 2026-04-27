import { Conversation } from "../models/conversationModel.js";
import { Message } from "../models/messageModel.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req,res) => {
    try {
        const senderId = req.id;
        const targetId = req.params.id; 
        const {message} = req.body;

        let gotConversation = await Conversation.findOne({
            $or: [
                { _id: targetId }, 
                { participants: { $all: [senderId, targetId], $size: 2 }, isGroup: false }
            ]
        });

        if(!gotConversation){
            gotConversation = await Conversation.create({
                participants:[senderId, targetId],
                isGroup: false
            })
        };

        const newMessage = await Message.create({
            senderId,
            receiverId: targetId, 
            message
        });

        if(newMessage){
            gotConversation.messages.push(newMessage._id);
        };
        
        await Promise.all([gotConversation.save(), newMessage.save()]);
         
        // SOCKET IO
        gotConversation.participants.forEach(participantId => {
            const receiverSocketId = getReceiverSocketId(participantId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("newMessage", {
                    ...newMessage._doc,
                    conversationId: gotConversation._id // helpful for frontend to update sidebar
                });
            }
        });

        return res.status(201).json({
            newMessage
        })
    } catch (error) {
        console.log(error);
    }
}

export const getMessage = async (req,res) => {
    try {
        const targetId = req.params.id;
        const senderId = req.id;

        const conversation = await Conversation.findOne({
            $or: [
                { _id: targetId },
                { participants: { $all: [senderId, targetId], $size: 2 }, isGroup: false }
            ]
        }).populate("messages"); 

        return res.status(200).json(conversation?.messages || []);
    } catch (error) {
        console.log(error);
    }
}

export const createGroup = async (req, res) => {
    try {
        const { groupName, participants } = req.body;
        const adminId = req.id;

        if (!groupName || !participants || participants.length < 2) {
            return res.status(400).json({ message: "Invalid group data" });
        }

        const allParticipants = [...participants, adminId];

        const newGroup = await Conversation.create({
            groupName,
            participants: allParticipants,
            isGroup: true,
            groupAdmin: adminId
        });

        return res.status(201).json(newGroup);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}
