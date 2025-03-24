// About Us content model with editable sections

// Initial default content
let aboutUsContent = {
  title: "About Us",
  mission: "Our mission is to revolutionize the hiring process by leveraging AI to create fair, efficient, and insightful interviews.",
  vision: "We envision a world where every candidate has an equal opportunity to showcase their skills and potential.",
  story: "Founded in 2023, our team of HR professionals and AI experts came together to solve the challenges of traditional interviewing processes.",
  team: [
    {
      id: 1,
      name: "Piyush Bhardwaj",
      position: "CEO & Co-Founder",
      bio: "formerly flutter devloper",
      image: "/team/piyush.jpg"
    },
    {
      id: 2,
      name: "Kashish Gupta",
      position: "CTO & Co-Founder",
      bio: "AI researcher with a passion for applying machine learning to HR processes.",
      image: "/team/kashish.jpg"
    }
  ],
  values: [
    {
      id: 1,
      title: "Fairness",
      description: "We believe in creating a level playing field for all candidates."
    },
    {
      id: 2,
      title: "Innovation",
      description: "We continuously improve our AI to provide better insights."
    },
    {
      id: 3,
      title: "Privacy",
      description: "We prioritize data security and candidate privacy."
    }
  ],
  lastUpdated: new Date().toISOString()
};

// Mock functions to handle content updates (these would connect to a database in production)
export function getAboutUsContent() {
  return { ...aboutUsContent };
}

export function updateAboutUsContent(newContent: Partial<typeof aboutUsContent>) {
  aboutUsContent = {
    ...aboutUsContent,
    ...newContent,
    lastUpdated: new Date().toISOString()
  };
  return aboutUsContent;
}

export function updateTeamMember(id: number, data: Partial<(typeof aboutUsContent.team)[0]>) {
  const teamIndex = aboutUsContent.team.findIndex(member => member.id === id);
  if (teamIndex === -1) return null;
  
  aboutUsContent.team[teamIndex] = {
    ...aboutUsContent.team[teamIndex],
    ...data
  };
  
  aboutUsContent.lastUpdated = new Date().toISOString();
  return aboutUsContent.team[teamIndex];
}

export function addTeamMember(data: Omit<(typeof aboutUsContent.team)[0], 'id'>) {
  const newId = Math.max(0, ...aboutUsContent.team.map(m => m.id)) + 1;
  const newMember = { ...data, id: newId };
  
  aboutUsContent.team.push(newMember);
  aboutUsContent.lastUpdated = new Date().toISOString();
  
  return newMember;
}

export function removeTeamMember(id: number) {
  const initialLength = aboutUsContent.team.length;
  aboutUsContent.team = aboutUsContent.team.filter(member => member.id !== id);
  
  if (aboutUsContent.team.length !== initialLength) {
    aboutUsContent.lastUpdated = new Date().toISOString();
    return true;
  }
  
  return false;
}

export function updateValue(id: number, data: Partial<(typeof aboutUsContent.values)[0]>) {
  const valueIndex = aboutUsContent.values.findIndex(value => value.id === id);
  if (valueIndex === -1) return null;
  
  aboutUsContent.values[valueIndex] = {
    ...aboutUsContent.values[valueIndex],
    ...data
  };
  
  aboutUsContent.lastUpdated = new Date().toISOString();
  return aboutUsContent.values[valueIndex];
}

export function addValue(data: Omit<(typeof aboutUsContent.values)[0], 'id'>) {
  const newId = Math.max(0, ...aboutUsContent.values.map(v => v.id)) + 1;
  const newValue = { ...data, id: newId };
  
  aboutUsContent.values.push(newValue);
  aboutUsContent.lastUpdated = new Date().toISOString();
  
  return newValue;
}

export function removeValue(id: number) {
  const initialLength = aboutUsContent.values.length;
  aboutUsContent.values = aboutUsContent.values.filter(value => value.id !== id);
  
  if (aboutUsContent.values.length !== initialLength) {
    aboutUsContent.lastUpdated = new Date().toISOString();
    return true;
  }
  
  return false;
} 