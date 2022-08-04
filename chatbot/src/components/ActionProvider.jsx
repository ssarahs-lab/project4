import React from 'react';
import MessageParser from './MessageParser';
const { Configuration, OpenAIApi } = require("openai");



const configuration = new Configuration({
  apiKey: "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",
});

const openai = new OpenAIApi(configuration);


let messageHistory = ''

const ActionProvider = ({ createChatBotMessage, setState, children}) => {
  const handleHello = () => {
    const botMessage = createChatBotMessage('Hi! I\'m a chatbot created to help people talk about their problems. What would you like to talk about today? ');

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };

  
  
  const callOpenAI = (message) => {

    messageHistory = messageHistory + `\n You: ${message} `
    
    console.log(messageHistory)
    console.log("this works")
 
      openai.createCompletion({
        model: "text-davinci-002",
        prompt: `The following is a conversation with a friend. 

        The friend is empathetic, kind, clever, and humorous.
        Bot: Hi! I\'m a chatbot created to help people talk about their problems. What would you like to talk about today?
        You: ${messageHistory}
        Bot: ` ,
        temperature: 0.9,
        max_tokens: 150,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0.6,
        stop: [" You:"],

        
      })
      .then((response) => {
       let botMessage = createChatBotMessage(`${response.data.choices[0].text}`);
        console.log(response.data.choices[0].text)
        
        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, botMessage],
        }));
        messageHistory = messageHistory + ` \n Bot: ${botMessage.message}`
    
        console.log(messageHistory)
      })

      
    
   

  } 

  // Put the handleHello function in the actions object to pass to the MessageParser
  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          actions: {
            handleHello, callOpenAI
          },
        });
      })}
    </div>
  );
};

export default ActionProvider;