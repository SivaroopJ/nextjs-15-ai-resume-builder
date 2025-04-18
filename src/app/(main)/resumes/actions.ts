"use server"

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { del } from "@vercel/blob";
import { revalidatePath } from "next/cache";

export async function deleteResume(id : string) {
    const {userId} = await auth();

    if (!userId) {
        throw new Error("User not authenticated");
    }

    const resume = await prisma.resume.findUnique({
        where :{
            id,
            userId
        }
    });

    if (!resume) {
        throw new Error("Resume not found");
    }

    if (resume.photoUrl) {
        await del(resume.photoUrl)
    }

    await prisma.resume.update({
        where: {
            id
        },
        data: {
          workExperiences: { deleteMany: {} },
          educations: { deleteMany: {} },
          projects: { deleteMany: {} },
        },
      });

    await prisma.resume.delete({
        where : {
            id
        }
    });

    revalidatePath("/resumes");
}