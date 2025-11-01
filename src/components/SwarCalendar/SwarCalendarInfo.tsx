import React from 'react';
import { Info, Sun, Moon, Calendar } from 'lucide-react';

const SwarCalendarInfo: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-8">
      <div className="flex items-center space-x-2 mb-6">
        <Info className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">About Swar Calendar</h2>
      </div>
      
      <div className="space-y-6">
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
            <Moon className="w-5 h-5 mr-2 flex-shrink-0" />
            What is the Swar Calendar?
          </h3>
          <p className="text-blue-700">
            The Swar Calendar is based on ancient Hindu astronomical calculations that determine the flow of energy in the body. 
            It helps practitioners of Swar Yoga understand the alternating patterns of solar and lunar energy (Surya Nadi and Chandra Nadi) 
            based on the lunar cycle (Paksha) and lunar day (Tithi).
          </p>
        </div>
        
        <div className="bg-green-50 p-6 rounded-xl border border-green-200">
          <h3 className="text-lg font-semibold text-green-800 mb-3">How to Use the Swar Calendar</h3>
          <ol className="list-decimal list-inside space-y-2 text-green-700">
            <li>
              <span className="font-medium">Select your location</span>: Choose your country, state, and city to get accurate calculations based on your geographic coordinates.
            </li>
            <li>
              <span className="font-medium">Choose a date</span>: Select any date to calculate the Hindu calendar details for that specific day.
            </li>
            <li>
              <span className="font-medium">View the results</span>: See the Paksha (lunar phase), Tithi (lunar day), and most importantly, the dominant Nadi for that day.
            </li>
            <li>
              <span className="font-medium">Plan your activities</span>: Align your activities with the dominant energy - physical tasks during Surya Nadi and mental/creative tasks during Chandra Nadi.
            </li>
          </ol>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
            <h3 className="text-lg font-semibold text-yellow-800 mb-3 flex items-center">
              <Sun className="w-5 h-5 mr-2" />
              Surya Nadi (Sun Energy)
            </h3>
            <p className="text-yellow-700">
              When Surya Nadi is dominant, the right nostril is more active. This energy is associated with:
            </p>
            <ul className="list-disc list-inside mt-2 text-yellow-700 space-y-1">
              <li>Physical activity and exertion</li>
              <li>Logical thinking and analysis</li>
              <li>Heating and energizing functions</li>
              <li>Outward-focused activities</li>
            </ul>
          </div>
          
          <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-200">
            <h3 className="text-lg font-semibold text-indigo-800 mb-3 flex items-center">
              <Moon className="w-5 h-5 mr-2" />
              Chandra Nadi (Moon Energy)
            </h3>
            <p className="text-indigo-700">
              When Chandra Nadi is dominant, the left nostril is more active. This energy is associated with:
            </p>
            <ul className="list-disc list-inside mt-2 text-indigo-700 space-y-1">
              <li>Mental and emotional activities</li>
              <li>Creative thinking and intuition</li>
              <li>Cooling and calming functions</li>
              <li>Inward-focused activities</li>
            </ul>
          </div>
        </div>
        
        <div className="text-center text-gray-600 text-sm">
          <p>The Swar Calendar is a powerful tool for optimizing your daily activities according to cosmic rhythms.</p>
          <p>For more detailed guidance, consult with a Swar Yoga practitioner.</p>
        </div>
      </div>
    </div>
  );
};

export default SwarCalendarInfo;