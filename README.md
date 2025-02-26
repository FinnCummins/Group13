# Overview

## Final Year Project Finder!
### Easily find, research and select your final year project (FYP) using our simple web application

### For Students

Take the stress out of selecting your final year project and save time by consulting our AI chatbot, which interfaces with OpenAI's LLM and a vector database, to find
your perfect project!

When you create an account on our web application you will be asked to insert your core research interests.

You can then use the internal chatbot inside our web application who is aware of your interests and will help you find 
a project that aligns with your interests.

You will find a list of available projects inside the web application which you can filter based on availability, keywords
and supervisor.

### For Supervisors

When a supervisor creates an account on our website they can specify their research interests which will
enable students who share their research interests to find their projects more easily.

As a supervisor you have the ability to easily upload project ideas and descriptions to our website. When
you have agreed to accept a particular student, you can then toggle the tag of your project to "Taken" which will notify other students that this project is no longer available.

# Set-Up Instructions

## Step 1: Clone the repository
Clone the public repository found at https://github.com/FinnCummins/Group13

## Step 2: Software installation
Download the following software if not already installed:

- [Python](https://www.python.org/downloads/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

## Step 3: API Keys
Generate the following API Keys:

- [OpenAI API Key](https://platform.openai.com/settings/organization/api-keys)
- [Pinecone API Key](https://docs.pinecone.io/guides/get-started/quickstart)

Run this command to create an `.env` file. Replace the placeholders with the API keys (no quotation marks).
```bash
cp backend/.env.example backend/.env
```

## Step 4: Running the application using Docker:
Ensure that Docker Desktop is running on your machine. Run the application using docker-compose:

```bash
docker compose up --build -d
```

To stop the containers:
```bash
docker compose down
```

## Step 5: View the application
Open up your web browser and navigate to http://localhost:3000. This will take you to the home 
page of our website. You can now navigate through our website, sign up for an account, add projects and even
try our website's built-in chatbot!

The backend endpoints are accessible via http://localhost:5001

# Backends

## PostgreSQL Database
The postgres database for our website is now running locally within a docker container on your computer. To view
the contents of this postgres database please install pgadmin to view its contents.

## Pinecone Vector Database
Click [here](https://app.pinecone.io/organizations/-N_KaXCftxjZei6q898g/projects/d239873b-ce31-43da-b3f3-497214979d0f/indexes/final-year-project/browser) to access the hosted vector database for this project
