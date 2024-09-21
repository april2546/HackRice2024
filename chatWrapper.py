import os
import openai

openai_api_key = os.getenv("OPENAI_API_KEY")
#openai.api_key = openai_api_key
client = openai_api_key

content = input("User: ")
completion = client.chat.completions.create(model = "gpt-4o-mini",
messages = [
  {"role": "user", "content": content} # content is the message we want to send
])

chat_response = completion.choices[0].message.content
print(f'ChatGPT: {chat_response}')