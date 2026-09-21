import { prisma } from "@/shared/config/db.js";
import type { LoginInput, RegisterInput } from "./auth.types.js";
import { ConflictError, UnauthorizedError } from "@/shared/errors/errors.js";
import { comparePassword, hashPassword } from "@/shared/lib/bcrypt.js";
import { generateToken } from "@/shared/lib/jwt.js";

export const registerService = async ({ email, password}: RegisterInput) =>
{
    email = email.trim().toLowerCase()

    const existingUser = await prisma.user.findUnique({
        where: {
            email
        }
    })
    if(existingUser)
    {
        throw new ConflictError("Email is already registered")
    }

    const passwordHash=await hashPassword(password)
    const user = await prisma.user.create({
        data: {
            email,
            passwordHash
        },
        select: {
            id: true,
            email: true,
            createdAt: true
        }
    })

    const token=generateToken(user.id)

    return {
        user,
        token
    }
}

export const loginService = async ({ email, password}: LoginInput) =>
{
    email = email.trim().toLowerCase()

    const user = await prisma.user.findUnique({
        where: {
            email
        }
    })
    if(!user)
    {
        throw new UnauthorizedError("Invalid email or password")
    }

    const passwordMatched=await comparePassword(password, user.passwordHash)
    if(!passwordMatched)
    {
        throw new UnauthorizedError("Invalid email or password")
    }

    const token=generateToken(user.id)

    return {
        user,
        token
    }
}

export const getMeService = async (userId: string) =>
{
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        },
        select: {
            id: true,
            email: true,
            createdAt: true
        }
    })
    if(!user)
    {
        throw new UnauthorizedError("User no longer exists")
    }

    return user
}