import { io } from 'socket.io-client';
import { baseURL } from './services/globalServices';

// User namespace
const userSocket = io(`${baseURL}/users`, {
    autoConnect: false
  }); 


// Admin namespace
const adminSocket = io(`${baseURL}/admin`, {
    autoConnect: false
  });


// Admin namespace
const gameSocket = io(`${baseURL}/game`, {
    autoConnect: false
  });

export {userSocket, adminSocket, gameSocket}