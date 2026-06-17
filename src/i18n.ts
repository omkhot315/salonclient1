export type Lang = 'en' | 'mr';

const t = {
  langPrompt: {
    en: "Welcome to GlowUp Salon! 🙏✨\n\nPlease choose your preferred language:",
    mr: "GlowUp Salon मध्ये आपले स्वागत आहे! 🙏✨\n\nकृपया तुमची भाषा निवडा:",
  },
  greetings: {
    en: [
      "Hello! I'm Aria, your personal salon assistant at GlowUp! ✨",
      "I'll help you book the perfect salon experience — no forms needed!",
      "Let's start! What's your name?",
    ],
    mr: [
      "नमस्कार! मी Aria, GlowUp मधील तुमची वैयक्तिक सलून सहाय्यक आहे. ✨",
      "मी तुम्हाला परफेक्ट सलून सेवा बुक करण्यात मदत करेन — कोणतेही फॉर्म भरायची गरज नाही!",
      "चला सुरुवात करूया! 😊 तुमचे नाव काय आहे?",
    ],
  },
  nameShort: {
    en: "That seems a bit short. Could you share your full name? 😊",
    mr: "हे थोडं लहान वाटतंय. कृपया तुमचे पूर्ण नाव सांगाल का? 😊",
  },
  nameGreet: {
    en: (name: string) => `Nice to meet you, ${name}! 💫\n\nWhat services would you like today? You can select multiple! Tap to select, then press "Continue" when done:`,
    mr: (name: string) => `${name}, तुम्हाला भेटून आनंद झाला! 💫\n\nआज तुम्हाला कोणत्या सेवा हव्या आहेत? तुम्ही अनेक निवडू शकता! निवडा आणि "पुढे चला" दाबा:`,
  },
  servicesDone: {
    en: (count: number) => `Great selection — ${count} service${count > 1 ? 's' : ''}! 💎\n\nNow, who would you like as your stylist?`,
    mr: (count: number) => `छान निवड — ${count} सेवा! 💎\n\nआता, तुम्हाला कोणता स्टायलिस्ट हवा आहे?`,
  },
  stylistSelected: {
    en: (name: string) => `${name} is amazing! You're in great hands! 🙌\n\nWhen would you like to come in?`,
    mr: (name: string) => `${name} उत्कृष्ट आहे! तुम्ही चांगल्या हातांत आहात! 🙌\n\nतुम्हाला कधी यायचे आहे?`,
  },
  holidayMsg: {
    en: (name: string, date: string, reason: string) => `🏖️ Sorry! ${name} is on holiday on ${date}.${reason ? ` (${reason})` : ''}\n\nPlease pick a different date:`,
    mr: (name: string, date: string, reason: string) => `🏖️ माफ करा! ${name} ${date} रोजी सुट्टीवर आहे.${reason ? ` (${reason})` : ''}\n\nकृपया वेगळी तारीख निवडा:`,
  },
  dateSelected: {
    en: (dur: number) => `Great date! Your services need ${dur} minutes total.\nLet's pick a time that works ⏰`,
    mr: (dur: number) => `छान तारीख! तुमच्या सेवांना एकूण ${dur} मिनिटे लागतील.\nवेळ निवडूया ⏰`,
  },
  askEmail: {
    en: "Awesome! Now I need to verify your email for booking confirmation.\n\nPlease enter your email address: 📧",
    mr: "छान! आता बुकिंग पुष्टीकरणासाठी तुमचा ईमेल सत्यापित करणे आवश्यक आहे.\n\nकृपया तुमचा ईमेल पत्ता टाका: 📧",
  },
  invalidEmail: {
    en: "Hmm, that doesn't look like a valid email. Could you try again? 📧",
    mr: "हम्म, हा वैध ईमेल वाटत नाही. कृपया पुन्हा प्रयत्न कराल का? 📧",
  },
  otpSent: {
    en: (email: string) => `Great! I've sent a verification code to ${email} 📩\n\nPlease check your email and enter the 6-digit OTP:`,
    mr: (email: string) => `छान! मी ${email} वर सत्यापन कोड पाठवला आहे 📩\n\nकृपया तुमचा ईमेल तपासा आणि 6-अंकी OTP टाका:`,
  },
  otpFail: {
    en: "Failed to send OTP",
    mr: "OTP पाठवण्यात अयशस्वी",
  },
  otpVerified: {
    en: "Email verified successfully! ✅🎉\n\nNow, what's your phone number? (We'll send you a reminder)",
    mr: "ईमेल यशस्वीरित्या सत्यापित! ✅🎉\n\nआता, तुमचा फोन नंबर काय आहे? (आम्ही तुम्हाला स्मरणपत्र पाठवू)",
  },
  invalidPhone: {
    en: "Please enter a valid phone number (at least 10 digits) 📱",
    mr: "कृपया वैध फोन नंबर टाका (किमान 10 अंक) 📱",
  },
  askNotes: {
    en: "Almost done! Any special requests or notes? 📝\n\n(Type your notes or just say 'no' to skip)",
    mr: "जवळजवळ झालं! काही विशेष विनंती किंवा नोट्स? 📝\n\n(नोट्स टाइप करा किंवा वगळण्यासाठी 'no' म्हणा)",
  },
  summary: {
    en: "Perfect! Here's your booking summary. Please review and confirm: 👇",
    mr: "परफेक्ट! हा तुमचा बुकिंग सारांश आहे. कृपया तपासा आणि पुष्टी करा: 👇",
  },
  confirmed: {
    en: (emailSent: boolean) => `🎉 Your booking has been confirmed!${emailSent ? '\n\n📧 Confirmation email has been sent to your inbox!' : ''}`,
    mr: (emailSent: boolean) => `🎉 तुमचे बुकिंग पुष्टी झाले!${emailSent ? '\n\n📧 पुष्टीकरण ईमेल तुमच्या इनबॉक्समध्ये पाठवला आहे!' : ''}`,
  },
  confirmFail: {
    en: "Failed to create booking.",
    mr: "बुकिंग तयार करण्यात अयशस्वी.",
  },
  otpResent: {
    en: "New OTP sent! 📩 Check your email for the verification code.",
    mr: "नवीन OTP पाठवला! 📩 सत्यापन कोडसाठी तुमचा ईमेल तपासा.",
  },
  restart: {
    en: ["Welcome back! Let's book another appointment! ✨", "What's your name?"],
    mr: ["पुन्हा स्वागत आहे! चला आणखी एक अपॉइंटमेंट बुक करूया! ✨", "तुमचे नाव काय आहे?"],
  },
  placeholders: {
    en: { name: 'Type your name...', email: 'your@email.com', phone: '+91 98765 43210', notes: 'Any special requests? (or type "no")', default: 'Type a message...' },
    mr: { name: 'तुमचे नाव टाइप करा...', email: 'your@email.com', phone: '+91 98765 43210', notes: 'विशेष विनंती? ("no" टाइप करा वगळण्यासाठी)', default: 'संदेश टाइप करा...' },
  },
  bottomBar: {
    en: { confirmed: 'Your appointment is confirmed!', processing: 'Processing...', selectService: 'Select services above, then tap Continue', selectOption: 'Please select an option above', selectLang: 'Choose your language above' },
    mr: { confirmed: 'तुमची अपॉइंटमेंट पुष्टी झाली!', processing: 'प्रक्रिया करत आहे...', selectService: 'वरील सेवा निवडा, नंतर "पुढे चला" दाबा', selectOption: 'कृपया वरील पर्याय निवडा', selectLang: 'कृपया वरती तुमची भाषा निवडा' },
  },
  continueBtn: { en: 'Continue', mr: 'पुढे चला' },
  selectedCount: {
    en: (c: number) => `${c} service${c > 1 ? 's' : ''} selected`,
    mr: (c: number) => `${c} सेवा निवडल्या`,
  },
  bookAnother: { en: '📅 Book Another Appointment', mr: '📅 आणखी एक अपॉइंटमेंट बुक करा' },
};

export default t;
