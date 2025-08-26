// in MessageParser.js
import axios from 'axios';
import React from 'react';

const MessageParser = ({ children, actions }) => {

  const handleParse = (message) => {
    actions.handleChat(message)
  };

  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          parse: handleParse,
          actions,
        });
      })}
    </div>
  );
};

export default MessageParser;
