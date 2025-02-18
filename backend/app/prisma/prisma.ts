import { PrismaClient } from "@prisma/client";
import { IUser } from "../user/user.dto";
import { v4 as uuid4 } from "uuid";
import bcrypt from 'bcrypt'
import passport from "passport";
import { IGroup } from "../chat/chat.dto";
import { sendEmail } from "../common/services/email.service";
import { ErrorFormatter } from "express-validator";
const Client = new PrismaClient();

const hashPassword = async (password: string) => {
    const hash = await bcrypt.hash(password, 12);
    return hash;
};
export const createUser = async (data: IUser) => {
    // const  id = uuid4();
    data.password = await hashPassword(data.password)
    const result = await Client.user.create({
        data: { ...data, active: true, id: uuid4() }
    });
    return result;
}
export const updateUser = async (id: string, data: IUser) => {
    console.log(typeof (data.active));
    const result = await Client.user.update({
        where: { id: id },
        data: {
            ...data
        },
    });
    return result;
};
export const getUserById = async (id: string) => {
    const result = await Client.user.findUnique({ where: { id }, });
    return result;
};
export const getAllUser = async () => {
    const result = await Client.user.findMany();
    return result;
};
export const deleteUser = async (id: string) => {
    const result = await Client.user.delete({ where: { id: id }, });
    return result;
};
export const getUserByEmail = async (email: string) => {
    const result = await Client.user.findUnique({ where: { email } });
    return result;
}

// chat functions 
export const sendmsg = async (senderEmail: string, recieverEmail: string, msg: string) => {
    console.log(recieverEmail,senderEmail)
    const result = await Client.message.create({
        data: {
            message: msg,
            from: {
                connect: { email: senderEmail }
            },
            to: {
                connect: { email: recieverEmail }  // Make sure this matches the parameter name
            }
        }
    });
    return result;
}
export const getmsgsofEmail = async (senderEmail: string, recieverEmail: string) => {
    try {
        // Fetching messages where the fromEmail is the senderEmail and the toEmail is recieverEmail
        const result = await Client.message.findMany({
            where: {
                from: {
                    email: senderEmail // Filter by the email of the sender
                },
                to: {
                    email: recieverEmail // Filter by the email of the receiver
                }
            }
        });
        console.log("results", result)
        return result; // Return the messages
    } catch (error) {
        console.error('Error fetching messages:');
        throw new Error('Could not fetch messages');
    }
};

// group functions 

export const createGroup = async (data: IGroup, adminId: string) => {
    const result = await Client.group.create({
        data: {
            ...data,
            adminId: adminId
        }
    })
    return result;
}
export const getGroups = async (adminId: string) => {
    const result = await Client.group.findMany({
        where: {
            OR: [
                {
                    adminId: adminId, // Check if user is the admin
                },
                {
                    private: false, // Check if the group is public
                    members: {
                        some: { id: adminId }, // Check if the user is a member
                    },
                },
            ],
        },
        include: {
            admin: true, // Include admin details (if needed)
            members: true, // Include members of the group (if needed)
        },
    });
    return result;
}
export const checkmember = async (groupId: string, memberId: string) => {
    try {
        const group = await Client.group.findUnique({
            where: { id: groupId },
            include: { members: true }, // Include the members to check if the user is in the list
        });

        if (!group) {
            throw new Error('Group not found');
        }

        // Check if the user exists in the group members
        const isMember = group.members.some(member => member.id === memberId);

        if (isMember) {
            return true
        } else {
            return false
        }
    } catch (error) {
        // console.error('Error fetching group members:', error.message);
        throw new Error('Could not fetch group members');
    }
}
export const checkadmin = async (groupId: string, adminId: string) => {
    try {
        // Fetch the group by its ID
        const group = await Client.group.findUnique({
            where: { id: groupId },
            select: { adminId: true }, // Only select the adminId field
        });

        if (!group) {
            throw new Error('Group not found');
        }

        // Check if the userId matches the adminId of the group
        const isAdmin = group.adminId === adminId;

        if (isAdmin) {
            return true;
        } else {
            return false;
        }

        return isAdmin; // Returns true or false based on admin check
    } catch (error) {
        throw new Error('Could not check admin status');
    }
}
export const getmembers = async (groupId: string) => {
    try {
        // Fetch the group along with its members
        const group = await Client.group.findUnique({
            where: { id: groupId },
            include: { members: true }, // This includes the members related to the group
        });

        if (!group) {
            throw new Error('Group not found');
        }

        console.log('Group members:', group.members);
        return group.members; // Returns the list of members
    } catch (error) {
        // console.error('Error fetching group members:', error.message);
        throw new Error('Could not fetch group members');
    }
}
export const sendgroupMsg = async (senderEmail: string, id: string, msg: string,) => {
    const result = await Client.groupMessage.create({
        data: {
            message: msg,
            from: {
                connect: { email: senderEmail }, // Connect to the sender (User)
            },
            to: {
                connect: { id: id } // Connect to the target group by groupId
            }
        }
    })
    return result;
}
export const addsingleusertoGroup = async (groupId: string, userId: string) => {
    // First, check if the group exists
    const user = await Client.user.findUnique({
        where: { id: userId },
    });
    console.log(groupId,userId);
    if (!user) {
        console.error("User not found");
        return;
    }

    // If the group exists, proceed to add the user
    const result = await Client.group.update({
        where: { id: groupId },
        data: {
            members: {
                connect: { id: userId }, // Connect the user to the group
            },
        },
    });
    console.log(result)
    return result;
}


