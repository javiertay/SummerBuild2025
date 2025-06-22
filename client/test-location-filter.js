// Test location filtering
const sampleJobs = [
  { location: 'Berlin, Berlin, Germany', title: 'Test Job 1' },
  { location: 'Chennai, Tamil Nadu, India', title: 'Test Job 2' },
  { location: 'Taiwan', title: 'Test Job 3' },
  { location: 'Malaysia', title: 'Test Job 4' }
];

const filterByLocation = (jobs, location) => {
  if (!location || location === 'All') return jobs;
  return jobs.filter(job => {
    const jobLocation = job.location.toLowerCase();
    const filterLocation = location.toLowerCase();
    return jobLocation.includes(filterLocation);
  });
};

console.log('Original jobs:');
sampleJobs.forEach(job => console.log('- ' + job.location));

console.log('\nFiltering by "Germany":');
const germanyJobs = filterByLocation(sampleJobs, 'Germany');
germanyJobs.forEach(job => console.log('- ' + job.location));

console.log('\nFiltering by "India":');
const indiaJobs = filterByLocation(sampleJobs, 'India');
indiaJobs.forEach(job => console.log('- ' + job.location));
