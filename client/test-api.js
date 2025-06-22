// Test script for external API integration
// Run with: node test-api.js

import axios from 'axios';

const API_CONFIG = {
  RAPIDAPI_KEY: '1e8d146322msh7816517f4bf3f7ep1b4d79jsnc3965463267d',
  RAPIDAPI_HOST: 'internships-api.p.rapidapi.com',
  BASE_URL: 'https://internships-api.p.rapidapi.com'
};

const testAPI = async () => {
  console.log('🧪 Testing External API Integration...\n');

  const EXTERNAL_API = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    headers: {
      'x-rapidapi-key': API_CONFIG.RAPIDAPI_KEY,
      'x-rapidapi-host': API_CONFIG.RAPIDAPI_HOST
    },
    timeout: 10000
  });

  try {
    console.log('📡 Fetching internships from external API...');
    const response = await EXTERNAL_API.get('/active-ats-7d');
    
    console.log('✅ API Response Status:', response.status);
    console.log('📊 Response Type:', typeof response.data);
    
    // Handle different response structures
    let jobsData = response.data;
    if (jobsData.data) jobsData = jobsData.data;
    if (jobsData.jobs) jobsData = jobsData.jobs;
    if (jobsData.results) jobsData = jobsData.results;
    
    if (Array.isArray(jobsData)) {
      console.log('✅ Jobs found:', jobsData.length);
      
      if (jobsData.length > 0) {
        const firstJob = jobsData[0];
        console.log('\n📋 First job sample:');
        console.log('- Title:', firstJob.title || firstJob.position || 'N/A');
        console.log('- Company:', firstJob.company || firstJob.employer || 'N/A');
        console.log('- Location:', firstJob.location || 'N/A');
        console.log('- Source:', firstJob.source || 'N/A');
      }
    } else {
      console.log('⚠️  Jobs data is not an array:', typeof jobsData);
      console.log('📄 Sample data keys:', Object.keys(jobsData).slice(0, 10));
    }

    console.log('\n🎉 API integration test completed successfully!');
    
  } catch (error) {
    console.error('❌ API Test Failed:');
    
    if (error.response) {
      console.error('📄 Status:', error.response.status);
      console.error('📄 Status Text:', error.response.statusText);
      console.error('📄 Headers:', error.response.headers);
      console.error('📄 Data:', error.response.data);
    } else if (error.request) {
      console.error('📡 Request Error:', error.request);
    } else {
      console.error('⚠️  General Error:', error.message);
    }
    
    console.log('\n💡 Troubleshooting tips:');
    console.log('1. Check your internet connection');
    console.log('2. Verify the API key is correct');
    console.log('3. Check if you have exceeded rate limits');
    console.log('4. Try again in a few minutes');
  }
};

// Run the test
testAPI();
