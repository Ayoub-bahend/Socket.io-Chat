/*global io, rivets, utils*/
/*jslint browser: true*/
var socket = io();
var i, j;

/**
 * Liste des messages
 */
var messages = [];

/**
 * Liste des utilisateurs
 */
var users = [];

/*** DataBinding initial ***/
rivets.bind($('#messages'), { messages: messages });
rivets.bind($('#users'), { users: users });

/*** Gestion des événements ***/

/**
 * Connexion de l'utilisateur
 * Uniquement si le username n'est pas vide et n'existe pas encore
 */
$('#login form').submit(handleLogin);

/**
 * Envoi d'un message
 */
$('#chat form').submit(handleChatMessage);

/**
 * Réception d'un message
 */
socket.on('chat-message', handleReceivedChatMessage);

/**
 * Réception d'un message de service
 */
socket.on('service-message', handleServiceMessage);

/**
 * Connexion d'un nouvel utilisateur
 */
socket.on('user-login', handleUserLogin);

/**
 * Déconnexion d'un utilisateur
 */
socket.on('user-logout', handleUserLogout);

/**
 * Détection saisie utilisateur
 */
var typingTimer;
var isTyping = false;

$('#m').keypress(handleKeyPress);
$('#m').keyup(handleKeyUp);

/**
 * Gestion saisie des autres utilisateurs
 */
socket.on('update-typing', handleUpdateTyping);

function handleLogin(e) {
  e.preventDefault();
  var user = {
    username: $('#login input').val().trim()
  };
  console.log('Attempting to log in with username:', user.username);

  if (user.username.length > 0) {
    socket.emit('user-login', user, function (success) {
      console.log('Server response:', success);
      if (success) {
        $('body').removeAttr('id');
        $('#chat input').focus();
      } else {
        console.error('Login failed');
      }
    });
  }
}

function handleChatMessage(e) {
  e.preventDefault();
  var messageText = $('#m').val().trim();

  if (messageText.length !== 0) {
    var message = {
      text: messageText
    };
    $('#m').val('');
    socket.emit('chat-message', message);
  } else {
    console.error('Message text is empty.');
  }

  $('#chat input').focus();
}

function handleReceivedChatMessage(message) {
  message.label = message.username;
  messages.push(message);
  utils.scrollToBottom();
}

function handleServiceMessage(message) {
  message.label = 'information';
  messages.push(message);
  utils.scrollToBottom();
}

function handleUserLogin(user) {
  users.push(user);
  setTimeout(function () {
    $('#users li.new').removeClass('new');
  }, 1000);
}

function handleUserLogout(user) {
  var userIndex = users.findIndex(u => u.username === user.username);
  if (userIndex !== -1) {
    users.splice(userIndex, 1);
  }
}

function handleKeyPress() {
  clearTimeout(typingTimer);
  if (!isTyping) {
    socket.emit('start-typing');
    isTyping = true;
  }
}

function handleKeyUp() {
  clearTimeout(typingTimer);
  typingTimer = setTimeout(function () {
    if (isTyping) {
      socket.emit('stop-typing');
      isTyping = false;
    }
  }, 500);
}

function handleUpdateTyping(typingUsers) {
  users.forEach(function (user) {
    user.typing = typingUsers.some(typingUser => typingUser.username === user.username);
  });
}
