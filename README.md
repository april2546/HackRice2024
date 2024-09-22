# HackRice2024 Degree Planner

This project includes a React front-end and a Flask Python server that generates a personalized degree plan based on user-inputted information through the front-end. Course requirements are scraped from Rice University's website using a C++ scraper and the following course information is stored in .txt files. The Flask server passes a dynamic input from the selected values in the website along with the associated .txt file to an underlying GPT functionality to create a degree plan, which is returned to the front-end for display to the user.
