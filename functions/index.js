
const functions = require("firebase-functions");
const { Client } = require("@gradio/client");
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');

// Your Google Cloud Project ID. Find this in your Firebase project settings.
const PROJECT_ID = "nakshatra-narratives"; 

// Helper function to get the secret token securely
async function getHfToken() {
    const client = new SecretManagerServiceClient();
    const name = `projects/${PROJECT_ID}/secrets/HF_TOKEN/versions/latest`;
    const [version] = await client.accessSecretVersion({ name });
    return version.payload.data.toString("utf8");
}

exports.generateNarration = functions
    .runWith({ 
        timeoutSeconds: 300, // Allow up to 5 minutes to run
        memory: "1GB"        // Allocate 1GB of memory
    })
    .https.onCall(async (data, context) => {
    const text_input = data.text_to_speak;
    if (!text_input) {
        throw new functions.https.HttpsError('invalid-argument', 'The function must be called with "text_to_speak".');
    }

    try {
        const hf_token = await getHfToken();
        const gradioClient = await Client.connect("nari-labs/Dia-1.6B", { hf_token });
        
        const result = await gradioClient.predict("/generate_audio", {
            text_input: `[S1] ${text_input}`,
            audio_prompt_input: null, // Required by API, pass null for no prompt
            transcription_input: "", // Required by API, pass empty string
            temperature: 1.8,
            speed_factor: 1,
            cfg_scale: 3, 
        });

        // The result contains the URL of the generated audio file.
        // We return this URL to the front-end.
        const audioUrl = result.data[0].url;
        return { audioUrl: audioUrl };

    } catch (error) {
        console.error("Error calling Hugging Face API:", error);
        throw new functions.https.HttpsError('internal', 'Failed to generate audio.', error.message);
    }
});
