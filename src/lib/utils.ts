import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ResumeServerData } from "./types";
import { ResumeValues } from "./validation";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Not able to trigger the autosave when changing a photo from one photo to another
// It is because the stringifying does not work as expected, as JS does not know how to stringify a file, so both the files compared are exactly the same
export function fileReplacer(key: unknown, value: unknown) {
  // Replaces a file as a string
  // A stringify for a file basically
  return value instanceof File // File denotes a photo here, not the whole resume
  ? {
    // ...value, // Can't spread the values as a whole
    name : value.name,
    size : value.size,
    type : value.type,
    lastModified : value.lastModified,
  } : value;
}

export function mapToResumeValues(data: ResumeServerData) : ResumeValues {
  // Converting the server side data received to client side data
  return {
    // These values can't be set to null, but to undefined
    id : data.id,
    title : data.title || undefined,
    description : data.description || undefined,
    photo : data.photoUrl || undefined,
    firstName : data.firstName || undefined,
    lastName : data.lastName || undefined,
    jobTitle : data.jobTitle || undefined,
    city : data.city || undefined,
    country : data.country || undefined,
    phone : data.phone || undefined,
    email : data.email || undefined,
    workExperiences : data.workExperiences.map(exp => ({
      position : exp.position || undefined,
      company : exp.company || undefined,
      // Dates are to be handled differently for server and client both sides
      startDate : exp.startDate?.toISOString().split("T")[0],
      endDate : exp.endDate?.toISOString().split("T")[0],
      description : exp.description || undefined
    })),
    educations : data.educations.map(edu => ({
      degree : edu.degree || undefined,
      school : edu.school || undefined,
      // Dates are to be handled differently for server and client both sides
      startDate : edu.startDate?.toISOString().split("T")[0],
      endDate : edu.endDate?.toISOString().split("T")[0],
    })),
    skills : data.skills, // array, can't be null
    borderStyle : data.borderStyle, // Default value, can't be null
    colorHex : data.colorHex, // Default value, can't be null
    summary : data.summary || undefined,
  }
}