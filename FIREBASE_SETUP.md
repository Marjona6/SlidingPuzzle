# Firebase Setup Guide

## Important Security Notice

⚠️ **Never commit real API keys to your repository!** The `google-services.json` file contains sensitive information and should be kept private.

## Setup Instructions

1. **Create a Firebase Project**

   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or select an existing one

2. **Add Android App**

   - In your Firebase project, click "Add app" and select Android
   - Use package name: `com.anonymous.SlidingPuzzle`
   - Download the `google-services.json` file

3. **Configure the App**

   - Copy the downloaded `google-services.json` to `android/app/`
   - Replace the placeholder values in the file with your actual Firebase configuration

4. **For iOS (if needed)**
   - Add an iOS app to your Firebase project
   - Download `GoogleService-Info.plist`
   - Add it to your iOS project

## File Structure

```
android/app/
├── google-services.json          # Your actual Firebase config (not committed)
└── google-services.json.template # Template showing required structure
```

## Security Best Practices

- ✅ Keep `google-services.json` in `.gitignore`
- ✅ Use environment variables for sensitive data
- ✅ Never commit API keys or secrets
- ✅ Use Firebase App Check for additional security

## Troubleshooting

If you see Firebase initialization errors, make sure:

1. `google-services.json` is in the correct location
2. All required fields are filled with real values
3. The package name matches your app's package name
4. Firebase project is properly configured
