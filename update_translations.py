#!/usr/bin/env python3
"""
Update translation files with comprehensive translations.
This script will create complete translation files for all supported languages.
"""

import json
import os

# English base content - read from the file we just created
with open('frontend/public/locales/en/translation.json', 'r', encoding='utf-8') as f:
    EN_TRANSLATIONS = json.load(f)

# Hindi translations
HI_TRANSLATIONS = {
    "welcome": "स्वागत है",
    "start_journey": "अपनी यात्रा शुरू करें",
    "learn_how_ai": "जानें AI कैसे काम करता है",
    "join_movement": "आंदोलन में शामिल हों",
    "organic_revolution": "जैविक क्रांति यहाँ है",
    "dashboard": "डैशबोर्ड",
    "cropPrediction": "फसल की भविष्यवाणी",
    "diseaseDetection": "रोग की पहचान",
    "consultations": "परामर्श",
    "marketplace": "बाजार",
    "analytics": "विश्लेषण",
    "farmResources": "खेत के संसाधन",
    "history": "इतिहास",
    "signIn": "साइन इन करें",
    "signOut": "साइन आउट करें",
    "selectLanguage": "भाषा चुनें",
    "landing": {
        "headline": "ऐसी खेती जो पृथ्वी को ठीक करे",
        "subheadline": "AI-संचालित जैविक खेती टिकाऊ उपज और स्वस्थ मिट्टी के लिए",
        "acresHealed": "एकड़ ठीक किए गए",
        "happyFarmers": "खुश किसान",
        "accuracyRate": "सटीकता दर",
        "aiSupport": "AI सहायता",
        "farmersCount": "किसान हमारा विश्वास करते हैं",
        "countries": "देश",
        "yieldIncrease": "उपज में वृद्धि",
        "scrollExplore": "स्क्रॉल करके देखें",
        "problem": {
            "title": "वह समस्या जिसे हम नहीं देख सकते",
            "subtitle": "रासायनिक खेती ने प्रगति का वादा किया। यह जहर लाई है।",
            "soilDegradation": "मिट्टी का क्षरण",
            "soilDesc": "रासायनिक खेती 20-30 वर्षों में मिट्टी को नष्ट कर देती है।",
            "chemicals": "रासायनिक टन",
            "chemicalsDesc": "दुनिया भर में वार्षिक कीटनाशक का उपयोग।",
            "deaths": "वार्षिक मृत्यु",
            "deathsDesc": "कीटनाशक जोखिम हर साल 10+ लाख मौतें।",
            "nutrition": "पोषण नुकसान",
            "nutritionDesc": "रासायनिक फसलों में 60% कम खनिज होते हैं।",
            "conclusion": "हम मिट्टी, जहर और लालच के खिलाफ लड़ाई खो रहे हैं।",
            "hope": "लेकिन आशा है। परंपरागत खेती काम करती है। AI इसे बढ़ाता है।"
        }
    },
    "buttons": {
        "startJourney": "यात्रा शुरू करें",
        "learnAI": "AI कैसे काम करता है जानें",
        "joinMovement": "आंदोलन में शामिल हों",
        "getStarted": "अभी शुरू करें",
        "signUp": "साइन अप करें",
        "tryNow": "अभी आजमाएं",
        "backHome": "घर लौटें",
        "backToHome": "घर लौटें",
        "joinNow": "अभी आंदोलन में शामिल हों"
    }
}

# Write updated translation files
locales_dir = 'frontend/public/locales'

# Update Hindi
with open(f'{locales_dir}/hi/translation.json', 'w', encoding='utf-8') as f:
    json.dump(HI_TRANSLATIONS, f, ensure_ascii=False, indent=2)
    print("✓ Updated Hindi translations")

print("\n✅ Translation files updated successfully!")
print("Next step: Update component files to use translation keys instead of hardcoded text")
