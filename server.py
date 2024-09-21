# Flask Setup: https://www.geeksforgeeks.org/flask-creating-first-simple-application/

# Importing flask module in the project is mandatory
# An object of Flask class is our WSGI application.
from flask import Flask, request


# Flask constructor takes current module (__name__) as argument.
app = Flask(__name__)

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
    userClassesTaken = ', '.join(content["classesTaken"])
    userYear = str(content["year"])

    # print("i am so cool and i am " + str(userYear) + " yeaars old and I love " + ', '.join(userClassesTaken))

    # ChatGPT Prompt
    chatPrompt = f"Make a 4 year degree plan for a Rice  {userMajor}  major and a table \
        with options for distribution courses and free electives for each year. \
        Student will be in year  {userYear}  next school year, and has already completed \
        the following courses:  {userClassesTaken} . No text or explanations necessary, \
        just output in a json object format."
    print (chatPrompt)
    
    # print(request.form['foo']) # should display 'bar'
    return 'Received !' # response to your request.


# main driver function
if __name__ == '__main__':
    # run() method of Flask class runs the application 
    # on the local development server.
    app.run()



