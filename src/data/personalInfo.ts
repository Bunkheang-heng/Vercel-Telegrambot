import * as fs from 'fs';

export interface PersonalInfo {
  name: string;
  contact: {
    email: string;
    phone: string;
    location: string;
    profiles: string[];
  };
  experience: Array<{
    title: string;
    organization: string;
    location?: string;
    date: string;
    description: string[];
  }>;
  volunteer: Array<{
    title: string;
    event: string;
    location: string;
    date: string;
    description: string[];
  }>;
  projects: Array<{
    name: string;
    status?: string;
    description: string;
    link: string;
  }>;
  education: Array<{
    degree: string;
    institution: string;
  }>;
  skills: string[];
  awards_competitions: string[];
}

export class PersonalInfoService {
  private static instance: PersonalInfoService;
  private personalInfo: PersonalInfo;

  private constructor() {
    this.personalInfo = JSON.parse(fs.readFileSync('./info.json', 'utf8'));
  }

  static getInstance(): PersonalInfoService {
    if (!PersonalInfoService.instance) {
      PersonalInfoService.instance = new PersonalInfoService();
    }
    return PersonalInfoService.instance;
  }

  getPersonalInfo(): PersonalInfo {
    return this.personalInfo;
  }

  // Helper methods for specific data
  getContactInfo() {
    return this.personalInfo.contact;
  }

  getProjects() {
    return this.personalInfo.projects;
  }

  getSkills() {
    return this.personalInfo.skills;
  }

  getAwards() {
    return this.personalInfo.awards_competitions;
  }

  getExperience() {
    return this.personalInfo.experience;
  }

  getEducation() {
    return this.personalInfo.education;
  }

  getVolunteerWork() {
    return this.personalInfo.volunteer;
  }
} 