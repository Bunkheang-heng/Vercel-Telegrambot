import { PersonalInfoService } from '../data/personalInfo';

export class KeyboardHandler {
  private static personalInfo = PersonalInfoService.getInstance();

  static getMainKeyboard() {
    return {
      inline_keyboard: [
        [
          { text: "📋 Projects", callback_data: "projects" },
          { text: "🎓 Education", callback_data: "education" }
        ],
        [
          { text: "🏆 Awards", callback_data: "awards" },
          { text: "💼 Experience", callback_data: "experience" }
        ],
        [
          { text: "🛠️ Skills", callback_data: "skills" },
          { text: "📞 Contact", callback_data: "contact" }
        ],
        [
          { text: "🤝 Volunteer", callback_data: "volunteer" },
          { text: "❓ Help", callback_data: "help" }
        ]
      ]
    };
  }

  static async handleCallback(callbackData: string): Promise<string> {
    const personalInfo = this.personalInfo.getPersonalInfo();

    switch (callbackData) {
      case 'projects':
        return this.formatProjects(personalInfo.projects);
      
      case 'education':
        return this.formatEducation(personalInfo.education);
      
      case 'awards':
        return this.formatAwards(personalInfo.awards_competitions);
      
      case 'experience':
        return this.formatExperience(personalInfo.experience);
      
      case 'skills':
        return this.formatSkills(personalInfo.skills);
      
      case 'contact':
        return this.formatContact(personalInfo.contact);
      
      case 'volunteer':
        return this.formatVolunteer(personalInfo.volunteer);
      
      case 'help':
        return this.getHelpMessage();
      
      default:
        return "I'm not sure what you're looking for. Try asking me about Kheang's projects, experience, or skills!";
    }
  }

  private static formatProjects(projects: any[]): string {
    let response = "<b>🚀 Kheang's Projects:</b>\n\n";
    
    projects.forEach(project => {
      const link = project.link ? ` (<a href='${project.link}'>View Project</a>)` : '';
      const status = project.status ? ` [${project.status}]` : '';
      response += `• <b>${project.name}</b>${status}: ${project.description}${link}\n\n`;
    });
    
    return response;
  }

  private static formatEducation(education: any[]): string {
    let response = "<b>🎓 Kheang's Education:</b>\n\n";
    
    education.forEach(edu => {
      response += `• <b>${edu.degree}</b>\n  ${edu.institution}\n\n`;
    });
    
    return response;
  }

  private static formatAwards(awards: string[]): string {
    let response = "<b>🏆 Kheang's Awards & Competitions:</b>\n\n";
    
    awards.forEach(award => {
      response += `• ${award}\n`;
    });
    
    return response;
  }

  private static formatExperience(experience: any[]): string {
    let response = "<b>💼 Kheang's Experience:</b>\n\n";
    
    experience.forEach(exp => {
      response += `• <b>${exp.title}</b> at ${exp.organization}\n`;
      response += `  📍 ${exp.location || 'Remote'}\n`;
      response += `  📅 ${exp.date}\n`;
      exp.description.forEach((desc: string) => {
        response += `  - ${desc}\n`;
      });
      response += "\n";
    });
    
    return response;
  }

  private static formatSkills(skills: string[]): string {
    let response = "<b>🛠️ Kheang's Skills:</b>\n\n";
    
    // Group skills by category
    const categories = {
      'Frontend': ['JavaScript', 'HTML', 'CSS', 'ReactJS', 'Next.js', 'Tailwind CSS'],
      'Backend': ['Nest.js', 'Express.js', 'Python', 'Flask', 'RESTful APIs'],
      'Database': ['SQL', 'Postgres', 'MongoDB', 'Firebase'],
      'DevOps': ['Docker', 'AWS', 'Google Cloud', 'Git'],
      'AI/ML': ['AI Integration']
    };

    Object.entries(categories).forEach(([category, categorySkills]) => {
      const userSkills = skills.filter(skill => categorySkills.includes(skill));
      if (userSkills.length > 0) {
        response += `<b>${category}:</b> ${userSkills.join(', ')}\n\n`;
      }
    });
    
    return response;
  }

  private static formatContact(contact: any): string {
    let response = "<b>📞 Contact Kheang:</b>\n\n";
    response += `📧 Email: ${contact.email}\n`;
    response += `📱 Phone: ${contact.phone}\n`;
    response += `📍 Location: ${contact.location}\n`;
    response += `🔗 Profiles: ${contact.profiles.join(', ')}\n`;
    
    return response;
  }

  private static formatVolunteer(volunteer: any[]): string {
    let response = "<b>🤝 Kheang's Volunteer Work:</b>\n\n";
    
    volunteer.forEach(vol => {
      response += `• <b>${vol.title}</b> - ${vol.event}\n`;
      response += `  📍 ${vol.location}\n`;
      response += `  📅 ${vol.date}\n`;
      vol.description.forEach((desc: string) => {
        response += `  - ${desc}\n`;
      });
      response += "\n";
    });
    
    return response;
  }

  private static getHelpMessage(): string {
    return `<b>❓ How to use Kheang Bot:</b>

You can ask me anything about Kheang (Heng Bunkheang)! Here are some examples:

<b>About Projects:</b>
• "Tell me about Kheang's projects"
• "What has Kheang built?"
• "Show me Kheang's work"

<b>About Experience:</b>
• "Where does Kheang work?"
• "What's Kheang's experience?"
• "Tell me about Kheang's jobs"

<b>About Skills:</b>
• "What are Kheang's skills?"
• "What technologies does Kheang know?"
• "What can Kheang do?"

<b>About Education:</b>
• "Where did Kheang study?"
• "What's Kheang's education?"

<b>About Awards:</b>
• "What awards has Kheang won?"
• "Tell me about Kheang's competitions"

Just type your question and I'll help you learn about Kheang! 🚀`;
  }
} 