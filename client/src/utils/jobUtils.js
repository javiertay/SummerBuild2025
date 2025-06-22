// Utility functions for external API data processing

// Transform external API job data to internal format
export const transformExternalJob = (externalJob, index = 0) => {
  // Extract location from locations_derived array or locations_raw
  const getLocation = () => {
    if (externalJob.locations_derived && externalJob.locations_derived.length > 0) {
      return externalJob.locations_derived[0];
    }
    if (externalJob.locations_raw && externalJob.locations_raw.length > 0) {
      const locationRaw = externalJob.locations_raw[0];
      if (locationRaw.address) {
        const addr = locationRaw.address;
        const parts = [
          addr.addressLocality,
          addr.addressRegion,
          addr.addressCountry
        ].filter(Boolean);
        return parts.join(', ') || 'Remote';
      }
    }
    return 'Remote';
  };

  return {
    id: externalJob.id || `ext_${index}`,
    title: externalJob.title || "Software Engineer Intern",
    company: externalJob.organization || "Tech Company",
    location: getLocation(),
    description: externalJob.description || "",
    requirements: externalJob.requirements || "",
    applyUrl: externalJob.url || "#",
    salary: externalJob.salary_raw || "Competitive",
    datePosted: externalJob.date_posted || new Date().toISOString(),
    source: externalJob.source || "External API",
    jobType: externalJob.employment_type ? externalJob.employment_type.join(', ') : "Internship",
    remote: externalJob.remote_derived || false,
    tags: externalJob.tags || [],
    organizationLogo: externalJob.organization_logo || null
  };
};

// Filter jobs based on skills (more flexible matching)
export const filterJobsBySkills = (jobs, skills) => {
  if (!skills || skills.length === 0) return jobs;
  
  return jobs.filter(job => {
    const searchText = `${job.title} ${job.description} ${job.requirements} ${job.company}`.toLowerCase();
    
    // Check for direct skill matches
    const hasSkillMatch = skills.some(skill => 
      searchText.includes(skill.toLowerCase())
    );
    
    // Also include tech-related keywords for broader matching
    const techKeywords = ['engineer', 'developer', 'software', 'tech', 'it', 'intern', 'student'];
    const hasTechMatch = techKeywords.some(keyword => 
      searchText.includes(keyword)
    );
    
    return hasSkillMatch || hasTechMatch;
  });
};

// Filter jobs based on location (improved matching)
export const filterJobsByLocation = (jobs, location) => {
  if (!location || location === "All") return jobs;
  
  return jobs.filter(job => {
    const jobLocation = job.location.toLowerCase();
    const filterLocation = location.toLowerCase();
    
    // Check if the filter location is contained in the job location
    return jobLocation.includes(filterLocation);
  });
};

// Get unique locations from jobs array
export const getUniqueLocations = (jobs) => {
  const locations = new Set();
  jobs.forEach(job => {
    if (job.location) {
      locations.add(job.location);
    }
  });
  return Array.from(locations).sort();
};

// Get unique companies from jobs array
export const getUniqueCompanies = (jobs) => {
  const companies = new Set();
  jobs.forEach(job => {
    if (job.company) {
      companies.add(job.company);
    }
  });
  return Array.from(companies).sort();
};
