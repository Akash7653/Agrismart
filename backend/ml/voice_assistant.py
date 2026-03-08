"""
Voice AI Farming Assistant
Converts speech to text, processes farmers' queries,
and returns audio responses with farming advice
Supports multiple Indian languages
"""

import os
import json
import asyncio
from datetime import datetime
import logging

# Try to import speech libraries
try:
    import speech_recognition as sr
    from pydub import AudioSegment
    TTS_AVAILABLE = True
except:
    TTS_AVAILABLE = False
    logging.warning("Speech libraries not available")

try:
    from google.cloud import texttospeech
    GOOGLE_TTS_AVAILABLE = True
except:
    GOOGLE_TTS_AVAILABLE = False

logger = logging.getLogger(__name__)

class VoiceAIAssistant:
    """
    AI-powered voice assistant for farmers
    Processes voice queries and provides audio responses
    """
    
    # Supported languages and local names
    SUPPORTED_LANGUAGES = {
        'en': {'name': 'English', 'code': 'en-IN'},
        'hi': {'name': 'Hindi', 'code': 'hi-IN'},
        'te': {'name': 'Telugu', 'code': 'te-IN'},
        'ta': {'name': 'Tamil', 'code': 'ta-IN'},
        'kn': {'name': 'Kannada', 'code': 'kn-IN'},
        'mr': {'name': 'Marathi', 'code': 'mr-IN'},
        'gu': {'name': 'Gujarati', 'code': 'gu-IN'},
        'bn': {'name': 'Bengali', 'code': 'bn-IN'},
        'pa': {'name': 'Punjabi', 'code': 'pa-IN'}
    }
    
    # Query classification patterns
    QUERY_PATTERNS = {
        'crop_prediction': {
            'triggers': ['crop', 'planting', 'suitable', 'grow', 'recommend'],
            'response_template': 'Based on current conditions, I recommend {} for your farm.'
        },
        'disease': {
            'triggers': ['disease', 'pest', 'leaf', 'blight', 'mildew', 'sick'],
            'response_template': 'The plant shows signs of {}. I recommend {}'
        },
        'weather': {
            'triggers': ['weather', 'rain', 'temperature', 'humidity', 'frost', 'heat'],
            'response_template': 'According to weather data, {}. Please {}.'
        },
        'watering': {
            'triggers': ['water', 'irrigation', 'spray', 'wet', 'dry'],
            'response_template': 'For optimal growth, {}. Water scheduling should be {}.'
        },
        'fertilizer': {
            'triggers': ['fertilizer', 'nutrient', 'nitrogen', 'phosphorus', 'potassium'],
            'response_template': 'For healthy growth, apply {}. Schedule: {}.'
        },
        'market_price': {
            'triggers': ['price', 'market', 'sell', 'sell price', 'value'],
            'response_template': 'The current market price for {} is {}. {} is a good time to {}.'
        }
    }
    
    # Pre-recorded response templates
    RESPONSE_DATABASE = {
        'en': {
            'greeting': "Hello farmer! I'm your agricultural assistant. How can I help you today?",
            'crop_suggestion': "Based on your soil and weather conditions, {} would be an excellent choice.",
            'disease_alert': "I've identified {} on your plants. Apply {} treatment and ensure proper drainage.",
            'watering_advice': "Keep the soil moderately moist. Water deeply twice a week.",
            'weather_warning': "Heavy rainfall expected. Avoid pesticide application for 48 hours.",
            'market_good': "Prices are favorable. This is a good time to sell.",
            'thank_you': "Thank you for using the agricultural assistant!"
        },
        'hi': {
            'greeting': "नमस्ते किसान! मैं आपका कृषि सहायक हूं। मैं आपकी कैसे मदद कर सकता हूं?",
            'crop_suggestion': "आपकी मिट्टी और मौसम की स्थिति के अनुसार, {} एक उत्कृष्ट विकल्प होगा।",
            'disease_alert': "मैंने आपके पौधों पर {} की पहचान की है। {} उपचार लागू करें।",
            'watering_advice': "मिट्टी को नम रखें। सप्ताह में दो बार गहराई से पानी दें।",
            'weather_warning': "भारी बारिश की संभावना है। 48 घंटे के लिए कीटनाशक का छिड़काव न करें।",
            'market_good': "कीमतें अनुकूल हैं। अभी बेचने का अच्छा समय है।",
            'thank_you': "कृषि सहायक का उपयोग करने के लिए धन्यवाद!"
        },
        'te': {
            'greeting': "హలో రైతు! నేను మీ వ్యవసాయ సహాయకుడిని. నేను ఎలా సహాయ చేయగలను?",
            'crop_suggestion': "మీ నేల మరియు వాతావరణ పరిస్థితుల ఆధారంగా, {} ఒక మంచి ఎంపిక.",
            'disease_alert': "నేను మీ నిరసనలపై {} చిహ్నించాను. {} చికిత్సను వర్తించండి.",
            'watering_advice': "నేలను తేమగా ఉంచండి. వారానికి రెండుసార్లు లోతుగా నీరు ఇవ్వండి.",
            'weather_warning': "భారీ వర్షాలు expected. 48 గంటలకు కీటకनాశక వర్తించవద్దు.",
            'market_good': "ధరలు అనుకూలంగా ఉన్నాయి. ఇప్పుడు విక్రయించడం మంచి సమయం.",
            'thank_you': "వ్యవసాయ సాయకుడిని ఉపయోగించినందుకు ధన్యవాదాలు!"
        }
    }
    
    def __init__(self, language='en'):
        """Initialize voice assistant"""
        self.language = language
        self.recognizer = sr.Recognizer() if TTS_AVAILABLE else None
        self.tts_client = texttospeech.TextToSpeechClient() if GOOGLE_TTS_AVAILABLE else None
        self.conversation_history = []
        
    def transcribe_audio(self, audio_file_path):
        """
        Convert audio file to text using speech recognition
        Supports multiple languages
        """
        try:
            if not TTS_AVAILABLE:
                raise Exception("Speech recognition libraries not installed")
            
            # Load audio file
            with sr.AudioFile(audio_file_path) as source:
                audio = self.recognizer.record(source)
            
            # Recognize speech
            text = self.recognizer.recognize_google(
                audio,
                language=self.SUPPORTED_LANGUAGES[self.language]['code']
            )
            
            logger.info(f"[+] Transcribed: {text}")
            return text
        
        except sr.UnknownValueError:
            return "Sorry, I couldn't understand the audio. Please speak clearly."
        except Exception as e:
            logger.error(f"[-] Transcription error: {str(e)}")
            return None
    
    def classify_query(self, text):
        """
        Classify farmer's query to determine appropriate response
        Returns query type and confidence
        """
        text_lower = text.lower()
        scores = {}
        
        for query_type, pattern_data in self.QUERY_PATTERNS.items():
            score = 0
            for trigger in pattern_data['triggers']:
                if trigger in text_lower:
                    score += 1
            scores[query_type] = score
        
        if not any(scores.values()):
            return 'general', 0
        
        best_match = max(scores.items(), key=lambda x: x[1])
        return best_match[0], best_match[1]
    
    def generate_response(self, query_type, user_text):
        """
        Generate appropriate farming advice based on query type
        """
        responses = self.RESPONSE_DATABASE.get(self.language, self.RESPONSE_DATABASE['en'])
        
        response_map = {
            'crop_prediction': responses.get('crop_suggestion', ''),
            'disease': responses.get('disease_alert', ''),
            'weather': responses.get('weather_warning', ''),
            'watering': responses.get('watering_advice', ''),
            'fertilizer': responses.get('nutrients_advice', ''),
            'market_price': responses.get('market_good', '')
        }
        
        return response_map.get(query_type, responses.get('greeting', ''))
    
    def text_to_speech(self, text, output_file=None):
        """
        Convert text response to audio/speech
        Uses Google Cloud Text-to-Speech or pyttsx3
        """
        try:
            if GOOGLE_TTS_AVAILABLE and self.tts_client:
                # Use Google Cloud TTS
                synthesis_input = texttospeech.SynthesisInput(text=text)
                
                voice = texttospeech.VoiceSelectionParams(
                    language_code=self.SUPPORTED_LANGUAGES[self.language]['code'],
                    name=f"{self.SUPPORTED_LANGUAGES[self.language]['code']}-Standard-A"
                )
                
                audio_config = texttospeech.AudioConfig(
                    audio_encoding=texttospeech.AudioEncoding.MP3
                )
                
                response = self.tts_client.synthesize_speech(
                    input=synthesis_input,
                    voice=voice,
                    audio_config=audio_config
                )
                
                if output_file:
                    with open(output_file, "wb") as out:
                        out.write(response.audio_content)
                
                return response.audio_content
            
            else:
                # Fallback: simple local TTS using pyttsx3
                try:
                    import pyttsx3
                    engine = pyttsx3.init()
                    engine.setProperty('rate', 150)
                    
                    if output_file:
                        engine.save_to_file(text, output_file)
                    
                    engine.runAndWait()
                    return True
                except:
                    logger.warning("[-] TTS not available. Returning text only.")
                    return None
        
        except Exception as e:
            logger.error(f"[-] TTS error: {str(e)}")
            return None
    
    def process_voice_query(self, audio_file_path):
        """
        Complete pipeline: audio → text → classification → response → audio
        """
        result = {
            'success': False,
            'transcribed_text': None,
            'query_type': None,
            'response_text': None,
            'audio_response': None,
            'timestamp': datetime.now().isoformat()
        }
        
        try:
            # Step 1: Transcribe audio
            transcribed = self.transcribe_audio(audio_file_path)
            if not transcribed:
                result['response_text'] = "Couldn't transcribe audio"
                return result
            
            result['transcribed_text'] = transcribed
            
            # Step 2: Classify query
            query_type, confidence = self.classify_query(transcribed)
            result['query_type'] = query_type
            
            # Step 3: Generate response
            response_text = self.generate_response(query_type, transcribed)
            result['response_text'] = response_text
            
            # Step 4: Convert to speech
            audio_response = self.text_to_speech(response_text)
            result['audio_response'] = audio_response is not None
            
            result['success'] = True
            
        except Exception as e:
            logger.error(f"[-] Error processing query: {str(e)}")
            result['response_text'] = f"Error: {str(e)}"
        
        return result
    
    def get_supported_languages(self):
        """Get list of supported languages"""
        return self.SUPPORTED_LANGUAGES
    
    def set_language(self, language_code):
        """Change assistant language"""
        if language_code in self.SUPPORTED_LANGUAGES:
            self.language = language_code
            return True
        return False


