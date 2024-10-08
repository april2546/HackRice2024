import chatWrapper
# Flask Setup: https://www.geeksforgeeks.org/flask-creating-first-simple-application/

# Importing flask module in the project is mandatory
# An object of Flask class is our WSGI application.
from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_cors import CORS
import json

# Flask constructor takes current module (__name__) as argument.
app = Flask(__name__, template_folder='hackrice14/dist')
CORS(app)
# The route() function of the Flask class is a decorator, 
# which tells the application which URL should call 
# the associated function.



# Bounding '/' URL with promptChat() function
@app.route('/', methods=['POST'])
def promptChat():
    content = request.json
    print (content)  # content is a dict with the same structure as testinput.json

    # String vars for ChatGPT prompt
    userMajor = content["major"]
    userClassesTaken = ', '.join(content["courses"])
    userYear = str(content["year"])
    poo_string = ""
    if (userMajor == "Computer Science"):
          with open('requirement_scraper/requirements/comp_requirements.txt', 'r') as file:
            poo_string = file.read()
    elif (userMajor == "Business"):
        with open('requirement_scraper/requirements/busi_requirements.txt', 'r') as file:
            poo_string = file.read()
    elif (userMajor == "Philosophy"):
        with open('requirement_scraper/requirements/phil_requirements.txt', 'r') as file:
            poo_string = file.read()

   

    chatExample = str({
    "degree_plan": {
        "Sophomore": {
            "Fall Semester": {
                "Required_Courses": [
                    {"title": "COMP 215", "credit_hours": "4"},
                    {"title": "COMP 222", "credit_hours": "4"},
                ],
                "Distribution_Courses": [
                    {"title": "Distribution Elective", "credit_hours": "3"},
                ],
                "Free_Electives": [
                    {"title": "Free Elective", "credit_hours": "3"}
                ]
            },
            "Spring Semester": {
                "Required_Courses": [
                    {"title": "COMP 312", "credit_hours": "3"},
                    {"title": "COMP 330", "credit_hours": "3"}
                ],
                "Distribution_Courses": [
                    {"title": "Distribution Elective", "credit_hours": "3"}
                ],
                "Free_Electives": [
                    {"title": "Free Elective", "credit_hours": "3"}
                ]
            }
        },
        "Junior": {
            "Fall Semester": {
                "Required_Courses": [
                    {"title": "COMP 310", "credit_hours": "4"},
                    {"title": "COMP 321", "credit_hours": "4"},
                ],
                "Distribution_Courses": [
                    {"title": "Distribution Elective", "credit_hours": "3"},
                ],
                "Free_Electives": [
                    {"title": "Free Elective", "credit_hours": "3"}
                ]
            },
            "Spring Semester": {
                "Required_Courses": [
                    {"title": "COMP 340", "credit_hours": "4"},
                    {"title": "COMP 402", "credit_hours": "4"}
                ],
                "Distribution_Courses": [
                    {"title": "Distribution Elective", "credit_hours": "3"}
                ],
                "Free_Electives": [
                    {"title": "Free Elective", "credit_hours": "3"}
                ]
            }
        },
        "Senior": {
            "Fall Semester": {
                "Required_Courses": [
                    {"title": "COMP 410", "credit_hours": "4"},
                    {"title": "COMP 411", "credit_hours": "4"},
                ],
                "Distribution_Courses": [
                    {"title": "Distribution Elective", "credit_hours": "3"},
                ],
                "Free_Electives": [
                    {"title": "Free Elective", "credit_hours": "3"}
                ]
            },
            "Spring Semester": {
                "Required_Courses": [
                    {"title": "COMP 415", "credit_hours": "4"},
                    {"title": "COMP 460", "credit_hours": "4"}
                ],
                "Distribution_Courses": [
                    {"title": "Distribution Elective", "credit_hours": "3"}
                ],
                "Free_Electives": [
                    {"title": "Free Elective", "credit_hours": "3"}
                ]
            }
        }
    }
    })
    # print (chatExample)


    # ChatGPT Prompt
    chatPrompt = f"Make a 4 year degree plan for a Rice  {userMajor}  major distribution courses and free electives for each year. \
        For the Required_Courses, use this list of courses {poo_string} \
        as valid major requirements to complete the 4-year degreee. \
        Here is an example of a correct plan: {chatExample} \
        Courses should be formatted as JSON objects with the keynames: \
        title and credit_hours.   \
        Student will be in year  {userYear}  next school year, and has already completed \
        the following courses:  {userClassesTaken} . \
        The freshman year should always contain a single FWIS class. \
        The minimum total credit hours per semester should be 12 and the maximum is 18. \
        There should be a single LPAP class somewhere in the 4 year plan. \
        No text or explanations necessary, \
        just output in a json object format."
    # print (chatPrompt)

    response = chatWrapper.chatWrapper(chatPrompt)

    # Clean the chatWrapper output to be json formatted
    cleaned_response = response.strip('` \njson\n')

    print(cleaned_response)

        
    # print(request.form['foo']) # should display 'bar'
    return jsonify(json.loads(cleaned_response)) # response to your request.

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/<path:filename>')
def static_files(filename):
    print(filename)
    return send_from_directory('./hackrice14/dist', filename)

# main driver function
if __name__ == '__main__':
    # run() method of Flask class runs the application 
    # on the local development server.
    app.run()



