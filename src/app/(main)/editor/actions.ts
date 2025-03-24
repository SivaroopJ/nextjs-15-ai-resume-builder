"use server"

import { canCreateResume, canUseCustomizations } from "@/lib/permissions";
import prisma from "@/lib/prisma";
import { getUserSubscriptionLevel } from "@/lib/subscription";
import { resumeSchema, ResumeValues } from "@/lib/validation";
import { auth } from "@clerk/nextjs/server";
import { del, put } from "@vercel/blob"
import path from "path";

export async function saveResume(values: ResumeValues) {
    const { id } = values

    console.log("received values", values);

    const {
        photo,
        workExperiences,
        educations,
        projects,
        ...resumeValues
    } = resumeSchema.parse(values);

    const { userId } = await auth();

    if (!userId) {
        throw new Error("User not authenticated");
    }

    const subscriptionLevel = await getUserSubscriptionLevel(userId)

    if(!id) {
        const resumeCount = await prisma.resume.count({where: {userId}})

        if(!canCreateResume(subscriptionLevel,resumeCount)){
            throw new Error(
                "Maximum resume count reached for this subscription level",
            );
        }
    }

    const existingResume = id
    ? await prisma.resume.findUnique({where: {id, userId}})
    : null;

    if (id && !existingResume) {
        throw new Error("Resume not found");
    }

    const hasCustomizations = (resumeValues.borderStyle &&
        resumeValues.borderStyle !== existingResume?.borderStyle
    ) || (resumeValues.colorHex &&
        resumeValues.colorHex !== existingResume?.colorHex
    )

    if(hasCustomizations && !canUseCustomizations(subscriptionLevel)){
        throw new Error("Customizations not allowed for this suscription level");
    }

    // Upload the photo to blob storage
    let newPhotoUrl: string | undefined | null = undefined;
    // Undefined = no photo uploaded
    // Null = photo to be deleted

    if (photo instanceof File) {
        if (existingResume?.photoUrl) {
            // Delete the existing photo
            await del(existingResume.photoUrl);
        }

        const blob = await put(`resume_photos/${path.extname(photo.name)}`, photo, {
            access : "public" // Can be seen by anyone with the exact url
        }) // Not inverted commas, but back quotes

        newPhotoUrl = blob.url;
    } else if (photo === null) {
        if (existingResume?.photoUrl) {
            await del(existingResume.photoUrl);
        }
        newPhotoUrl = null;
    }

    if (id) {
        return prisma.resume.update({
            where: {id},
            data: {
                ...resumeValues, // Does not contain the photo and other table like structures, already destructured earlier
                photoUrl: newPhotoUrl,
                workExperiences: {
                    deleteMany: {},
                    create: workExperiences?.map(exp => ({
                        ...exp,
                        startDate: exp.startDate? new Date(exp.startDate) : undefined,
                        endDate: exp.endDate? new Date(exp.endDate) : undefined
                    }))
                },
                educations: {
                    deleteMany: {},
                    create: educations?.map(edu => ({
                        ...edu,
                        startDate: edu.startDate? new Date(edu.startDate) : undefined,
                        endDate: edu.endDate? new Date(edu.endDate) : undefined
                    }))
                },
                projects: {
                    deleteMany: {},
                    create: projects?.map(pro => ({
                        ...pro,
                    }))
                },
                updatedAt: new Date(), // This statement might be redundant
            }
        })
    } else {
        return prisma.resume.create({
            data: {
                ...resumeValues, // Does not contain the photo and other table like structures, already destructured earlier
                userId,
                photoUrl: newPhotoUrl,
                workExperiences: {
                    create: workExperiences?.map(exp => ({
                        ...exp,
                        startDate: exp.startDate? new Date(exp.startDate) : undefined,
                        endDate: exp.endDate? new Date(exp.endDate) : undefined
                    }))
                },
                educations: {
                    create: educations?.map(edu => ({
                        ...edu,
                        startDate: edu.startDate? new Date(edu.startDate) : undefined,
                        endDate: edu.endDate? new Date(edu.endDate) : undefined
                    }))
                },
                projects: {
                    create: projects?.map(pro => ({
                        ...pro,
                    }))
                },
            }
        })
    }
}