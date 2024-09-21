import os
import openai
import json

def chatWrapper(content):
  openai.api_key = os.getenv("OPENAI_API_KEY")

  # Create the completion response in openai
  completion = openai.chat.completions.create(
    model = "gpt-4o-mini",
    messages = [
      {"role": "user", "content": content} # content is the message we want to send
    ],
  )

  # Extract the response as a string from completion
  chat_response = completion.choices[0].message.content

  return chat_response


# Standardize the input string to a string (str(whatever is passed in from the front end))
content = "make a 4 year degree plan for a Rice computer science major and a table with options for distribution courses and free electives for each year. no text or explanations necessary, just output in a json object format"
response = chatWrapper(content)

# Clean the chatWrapper output to be json formatted
cleaned_response = response.strip('` \njson\n')

print(cleaned_response)