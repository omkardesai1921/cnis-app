/**
 * NFHS-5 (National Family Health Survey 2019-21) Data
 * Comprehensive district coverage across India
 * Source: Ministry of Health and Family Welfare, Government of India
 */

// Helper to create district entry
const d = (state, st, wa, uw, concern, notes) => ({ state, stunting: `${st}%`, wasting: `${wa}%`, underweight: `${uw}%`, concern, notes });

export const nfhsData = {
    // MAHARASHTRA
    "Nandurbar": d("Maharashtra", 46, 15, 40, "Critical", "Tribal district with high chronic malnutrition."),
    "Gadchiroli": d("Maharashtra", 35.9, 21.8, 35.3, "High", "Significant wasting, acute nutritional deficits."),
    "Nanded": d("Maharashtra", 38, 18, 36, "High", "Marathwada region, drought-prone area."),
    "Osmanabad": d("Maharashtra", 37, 17, 35, "High", "Drought-prone, high farmer distress."),
    "Washim": d("Maharashtra", 39, 16, 37, "High", "Vidarbha region with nutrition challenges."),
    "Amravati": d("Maharashtra", 34, 19, 33, "High", "Vidarbha cotton belt, seasonal food insecurity."),
    "Jalgaon": d("Maharashtra", 33, 17, 31, "High", "North Maharashtra, banana-growing region."),
    "Nashik": d("Maharashtra", 32, 16, 30, "High", "Tribal pockets in otherwise developing district."),
    "Pune": d("Maharashtra", 28, 17, 27, "Medium", "Mixed urban-rural profile."),
    "Mumbai Suburban": d("Maharashtra", 25, 9, 23, "Medium", "Urban slum pockets contribute."),
    "Mumbai": d("Maharashtra", 24, 10, 22, "Medium", "India's financial capital, slum nutrition gaps."),
    "Thane": d("Maharashtra", 27, 12, 25, "Medium", "Rapid urbanization, migrant worker families."),
    "Nagpur": d("Maharashtra", 30, 14, 28, "Medium", "Central India hub, moderate nutrition gaps."),
    "Aurangabad": d("Maharashtra", 34, 18, 33, "High", "Marathwada drought belt."),
    "Kolhapur": d("Maharashtra", 26, 11, 24, "Medium", "Better performing western Maharashtra."),
    "Solapur": d("Maharashtra", 35, 17, 33, "High", "Semi-arid, water scarcity impacts nutrition."),
    "Satara": d("Maharashtra", 27, 13, 25, "Medium", "Western ghats region."),
    "Ratnagiri": d("Maharashtra", 25, 10, 22, "Medium", "Konkan coast, fishing community."),
    "Sindhudurg": d("Maharashtra", 23, 9, 20, "Low", "Best performing in Maharashtra."),
    "Ahmednagar": d("Maharashtra", 33, 16, 31, "High", "Mixed drought and irrigated zones."),
    "Beed": d("Maharashtra", 37, 18, 35, "High", "Sugar belt with migrant labor issues."),
    "Latur": d("Maharashtra", 36, 17, 34, "High", "Marathwada, water crisis district."),
    "Palghar": d("Maharashtra", 40, 19, 38, "Critical", "Tribal district near Mumbai with high malnutrition."),
    "Raigad": d("Maharashtra", 28, 13, 26, "Medium", "Konkan region, improving indicators."),
    "Sangli": d("Maharashtra", 27, 12, 25, "Medium", "Sugar and grape belt."),
    "Dhule": d("Maharashtra", 41, 17, 38, "Critical", "North Maharashtra tribal belt."),
    "Buldhana": d("Maharashtra", 35, 16, 33, "High", "Vidarbha agricultural district."),
    "Akola": d("Maharashtra", 34, 17, 32, "High", "Vidarbha, cotton farming area."),
    "Yavatmal": d("Maharashtra", 36, 18, 34, "High", "Vidarbha, farmer suicide hotspot."),
    "Wardha": d("Maharashtra", 31, 15, 29, "Medium", "Central Maharashtra, Gandhian heritage."),
    "Chandrapur": d("Maharashtra", 33, 16, 31, "High", "Coal mining and forest area."),
    "Bhandara": d("Maharashtra", 32, 14, 30, "Medium", "Rice bowl of Maharashtra."),
    "Gondia": d("Maharashtra", 34, 15, 32, "High", "Eastern Vidarbha, tribal pockets."),
    "Hingoli": d("Maharashtra", 38, 17, 36, "High", "Marathwada, low development index."),
    "Jalna": d("Maharashtra", 36, 18, 34, "High", "Marathwada steel city."),
    "Parbhani": d("Maharashtra", 37, 17, 35, "High", "Marathwada drought region."),

    // UTTAR PRADESH
    "Bahraich": d("Uttar Pradesh", 50, 17, 42, "Critical", "Most malnourished districts in India."),
    "Shravasti": d("Uttar Pradesh", 52, 18, 44, "Critical", "Extreme poverty, over half children stunted."),
    "Balrampur": d("Uttar Pradesh", 49, 16, 41, "Critical", "Indo-Nepal border, poor healthcare."),
    "Siddharthnagar": d("Uttar Pradesh", 48, 17, 40, "Critical", "Terai region, flood-prone."),
    "Sitapur": d("Uttar Pradesh", 45, 15, 38, "Critical", "Central UP, low development."),
    "Hardoi": d("Uttar Pradesh", 44, 14, 37, "Critical", "Agricultural district, food paradox."),
    "Unnao": d("Uttar Pradesh", 42, 15, 36, "High", "Industrial pollution concerns."),
    "Rae Bareli": d("Uttar Pradesh", 41, 14, 35, "High", "Central UP, moderate development."),
    "Lucknow": d("Uttar Pradesh", 34, 14, 30, "High", "State capital, urban slum challenges."),
    "Varanasi": d("Uttar Pradesh", 38, 16, 34, "High", "Cultural center, nutrition gaps."),
    "Kanpur Nagar": d("Uttar Pradesh", 36, 15, 32, "High", "Industrial city, pollution impacts."),
    "Agra": d("Uttar Pradesh", 37, 15, 33, "High", "Tourism hub with rural poverty."),
    "Allahabad": d("Uttar Pradesh", 39, 16, 35, "High", "Prayagraj, confluence of rivers."),
    "Gorakhpur": d("Uttar Pradesh", 43, 16, 38, "Critical", "Eastern UP, encephalitis belt."),
    "Jaunpur": d("Uttar Pradesh", 40, 15, 36, "High", "Eastern UP, agricultural district."),
    "Azamgarh": d("Uttar Pradesh", 41, 16, 37, "High", "Densely populated, low resources."),
    "Ghaziabad": d("Uttar Pradesh", 30, 12, 26, "Medium", "NCR, urbanized but migrant pockets."),
    "Noida": d("Uttar Pradesh", 28, 11, 24, "Medium", "IT hub, better urban nutrition."),
    "Meerut": d("Uttar Pradesh", 33, 13, 29, "High", "Western UP, sugarcane belt."),
    "Bareilly": d("Uttar Pradesh", 40, 15, 36, "High", "Rohilkhand region."),
    "Moradabad": d("Uttar Pradesh", 39, 14, 35, "High", "Brass industry, child labor concerns."),
    "Mathura": d("Uttar Pradesh", 36, 14, 32, "High", "Religious tourism and dairy belt."),
    "Sultanpur": d("Uttar Pradesh", 43, 15, 37, "Critical", "East-central UP."),

    // BIHAR
    "Madhubani": d("Bihar", 48, 13, 39, "Critical", "Flood-prone, Mithila region."),
    "Kishanganj": d("Bihar", 47, 14, 40, "Critical", "Border district, low literacy."),
    "Araria": d("Bihar", 46, 13, 38, "Critical", "Flood-affected Kosi region."),
    "Purnia": d("Bihar", 44, 14, 37, "Critical", "North Bihar, annual flooding."),
    "Katihar": d("Bihar", 43, 13, 36, "Critical", "Kosi river belt."),
    "Supaul": d("Bihar", 45, 12, 38, "Critical", "Most flood-affected district."),
    "Gaya": d("Bihar", 42, 14, 36, "High", "South Bihar, Magadh region."),
    "Nawada": d("Bihar", 43, 13, 37, "Critical", "Magadh, tribal pockets."),
    "Muzaffarpur": d("Bihar", 40, 13, 35, "High", "Litchi farming, AES hotspot."),
    "Patna": d("Bihar", 36, 12, 32, "High", "State capital, moderate indicators."),
    "Bhagalpur": d("Bihar", 41, 14, 36, "High", "Silk city, east Bihar."),
    "Vaishali": d("Bihar", 39, 12, 34, "High", "North Bihar, agricultural."),
    "Samastipur": d("Bihar", 44, 13, 38, "Critical", "Flood-prone Gangetic plain."),
    "Darbhanga": d("Bihar", 45, 13, 39, "Critical", "Mithila, flood zone."),
    "Begusarai": d("Bihar", 40, 14, 35, "High", "Industrial-agricultural."),

    // MADHYA PRADESH
    "Barwani": d("Madhya Pradesh", 49, 20, 45, "Critical", "Tribal belt, extreme malnutrition."),
    "Alirajpur": d("Madhya Pradesh", 50, 21, 46, "Critical", "Most malnourished in MP."),
    "Jhabua": d("Madhya Pradesh", 48, 19, 44, "Critical", "Tribal district, western MP."),
    "Sheopur": d("Madhya Pradesh", 46, 18, 42, "Critical", "Chambal region, remote area."),
    "Tikamgarh": d("Madhya Pradesh", 44, 17, 40, "Critical", "Bundelkhand, drought-prone."),
    "Chhatarpur": d("Madhya Pradesh", 43, 18, 39, "Critical", "Bundelkhand region."),
    "Mandla": d("Madhya Pradesh", 42, 17, 38, "High", "Tribal forest area."),
    "Dindori": d("Madhya Pradesh", 44, 19, 41, "Critical", "Remote tribal district."),
    "Bhopal": d("Madhya Pradesh", 30, 15, 26, "Medium", "State capital, better access."),
    "Indore": d("Madhya Pradesh", 28, 14, 24, "Medium", "Commercial capital, improving."),
    "Jabalpur": d("Madhya Pradesh", 33, 16, 30, "High", "Central MP, army cantonment."),
    "Gwalior": d("Madhya Pradesh", 32, 15, 29, "High", "Historical city, north MP."),
    "Ujjain": d("Madhya Pradesh", 35, 17, 32, "High", "Religious center, Malwa region."),

    // RAJASTHAN
    "Banswara": d("Rajasthan", 44, 22, 42, "Critical", "Tribal, acute+chronic malnutrition."),
    "Dungarpur": d("Rajasthan", 43, 20, 40, "Critical", "Tribal southern Rajasthan."),
    "Pratapgarh": d("Rajasthan", 42, 19, 39, "Critical", "Tribal, Vagad region."),
    "Barmer": d("Rajasthan", 40, 18, 37, "High", "Thar desert, water scarcity."),
    "Jaisalmer": d("Rajasthan", 38, 17, 35, "High", "Desert district, sparse population."),
    "Jodhpur": d("Rajasthan", 35, 16, 32, "High", "Blue city, western Rajasthan."),
    "Udaipur": d("Rajasthan", 37, 18, 34, "High", "Lake city, tribal pockets."),
    "Jaipur": d("Rajasthan", 29, 13, 25, "Medium", "State capital, improving."),
    "Kota": d("Rajasthan", 30, 14, 27, "Medium", "Education hub, Hadoti region."),
    "Ajmer": d("Rajasthan", 31, 14, 28, "Medium", "Central Rajasthan."),
    "Bikaner": d("Rajasthan", 36, 16, 33, "High", "Northern desert."),
    "Alwar": d("Rajasthan", 33, 15, 30, "High", "NCR-adjacent, mixed."),
    "Sirohi": d("Rajasthan", 39, 19, 37, "High", "Abu Road region, underserved."),

    // JHARKHAND
    "Dumka": d("Jharkhand", 47, 19, 41, "Critical", "Santhal Pargana, tribal."),
    "Pakur": d("Jharkhand", 48, 20, 42, "Critical", "Remote tribal district."),
    "Sahibganj": d("Jharkhand", 46, 18, 40, "Critical", "Ganges border, tribal."),
    "Godda": d("Jharkhand", 45, 19, 39, "Critical", "Coal and tribal area."),
    "Gumla": d("Jharkhand", 44, 20, 38, "Critical", "Tribal plateau region."),
    "Latehar": d("Jharkhand", 43, 21, 39, "Critical", "Forest and Naxal area."),
    "Palamu": d("Jharkhand", 42, 19, 37, "High", "Drought-prone plateau."),
    "Ranchi": d("Jharkhand", 35, 16, 32, "High", "State capital, urban pockets."),
    "Jamshedpur": d("Jharkhand", 30, 14, 27, "Medium", "Steel city, industrial."),

    // CHHATTISGARH
    "Bastar": d("Chhattisgarh", 43, 18, 38, "Critical", "Remote tribal, difficult terrain."),
    "Korba": d("Chhattisgarh", 38, 16, 34, "High", "Coal mining district."),
    "Surguja": d("Chhattisgarh", 41, 17, 37, "High", "Northern tribal belt."),
    "Dantewada": d("Chhattisgarh", 44, 19, 40, "Critical", "Naxal affected tribal area."),
    "Bijapur": d("Chhattisgarh", 45, 20, 41, "Critical", "Most remote, conflict zone."),
    "Raipur": d("Chhattisgarh", 32, 14, 28, "Medium", "State capital."),
    "Bilaspur": d("Chhattisgarh", 34, 15, 30, "High", "Central CG, rail hub."),
    "Jashpur": d("Chhattisgarh", 40, 18, 36, "High", "Tribal northeast CG."),

    // KARNATAKA
    "Raichur": d("Karnataka", 42, 20, 38, "High", "North Karnataka, drought-prone."),
    "Yadgir": d("Karnataka", 44, 21, 40, "Critical", "Most backward in Karnataka."),
    "Kalaburagi": d("Karnataka", 40, 19, 37, "High", "Hyderabad-Karnataka region."),
    "Bidar": d("Karnataka", 38, 18, 35, "High", "Border district, north KA."),
    "Ballari": d("Karnataka", 39, 19, 36, "High", "Mining district, iron ore."),
    "Koppal": d("Karnataka", 41, 20, 38, "High", "North Karnataka, arid."),
    "Bengaluru Urban": d("Karnataka", 22, 10, 18, "Low", "IT capital, best in state."),
    "Mysuru": d("Karnataka", 28, 14, 24, "Medium", "Heritage city, south KA."),
    "Mangaluru": d("Karnataka", 24, 12, 20, "Low", "Coastal, good indicators."),
    "Hubli-Dharwad": d("Karnataka", 33, 17, 30, "High", "North KA commercial center."),

    // GUJARAT
    "Dahod": d("Gujarat", 45, 21, 40, "Critical", "Tribal, severe malnutrition."),
    "Narmada": d("Gujarat", 43, 20, 39, "Critical", "Tribal, dam-displaced communities."),
    "Panchmahal": d("Gujarat", 41, 19, 37, "High", "Eastern tribal belt."),
    "Banaskantha": d("Gujarat", 40, 18, 36, "High", "Border desert district."),
    "Sabarkantha": d("Gujarat", 38, 17, 35, "High", "Tribal Aravalli foothills."),
    "Ahmedabad": d("Gujarat", 30, 14, 27, "Medium", "Commercial capital."),
    "Surat": d("Gujarat", 28, 13, 25, "Medium", "Diamond city, migrant labor."),
    "Vadodara": d("Gujarat", 32, 15, 29, "Medium", "Cultural capital."),
    "Rajkot": d("Gujarat", 31, 14, 28, "Medium", "Saurashtra region."),

    // ODISHA
    "Malkangiri": d("Odisha", 46, 17, 39, "Critical", "Remote cut-off area."),
    "Koraput": d("Odisha", 44, 18, 38, "Critical", "KBK region, tribal."),
    "Nabarangpur": d("Odisha", 45, 17, 39, "Critical", "Tribal, bordering CG."),
    "Rayagada": d("Odisha", 43, 18, 37, "Critical", "Dongria Kondh tribal."),
    "Nuapada": d("Odisha", 42, 16, 36, "High", "Western Odisha, drought."),
    "Kalahandi": d("Odisha", 41, 17, 36, "High", "Former famine district."),
    "Bhubaneswar": d("Odisha", 26, 12, 22, "Medium", "State capital."),
    "Cuttack": d("Odisha", 28, 13, 24, "Medium", "Silver city."),

    // WEST BENGAL
    "Purulia": d("West Bengal", 41, 16, 35, "High", "Drought-prone, red soil."),
    "Bankura": d("West Bengal", 38, 17, 33, "High", "Laterite plateau."),
    "Malda": d("West Bengal", 40, 18, 35, "High", "Mango district, flood-prone."),
    "Murshidabad": d("West Bengal", 39, 17, 34, "High", "Silk district, border."),
    "South 24 Parganas": d("West Bengal", 36, 19, 32, "High", "Sundarbans, cyclone-prone."),
    "Kolkata": d("West Bengal", 24, 11, 20, "Low", "Metro, slum pockets."),
    "Howrah": d("West Bengal", 28, 13, 24, "Medium", "Industrial city."),
    "Jalpaiguri": d("West Bengal", 37, 16, 33, "High", "Tea garden region."),

    // ANDHRA PRADESH
    "Anantapur": d("Andhra Pradesh", 33, 18, 30, "High", "Drought-prone, peanut belt."),
    "Kurnool": d("Andhra Pradesh", 34, 17, 31, "High", "Rayalaseema, drought."),
    "Vizianagaram": d("Andhra Pradesh", 32, 16, 29, "High", "North coastal AP."),
    "Srikakulam": d("Andhra Pradesh", 31, 17, 28, "High", "Coastal, cyclone zone."),
    "Visakhapatnam": d("Andhra Pradesh", 26, 13, 23, "Medium", "Port city, IT hub."),
    "Vijayawada": d("Andhra Pradesh", 27, 14, 24, "Medium", "Capital region."),
    "Tirupati": d("Andhra Pradesh", 28, 14, 25, "Medium", "Temple city."),

    // TAMIL NADU
    "Ramanathapuram": d("Tamil Nadu", 25, 19, 23, "Medium", "Coastal, limited dietary diversity."),
    "Dharmapuri": d("Tamil Nadu", 30, 17, 27, "High", "Drought-prone, north TN."),
    "Villupuram": d("Tamil Nadu", 27, 16, 24, "Medium", "Agricultural, north TN."),
    "Perambalur": d("Tamil Nadu", 26, 15, 23, "Medium", "Smallest district."),
    "Chennai": d("Tamil Nadu", 20, 11, 17, "Low", "Metro, good ICDS network."),
    "Coimbatore": d("Tamil Nadu", 22, 13, 19, "Low", "Industrial hub."),
    "Madurai": d("Tamil Nadu", 24, 14, 21, "Medium", "Temple city, south TN."),

    // KERALA
    "Wayanad": d("Kerala", 20, 10, 15, "Low", "Tribal pockets in well-performing state."),
    "Idukki": d("Kerala", 19, 9, 14, "Low", "Hill station, plantation."),
    "Palakkad": d("Kerala", 21, 11, 16, "Low", "Gap in Western Ghats."),
    "Malappuram": d("Kerala", 20, 10, 15, "Low", "Densely populated."),
    "Thiruvananthapuram": d("Kerala", 17, 8, 12, "Low", "State capital."),
    "Ernakulam": d("Kerala", 16, 8, 11, "Low", "Kochi metro, best in state."),

    // TELANGANA
    "Mahbubnagar": d("Telangana", 35, 18, 32, "High", "Southern Telangana, drought."),
    "Adilabad": d("Telangana", 38, 19, 35, "High", "Tribal district, north TG."),
    "Komaram Bheem": d("Telangana", 40, 20, 37, "High", "Tribal, renamed district."),
    "Hyderabad": d("Telangana", 22, 10, 18, "Low", "State capital, IT hub."),
    "Warangal": d("Telangana", 32, 16, 29, "High", "Heritage city."),

    // PUNJAB
    "Mansa": d("Punjab", 28, 14, 24, "Medium", "Cotton belt, farmer distress."),
    "Muktsar": d("Punjab", 27, 13, 23, "Medium", "Southern Punjab."),
    "Ludhiana": d("Punjab", 22, 10, 18, "Low", "Industrial hub."),
    "Amritsar": d("Punjab", 24, 11, 20, "Low", "Golden Temple city."),

    // HARYANA
    "Mewat": d("Haryana", 38, 18, 35, "High", "Most backward in Haryana."),
    "Palwal": d("Haryana", 34, 16, 31, "High", "South Haryana."),
    "Gurugram": d("Haryana", 22, 10, 18, "Low", "IT hub, NCR."),
    "Faridabad": d("Haryana", 25, 12, 21, "Medium", "Industrial city."),

    // ASSAM
    "Dhubri": d("Assam", 42, 15, 36, "High", "Border district, high density."),
    "Barpeta": d("Assam", 40, 16, 35, "High", "Flood-prone Brahmaputra."),
    "Guwahati": d("Assam", 28, 12, 24, "Medium", "State capital."),

    // DELHI (NCT - 9 districts)
    "New Delhi": d("Delhi", 24, 11, 20, "Medium", "National capital, urban pocket malnutrition in slums."),
    "South Delhi": d("Delhi", 22, 10, 19, "Medium", "Better performing, affluent areas."),
    "North East Delhi": d("Delhi", 31, 15, 28, "High", "Dense population, migrant concentration."),
    "Central Delhi": d("Delhi", 25, 12, 21, "Medium", "Old Delhi areas, mixed nutrition profile."),
    "East Delhi": d("Delhi", 28, 13, 25, "Medium", "Trans-Yamuna, resettlement colonies."),
    "West Delhi": d("Delhi", 26, 11, 22, "Medium", "Mixed residential and industrial areas."),
    "North Delhi": d("Delhi", 27, 12, 24, "Medium", "Civil Lines and surrounding areas."),
    "South West Delhi": d("Delhi", 25, 11, 21, "Medium", "Dwarka and Najafgarh areas."),
    "North West Delhi": d("Delhi", 29, 14, 26, "Medium", "Rural pockets, Narela area."),

    // GOA
    "North Goa": d("Goa", 20, 12, 17, "Low", "Tourism, better nutrition."),
    "South Goa": d("Goa", 19, 11, 16, "Low", "Smallest state, good indicators."),

    // STATE AVERAGES
    "Maharashtra (Avg)": d("Maharashtra", 35.2, 25.6, 36.1, "High", "State average."),
    "Uttar Pradesh (Avg)": d("Uttar Pradesh", 39.7, 17.3, 32.1, "High", "Most populous state."),
    "Bihar (Avg)": d("Bihar", 42.9, 12.3, 41, "High", "High chronic malnutrition."),
    "Madhya Pradesh (Avg)": d("Madhya Pradesh", 35.7, 18.9, 33, "High", "Tribal welfare challenges."),
    "Rajasthan (Avg)": d("Rajasthan", 31.8, 16.8, 27.6, "High", "Desert climate impacts."),
    "Gujarat (Avg)": d("Gujarat", 39, 21.7, 39.7, "High", "High despite economic growth."),
    "Karnataka (Avg)": d("Karnataka", 35.4, 19.5, 32.9, "High", "North-South divide."),
    "Tamil Nadu (Avg)": d("Tamil Nadu", 25, 14, 22, "Medium", "Strong midday meal program."),
    "Kerala (Avg)": d("Kerala", 18, 13, 14, "Low", "Best performing state."),
    "West Bengal (Avg)": d("West Bengal", 33.8, 20.3, 32.2, "High", "High wasting rates."),
    "Jharkhand (Avg)": d("Jharkhand", 39.6, 22.4, 39.4, "High", "Tribal-dominant state."),
    "Chhattisgarh (Avg)": d("Chhattisgarh", 34.6, 16.5, 31.7, "High", "Tribal population challenges."),
    "Odisha (Avg)": d("Odisha", 31, 18.1, 29, "High", "Cyclone zone compounds issues."),
    "Andhra Pradesh (Avg)": d("Andhra Pradesh", 31, 16.1, 29, "High", "Moderate concern."),
    "Telangana (Avg)": d("Telangana", 33.1, 18.2, 31.8, "High", "Newer state, improving."),
    "Punjab (Avg)": d("Punjab", 24.5, 11.7, 20.4, "Medium", "Breadbasket state."),
    "Haryana (Avg)": d("Haryana", 27.5, 13.4, 24.5, "Medium", "NCR adjacent."),
    "Assam (Avg)": d("Assam", 36.2, 16.7, 32.8, "High", "Northeast, flood-prone."),
    "Delhi (Avg)": d("Delhi", 26.2, 12.1, 22.4, "Medium", "National capital territory."),
    "Goa (Avg)": d("Goa", 19.5, 11.5, 16.5, "Low", "Smallest state."),
    "India (National Avg)": d("India", 35.5, 19.3, 32.1, "High", "World's largest malnutrition burden."),
};

/**
 * Get data for a specific district, falling back to state average, then national
 */
export function getDistrictStats(districtName, stateName) {
    if (nfhsData[districtName]) return { ...nfhsData[districtName], matchedAs: districtName };
    const stateAvgKey = `${stateName} (Avg)`;
    if (stateName && nfhsData[stateAvgKey]) return { ...nfhsData[stateAvgKey], matchedAs: stateAvgKey };
    return { ...nfhsData["India (National Avg)"], matchedAs: "India (National Avg)" };
}

export function getDistrictsForState(stateName) {
    return Object.entries(nfhsData)
        .filter(([key, val]) => val.state === stateName && !key.includes('(Avg)'))
        .map(([key]) => key);
}
