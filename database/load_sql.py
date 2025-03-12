import os
import requests
from bs4 import BeautifulSoup
import datetime
import re
from openai import OpenAI
import ast

def call_open_ai(prompt):
    openai_api_key = os.getenv("OPENAI_API_KEY")
    client = OpenAI(openai_api_key)
    
    try:
        completion = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}]
        )
        return completion.choices[0].message.content
    except Exception as e:
        print(f"Error in OpenAI API call: {e}")
        raise

def get_html(url):
    response = requests.get(url, verify=False)
    return response.text

def parse_html(html):
    soup = BeautifulSoup(html, 'html.parser')
    links = soup.find_all('a')
    project_links = [link.get('href') for link in links if link.get('href') and '/project/' in link.get('href')]
    return list(set(project_links))

def collect_project_details(url):
    html = get_html(url)
    soup = BeautifulSoup(html, 'html.parser')
    
    project_info = {}
    
    title = soup.find('h1', class_='entry-title')
    project_info['project_title'] = title.text.strip() if title else ''
    
    content = soup.find('div', class_='entry-content')
    paragraphs = content.find_all('p') if content else []
    project_info['project_description'] = " ".join([p.text.strip() for p in paragraphs])[:2000]
    
    tags = soup.find('div', class_='tagcloud')
    project_info['keywords'] = [tag.text.strip() for tag in tags.find_all('a')] if tags else []
    
    project_info['project_status'] = 'Pending'
    
    meta = soup.find('div', class_='entry-meta')
    supervisor_name, supervisor_email = "", ""

    if meta:
        email_link = meta.find('a', href=lambda x: x and x.startswith('mailto:'))
        supervisor_email = email_link['href'].replace('mailto:', '').strip() if email_link else ''
        
        meta_text = meta.get_text(" ", strip=True)
        meta_text = re.sub(r'\d{1,2},\s\d{4}', '', meta_text).strip()
        meta_text = meta_text.split("(")[0].strip()
        
        months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        meta_text = " ".join([word for word in meta_text.split() if word not in months])
        
        name_parts = meta_text.split()
        
        if len(name_parts) >= 2:
            project_info['supervisor_first_name'] = name_parts[0]
            project_info['supervisor_last_name'] = " ".join(name_parts[1:])
        else:
            project_info['supervisor_first_name'] = name_parts[0] if name_parts else ''
            project_info['supervisor_last_name'] = ''
    
    project_info['supervisor_email'] = supervisor_email
    date_published = soup.find('time', class_='entry-date published')
    project_info['created_at'] = date_published['datetime'] if date_published else datetime.datetime.now().isoformat()
    
    prompt = f"""
        I am now going to give you a project title and project description along with a number of keywords.

        I want you to select relevant keywords from the list based on the project title/description. Please select between 3 to 7 keywords. i.e. a minimum of 3 and a maximum of 7.

        Can you also please clean up any keywords that are not capitalised? Change something like "augmented and virtual reality" to "Augmented and Virtual Reality".

        Please return this to me as a string which is a python list: ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]

        Project title: {project_info['project_title']}
        Project description: {project_info['project_description']}
        Keywords: {project_info['keywords']}

        Please do not print anything else in the response. Just that list.
    """

    response = call_open_ai(prompt)

    print(f"Project: {project_info['project_title']}")
    print(f"Project description: {project_info['project_description']}")
    print(f"Response: {response}")

    result_list = ast.literal_eval(response)

    print(f"Result list: {result_list}")
    project_info['keywords'] = result_list

    prompt = f"""
        I am now going to give you a project title and project descriptio

        I want you to read both and determine whether the project has already been taken.

        Some professors have indicated that a project has been taken by saying "This project has been taken" or maybe they input "["TAKEN"]" in the title or description.
        All professors do this in different ways so please read the project title and description carefully.

        If the project has not been taken, please return "Available". If the project has been taken, please return "Taken".

        Please return it as a string in a python list like this: ["Available"] or ["Taken"]

        Project title: {project_info['project_title']}
        Project description: {project_info['project_description']}

        Please do not print anything else in the response. Just that list with one item.
    """

    response = call_open_ai(prompt)

    print(f"Project: {project_info['project_title']}")
    print(f"Project description: {project_info['project_description']}")
    print(f"Response: {response}")

    result_list = ast.literal_eval(response)

    print(f"Result list: {result_list}")
    project_info['project_status'] = result_list[0]

    return project_info

def collect_projects():
    base_url = "https://projects.scss.tcd.ie/projects/"
    html = get_html(base_url)
    
    for i in range(1, 13):
        temp_url = f"{base_url}page/{i}/"
        html += get_html(temp_url)
    
    project_links = parse_html(html)
    
    all_projects = []
    for link in project_links:
        project_details = collect_project_details(link)
        all_projects.append(project_details)

    with open('data.sql', 'w', encoding='utf-8') as f:
        supervisors = {}
        f.write("-- SQL script to insert supervisors and projects\n")

        for project in all_projects:
            supervisor_email = project['supervisor_email']
            if supervisor_email and supervisor_email not in supervisors:
                supervisor_first_name = project['supervisor_first_name'].replace("'", "''")
                supervisor_last_name = project['supervisor_last_name'].replace("'", "''")
                email = supervisor_email.replace("'", "''")

                f.write(f"""
                INSERT INTO supervisors (first_name, last_name, email, password, interests, created_at)
                VALUES ('{supervisor_first_name}', '{supervisor_last_name}', '{email}', 'default_password', ARRAY[]::TEXT[], NOW())
                ON CONFLICT (email) DO NOTHING;
                """)
                
                supervisors[supervisor_email] = email

        for project in all_projects:
            title = project['project_title'].replace("'", "''")
            description = project['project_description'].replace("'", "''")
            keywords = "{" + ",".join(project['keywords']) + "}"
            status = project['project_status']
            supervisor_email = project['supervisor_email'].replace("'", "''")

            f.write(f"""
            INSERT INTO projects (project_title, project_description, keywords, project_status, supervisor_id, created_at)
            VALUES ('{title}', '{description}', '{keywords}', '{status}', 
            (SELECT id FROM supervisors WHERE email='{supervisor_email}'), NOW());
            """)

    print(f"Collection complete. {len(all_projects)} projects saved to data.sql")

if __name__ == "__main__":
    collect_projects()
