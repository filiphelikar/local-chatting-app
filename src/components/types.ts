export type Chat = {
    user: string;
  };
  
  export type ChatState = {
    user: string;
  };
  
  export type Action =
    | { type: 'ADD_USER'; payload: string }
    | { type: 'LOG_OUT' };