class VoiceQueryProcessor:
    """Process voice queries with NLP and intent recognition"""
    
    def __init__(self):
        self.intents = {
            'crop_recommendation': {
                'keywords': ['crop', 'plant', 'grow', 'suitable', 'best'],
                'context': 'farmer wants crop advice'
            },
            'disease_diagnosis': {
                'keywords': ['disease', 'sick', 'problem', 'leaves', 'blight'],
                'context': 'farmer reports plant disease'
            },
            'general_farming': {
                'keywords': ['farming', 'farm', 'agriculture', 'harvest', 'season'],
                'context': 'general farming question'
            }
        }
    
    def extract_entities(self, text):
        """Extract key farming entities from text"""
        entities = {
            'crops': [],
            'diseases': [],
            'actions': [],
            'resources': []
        }
        
        crop_names = [
            'wheat', 'rice', 'tomato', 'potato', 'maize', 'cotton',
            'sugarcane', 'groundnut', 'apple', 'banana'
        ]
        
        disease_names = [
            'blight', 'rust', 'mildew', 'spot', 'rot', 'wilt'
        ]
        
        text_lower = text.lower()
        
        for crop in crop_names:
            if crop in text_lower:
                entities['crops'].append(crop)
        
        for disease in disease_names:
            if disease in text_lower:
                entities['diseases'].append(disease)
        
        return entities
    
    def prioritize_response(self, query_type, entities):
        """
        Determine response priority based on severity
        """
        priority_score = 0
        
        # Disease detection = high priority
        if 'disease_diagnosis' in query_type and entities['diseases']:
            priority_score += 10
        
        # Crop recommendation = medium priority
        elif 'crop_recommendation' in query_type:
            priority_score += 5
        
        # General farming = low priority
        else:
            priority_score += 1
        
        return priority_score


