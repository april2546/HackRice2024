import chatWrapper
# Flask Setup: https://www.geeksforgeeks.org/flask-creating-first-simple-application/

# Importing flask module in the project is mandatory
# An object of Flask class is our WSGI application.
from flask import Flask, request, jsonify
from flask_cors import CORS


# Flask constructor takes current module (__name__) as argument.
app = Flask(__name__)
CORS(app)
# The route() function of the Flask class is a decorator, 
# which tells the application which URL should call 
# the associated function.



# Bounding '/' URL with promptChat() function
@app.route('/', methods=['POST', 'GET'])
def promptChat():
    content = request.json
    print (content)  # content is a dict with the same structure as testinput.json

    # String vars for ChatGPT prompt
    userMajor = content["major"]
    userClassesTaken = ', '.join(content["courses"])
    userYear = str(content["year"])

    csv_string = ""
    if(userMajor == "Computer Science"):
        with open('csv_files/comp_courses.csv', 'r') as file:
            csv_string = file.read()
    

    
    with open('course_scraper/comp_courses.csv', 'r') as file:
            csv_string = file.read()

    with open('course_scraper/test.csv', 'r') as file:
            poo_string = file.read()



    userMajor = "Computer Science"
    userClassesTaken = ""
    userYear = "Freshman"


    chatExample = str({
    "degree_plan": {
        "Sophomore": {
        "Required_Courses": [
            {"title": "COMP 215", "credit_hours": "4"},
            {"title": "COMP 222", "credit_hours": "4"},
            {"title": "COMP 312", "credit_hours": "3"},
            {"title": "COMP 330", "credit_hours": "3"}
        ],
        "Distribution_Courses": [
            {"title": "ARTS 103", "credit_hours": "3"},
            {"title": "ECON 100", "credit_hours": "3"}
        ],
        "Free_Electives": [
            {"title": "Free Elective", "credit_hours": "3"},
            {"title": "Free Elective", "credit_hours": "3"}
        ]
        },
        "Junior": {
        "Required_Courses": [
            {"title": "COMP 310", "credit_hours": "4"},
            {"title": "COMP 321", "credit_hours": "4"},
            {"title": "COMP 340", "credit_hours": "4"},
            {"title": "COMP 402", "credit_hours": "4"}
        ],
        "Distribution_Courses": [
            {"title": "PHIL 160", "credit_hours": "3"},
            {"title": "PSYC 101", "credit_hours": "3"}
        ],
        "Free_Electives": [
            {"title": "Free Elective", "credit_hours": "3"},
            {"title": "Free Elective", "credit_hours": "3"}
        ]
        },
        "Senior": {
        "Required_Courses": [
            {"title": "COMP 410", "credit_hours": "4"},
            {"title": "COMP 411", "credit_hours": "4"},
            {"title": "COMP 415", "credit_hours": "4"},
            {"title": "COMP 460", "credit_hours": "4"}
        ],
        "Distribution_Courses": [
            {"title": "SPAN 263", "credit_hours": "3"},
            {"title": "LING 200", "credit_hours": "3"}
        ],
        "Free_Electives": [
            {"title": "Free Elective", "credit_hours": "3"},
            {"title": "Free Elective", "credit_hours": "3"}
        ]
        }
    }
    })
    # print (chatExample)


    # ChatGPT Prompt
    chatPrompt = f"Make a 4 year degree plan for a Rice  {userMajor}  major and a table \
        with options for distribution courses and free electives for each year. \
        For the Required_Courses, use this list of courses {poo_string} \
        as valid major requirements to complete the 4-year degreee. However, do not use this list for Distribution_Courses \
        and Free_Electives; instead, choose them on your own based on web info. \
        Here is an example of a correct plan: {chatExample} \
        Courses should be formatted as JSON objects with the keynames: \
        title and credit_hours.   \
        Student will be in year  {userYear}  next school year, and has already completed \
        the following courses:  {userClassesTaken} . No text or explanations necessary, \
        just output in a json object format."
    # print (chatPrompt)

    response = chatWrapper.chatWrapper(chatPrompt)

    # Clean the chatWrapper output to be json formatted
    cleaned_response = response.strip('` \njson\n')

    print(cleaned_response)

        
    # print(request.form['foo']) # should display 'bar'
    return jsonify(cleaned_response) # response to your request.


# main driver function
if __name__ == '__main__':
    # run() method of Flask class runs the application 
    # on the local development server.
    app.run()



