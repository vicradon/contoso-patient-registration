# Contoso Health App

## How to use
Copy the contents of .env.example to a file .env.local using the command below

```
cp .env.example .env.local
```

You'll require Node.js to run this project. Install the latest LTS version [Node.js](https://nodejs.org) from the website if you're on Windows or use [NVM](https://github.com/nvm-sh/nvm) if you're on macOS or Linux.

After installing Node.js, run the `npm install` command to install dependencies.

```
npm install
```

Then go to your form recognizer resource on Azure and copy your API Key and API endpoint. Put those values in your .env.local file. Your file should look like this now:

```
MODEL_ID=
FORM_RECOGNIZER_ENDPOINT=https://<region>.api.cognitive.microsoft.com/
FORM_RECOGNIZER_API_KEY=3c4e948247xxxxxxxxxxxxxxxxxxxxxx
```

Then go to the form recognizer studio and get your model ID. The model ID is the text that shows up above the 'Label Data' tab on your model page.

After inputing the model ID, your .env.local file should look like the one below:

```
MODEL_ID=patient-form-recognizer
FORM_RECOGNIZER_ENDPOINT=https://<region>.api.cognitive.microsoft.com/
FORM_RECOGNIZER_API_KEY=3c4e948247xxxxxxxxxxxxxxxxxxxxxx
```

You can now run the project using the command below:

```
npm run dev
```

Your project should be running on http://localhost:3004