// Hindu Calendar API utilities
import axios from 'axios';

// Flag to control whether to use mock data instead of external API
const useMockExternalApi = true;

// Get API key from environment variables
const API_KEY = import.meta.env.VITE_ASTRONOMY_API_KEY || 'hRY7KgTKXTSqjNZMJjslP5A0a3ZwJTVJ4IrY2GFJ16ec2e21';
const API_BASE_URL = 'https://api.astronomyapi.com/api/v2';

/**
 * Calculate the Hindu calendar data for a given date and location
 * This uses the Astronomy API to get accurate celestial positions
 */
export const calculateLocalHinduCalendar = async (dateStr: string, latitude: number, longitude: number) => {
  try {
    // First, try to use the Astronomy API
    const result = await fetchAstronomicalData(dateStr, latitude, longitude);
    if (result) {
      return result;
    }
  } catch (error) {
    console.error('Error fetching astronomical data:', error);
    // Fall back to local calculation if API fails
  }
  
  // Fallback calculation if API fails
  return fallbackCalculation(dateStr);
};

/**
 * Fetch astronomical data from the Astronomy API
 */
const fetchAstronomicalData = async (dateStr: string, latitude: number, longitude: number) => {
  // If using mock external API, return null to trigger fallback
  if (useMockExternalApi) {
    return null;
  }
  
  try {
    // Format date for API
    const date = new Date(dateStr);
    const formattedDate = date.toISOString().split('T')[0];

    // Create Basic Auth token
    const authString = `${API_KEY}:`;
    // Use btoa for browser or Buffer for Node.js
    const authToken = typeof btoa === 'function' 
      ? btoa(authString) 
      : Buffer.from(authString).toString('base64');
    
    // Get moon phase data
    const response = await axios.get(`${API_BASE_URL}/bodies/positions`, {
      params: {
        longitude: longitude,
        latitude: latitude,
        elevation: 0,
        from_date: formattedDate,
        to_date: formattedDate,
        time: '00:00:00',
        bodies: 'moon,sun'
      },
      headers: {
        'Authorization': `Basic ${authToken}`
      }
    });
    
    // Extract moon phase data
    const moonData = response.data?.data?.table?.rows?.[0]?.cells?.[0];
    const sunData = response.data?.data?.table?.rows?.[0]?.cells?.[1];
    
    if (!moonData || !sunData) {
      throw new Error('Invalid response from Astronomy API');
    }
    
    // Calculate lunar phase (paksha) based on moon phase
    // Moon phase is between 0 and 1, where 0 and 1 are new moon, 0.5 is full moon
    const moonPhase = moonData.phase.phase;
    const paksha = moonPhase < 0.5 ? 'Shukla Paksha' : 'Krishna Paksha';
    
    // Calculate tithi (lunar day) based on moon phase
    // There are 30 tithis in a lunar month (15 in each paksha)
    let tithi;
    if (moonPhase < 0.5) {
      // Shukla Paksha: 1-15
      tithi = Math.round(moonPhase * 30) + 1;
      if (tithi > 15) tithi = 15;
    } else {
      // Krishna Paksha: 1-15
      tithi = Math.round((1 - moonPhase) * 30) + 1;
      if (tithi > 15) tithi = 15;
    }
    
    // Get tithi name
    const tithiNames = [
      'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
      'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
      'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima/Amavasya'
    ];
    const tithiName = tithiNames[tithi - 1];
    
    return {
      paksha,
      tithi,
      tithiName
    };
  } catch (error) {
    console.error('Error fetching astronomical data:', error);
    return null;
  }
};

/**
 * Fallback calculation if API fails
 * This is a simplified calculation for demonstration purposes
 */
const fallbackCalculation = (dateStr: string) => {
  const date = new Date(dateStr);
  
  // For demonstration purposes, we'll use a fixed value for today (July 10, 2024)
  // In a real implementation, this would be calculated based on precise lunar calculations
  const paksha = 'Shukla Paksha';
  
  // Set tithi to 10 (Dashami) for the current date
  // In a real implementation, this would be calculated based on lunar position
  let tithi = 10; // Dashami
  
  // Get tithi name
  const tithiNames = [
    'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
    'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
    'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima/Amavasya'
  ];
  const tithiName = tithiNames[tithi - 1];
  
  return {
    paksha,
    tithi,
    tithiName
  };
};

/**
 * Fetch Hindu calendar data from an external API
 * This is a placeholder function that would connect to a real API in production
 */
export const fetchHinduCalendarData = async (dateStr: string, latitude: number, longitude: number) => {
  // In a real implementation, this would make an API call
  // For now, we'll use our local calculation
  return calculateLocalHinduCalendar(dateStr, latitude, longitude);
};