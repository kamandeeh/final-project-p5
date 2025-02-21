import React, { useState, useEffect } from 'react';
import { Mail, MapPin, Phone, Camera } from 'lucide-react';


const Profile = () => {
  const [profile, setProfile] = useState(null);

  
  useEffect(() => {
   
    const fetchProfileData = async () => {
      const response = await fetch('/api/profile'); 
      const data = await response.json();
      setProfile(data);
    };
    fetchProfileData();
  }, []);

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="relative h-48 bg-blue-600">
          <div className="absolute -bottom-16 left-8">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white object-cover"
              />
              <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md hover:bg-gray-100">
                <Camera className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-20 px-8 pb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{profile.full_name}</h1>
              <p className="text-gray-600">{profile.age} years old</p>
              <p className="text-gray-600">{profile.gender}</p>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Edit Profile
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <ProfileField icon={<Mail />} label="Email" value={profile.email} />
              <ProfileField icon={<Phone />} label="Phone" value={profile.phone_number} />
              <ProfileField icon={<MapPin />} label="Location" value={profile.location} />
              <ProfileField icon={<User />} label="Social Background" value={profile.social_background} />
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {/* Replace with real activity data if available */}
                <ActivityItem action="Updated" region="Kisumu County" time="2 hours ago" />
                <ActivityItem action="Added" region="Mombasa Region" time="1 day ago" />
                <ActivityItem action="Analyzed" region="Nakuru Data" time="3 days ago" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileField = ({ icon, label, value }) => (
  <div className="flex items-center space-x-3">
    <div className="text-gray-400">{icon}</div>
    <div>
      <p className="text-sm text-gray-600">{label}</p>
      <p className="text-gray-900">{value}</p>
    </div>
  </div>
);

const ActivityItem = ({ action, region, time }) => (
  <div className="flex items-center justify-between">
    <div>
      <span className="text-blue-600">{action}</span>
      <span className="text-gray-600"> {region}</span>
    </div>
    <span className="text-sm text-gray-500">{time}</span>
  </div>
);

export default Profile;
