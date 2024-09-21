import os
import openai
import json


# Load environment variables from .env file

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
