# HackRice2024 Degree Planner

This project includes a React front-end and a Flask Python server that generates a personalized degree plan based on user-inputted information through the front-end. Course requirements are scraped from Rice University's website using a C++ scraper and the following course information is stored in CSV files. The Flask server passes a dynamic input from the selected values in the website along with the associatred CSV file to an underlying GPT functionality to create a degree plan, which is returned to the front-end for display to the user.

## Getting Started
Clone the repository:
$git clone <repo-url>$
$cd HackRice2024$

Set up Flask:
$pip install Flask$

## Running the Application
Run the Flask server
Run the React App