def main():
    """Test voice assistant"""
    print("=" * 60)
    print("VOICE AI FARMING ASSISTANT - DEMO")
    print("=" * 60)
    
    # Initialize assistant
    assistant = VoiceAIAssistant(language='en')
    
    print("\n[*] Supported Languages:")
    for code, lang_info in assistant.get_supported_languages().items():
        print(f"    {code}: {lang_info['name']}")
    
    # Test query classification
    print("\n[*] Testing query classification...")
    test_queries = [
        "What crops should I plant in my field?",
        "My tomato plants have brown spots",
        "Will it rain tomorrow?",
        "How much water should I give?",
        "What is the market price for wheat?"
    ]
    
    for query in test_queries:
        query_type, confidence = assistant.classify_query(query)
        response = assistant.generate_response(query_type, query)
        print(f"\n[+] Query: {query}")
        print(f"    Type: {query_type} (confidence: {confidence})")
        print(f"    Response: {response}")
    
    # Test entity extraction
    print("\n[*] Testing entity extraction...")
    processor = VoiceQueryProcessor()
    entities = processor.extract_entities("My wheat crop has rust disease")
    print(f"    Entities: {entities}")
    
    print("\n" + "=" * 60)
    print("Voice assistant demo completed")
    print("=" * 60)


if __name__ == "__main__":
    main()
