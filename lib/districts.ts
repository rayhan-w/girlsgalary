export interface District {
  name: string;
  bn: string;
  zone: 'inside_dhaka' | 'near_dhaka' | 'outside_dhaka';
}

export const BANGLADESH_DISTRICTS: District[] = [
  // Saidpur & Nilphamari (Local Delivery Zone - ৳70)
  { name: 'Saidpur', bn: 'সৈয়দপুর', zone: 'inside_dhaka' },
  { name: 'Nilphamari', bn: 'নীলফামারী', zone: 'inside_dhaka' },

  // Near Saidpur (Rangpur Division / Sub-area - ৳100)
  { name: 'Rangpur', bn: 'রংপুর', zone: 'near_dhaka' },
  { name: 'Dinajpur', bn: 'দিনাজপুর', zone: 'near_dhaka' },

  // Metro & Nationwide (৳130)
  { name: 'Dhaka', bn: 'ঢাকা', zone: 'outside_dhaka' },
  { name: 'Gazipur', bn: 'গাজীপুর', zone: 'outside_dhaka' },
  { name: 'Narayanganj', bn: 'নারায়ণগঞ্জ', zone: 'outside_dhaka' },
  { name: 'Munshiganj', bn: 'মুন্সীগঞ্জ', zone: 'outside_dhaka' },
  { name: 'Manikganj', bn: 'মানিকগঞ্জ', zone: 'outside_dhaka' },
  { name: 'Narsingdi', bn: 'নরসিংদী', zone: 'outside_dhaka' },

  // Outside Dhaka
  { name: 'Bagerhat', bn: 'বাগেরহাট', zone: 'outside_dhaka' },
  { name: 'Bandarban', bn: 'বান্দরবান', zone: 'outside_dhaka' },
  { name: 'Barguna', bn: 'বরগুনা', zone: 'outside_dhaka' },
  { name: 'Barishal', bn: 'বরিশাল', zone: 'outside_dhaka' },
  { name: 'Bhola', bn: 'ভোলা', zone: 'outside_dhaka' },
  { name: 'Bogura', bn: 'বগুড়া', zone: 'outside_dhaka' },
  { name: 'Brahmanbaria', bn: 'ব্রাহ্মণবাড়িয়া', zone: 'outside_dhaka' },
  { name: 'Chandpur', bn: 'চাঁদপুর', zone: 'outside_dhaka' },
  { name: 'Chattogram', bn: 'চট্টগ্রাম', zone: 'outside_dhaka' },
  { name: 'Chuadanga', bn: 'চুয়াডাঙ্গা', zone: 'outside_dhaka' },
  { name: 'Cox\'s Bazar', bn: 'কক্সবাজার', zone: 'outside_dhaka' },
  { name: 'Cumilla', bn: 'কুমিল্লা', zone: 'outside_dhaka' },
  { name: 'Dinajpur', bn: 'দিনাজপুর', zone: 'outside_dhaka' },
  { name: 'Faridpur', bn: 'ফরিদপুর', zone: 'outside_dhaka' },
  { name: 'Feni', bn: 'ফেনী', zone: 'outside_dhaka' },
  { name: 'Gaibandha', bn: 'গাইবান্ধা', zone: 'outside_dhaka' },
  { name: 'Gopalganj', bn: 'গোপালগঞ্জ', zone: 'outside_dhaka' },
  { name: 'Habiganj', bn: 'হবিগঞ্জ', zone: 'outside_dhaka' },
  { name: 'Jamalpur', bn: 'জামালপুর', zone: 'outside_dhaka' },
  { name: 'Jashore', bn: 'যশোর', zone: 'outside_dhaka' },
  { name: 'Jhalokathi', bn: 'ঝালকাঠি', zone: 'outside_dhaka' },
  { name: 'Jhenaidah', bn: 'ঝিনাইদহ', zone: 'outside_dhaka' },
  { name: 'Joypurhat', bn: 'জয়পুরহাট', zone: 'outside_dhaka' },
  { name: 'Khagrachhari', bn: 'খাগড়াছড়ি', zone: 'outside_dhaka' },
  { name: 'Khulna', bn: 'খুলনা', zone: 'outside_dhaka' },
  { name: 'Kishoreganj', bn: 'কিশোরগঞ্জ', zone: 'outside_dhaka' },
  { name: 'Kurigram', bn: 'কুড়িগ্রাম', zone: 'outside_dhaka' },
  { name: 'Kushtia', bn: 'কুষ্টিয়া', zone: 'outside_dhaka' },
  { name: 'Lakshmipur', bn: 'লক্ষ্মীপুর', zone: 'outside_dhaka' },
  { name: 'Lalmonirhat', bn: 'লালমনিরহাট', zone: 'outside_dhaka' },
  { name: 'Madaripur', bn: 'মাদারীপুর', zone: 'outside_dhaka' },
  { name: 'Magura', bn: 'মাগুরা', zone: 'outside_dhaka' },
  { name: 'Meherpur', bn: 'মেহেরপুর', zone: 'outside_dhaka' },
  { name: 'Moulvibazar', bn: 'মৌলভীবাজার', zone: 'outside_dhaka' },
  { name: 'Mymensingh', bn: 'ময়মনসিংহ', zone: 'outside_dhaka' },
  { name: 'Naogaon', bn: 'নওগাঁ', zone: 'outside_dhaka' },
  { name: 'Narail', bn: 'নড়াইল', zone: 'outside_dhaka' },
  { name: 'Natore', bn: 'নাটোর', zone: 'outside_dhaka' },
  { name: 'Netrokona', bn: 'নেত্রকোণা', zone: 'outside_dhaka' },
  { name: 'Noakhali', bn: 'নোয়াখালী', zone: 'outside_dhaka' },
  { name: 'Pabna', bn: 'পাবনা', zone: 'outside_dhaka' },
  { name: 'Panchagarh', bn: 'পঞ্চগড়', zone: 'outside_dhaka' },
  { name: 'Patuakhali', bn: 'পটুয়াখালী', zone: 'outside_dhaka' },
  { name: 'Pirojpur', bn: 'পিরোজপুর', zone: 'outside_dhaka' },
  { name: 'Rajbari', bn: 'রাজবাড়ী', zone: 'outside_dhaka' },
  { name: 'Rajshahi', bn: 'রাজশাহী', zone: 'outside_dhaka' },
  { name: 'Rangamati', bn: 'রাঙ্গামাটি', zone: 'outside_dhaka' },
  { name: 'Satkhira', bn: 'সাতক্ষীরা', zone: 'outside_dhaka' },
  { name: 'Shariatpur', bn: 'শরীয়তপুর', zone: 'outside_dhaka' },
  { name: 'Sherpur', bn: 'শেরপুর', zone: 'outside_dhaka' },
  { name: 'Sirajganj', bn: 'সিরাজগঞ্জ', zone: 'outside_dhaka' },
  { name: 'Sunamganj', bn: 'সুনামগঞ্জ', zone: 'outside_dhaka' },
  { name: 'Sylhet', bn: 'সিলেট', zone: 'outside_dhaka' },
  { name: 'Tangail', bn: 'টাঙ্গাইল', zone: 'outside_dhaka' },
  { name: 'Thakurgaon', bn: 'ঠাকুরগাঁও', zone: 'outside_dhaka' }
];

export function getZoneForDistrict(districtName: string): 'inside_dhaka' | 'near_dhaka' | 'outside_dhaka' {
  const d = BANGLADESH_DISTRICTS.find(
    (item) => item.name.toLowerCase() === districtName.toLowerCase() || item.bn === districtName
  );
  return d ? d.zone : 'outside_dhaka';
}
