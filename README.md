# Overview

## Final Year Project Finder!
### Easily find, research and select your final year project (FYP) using our simple web application

### For Students

Take the stress out of selecting your final year project and save time by consulting our AI chatbot to find
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

To set up and run this application please complete the following steps

## Step 1: Clone the repository
Please clone the public repository found at https://github.com/FinnCummins/Group13

## Step 2: Software installation
To run our application you will require the following software:

- Python (https://www.python.org/downloads/)
- Docker (https://docs.docker.com/desktop)

Please navigate to the respective installation pages for each of the above software packages and follow the
installation instructions for your specific computer.

## Step 3: API Keys
To run this project you will need the following API Keys:

- OpenAI api key
- Pinecone api key

Once you have an api key for each service you will then need to proceed to putting them into a file called ".env.example" which is located within a folder named 'backend'. Once you have put all of the above keys inside ".env.example" please rename this file to ".env".

```bash
cp backend/.env.example backend/.env
```

Keys: [OpenAI](https://platform.openai.com/settings/organization/api-keys),
[Pinecone](https://docs.pinecone.io/guides/get-started/quickstart)

## Running the application using Docker:
## Step 4: Running the application using Docker:
To run the application using Docker, please ensure that Docker Desktop ([download here](https://www.docker.com/products/docker-desktop/)) is running on your machine. You can now run the application using docker-compose:

```bash
docker-compose up --build -d
```
Frontend: http://localhost:3000 Backend: http://localhost:5001

and to stop:
```bash
docker-compose down
```

## Step 5: View the application
Open up your web browser and navigate to http://localhost:3000. This will take you to the home 
page of our website. You can now navigate through our website, sign up for an account, add projects and even
try our website's built-in chatbot!

# Backends

## PostgreSQL Database
The postgres database for our website is now running locally within a docker container on your computer. To view
the contents of this postgres database please install pgadmin to view the contents of this local database.