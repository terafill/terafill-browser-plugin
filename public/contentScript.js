const dataMap = {
  username: [
      "johndoe",
      "doejohn",
      "johndoe93"
    ],
  firstname: [
    "John"
  ],
  lastname: [
    "Doe"
  ],
  email: [
    "johndoe@gmail.com",
    "doejohn@rocketmail.com",
    "johndoe1993@gmail.com"
  ],
  password: [
    "test@1234",
    "sample-password"
  ],
  confirmpassword: [
    "test@1234",
    "sample-password"
  ]
};

import Fuse from 'fuse.js';

const fieldTypes = [
  { type: 'firstname', keywords: ['first', 'name', 'given', 'firstname', 'first_name'] },
  { type: 'lastname', keywords: ['last', 'name', 'surname', 'family', 'lastname', 'last_name'] },
  { type: 'username', keywords: ['user', 'name', 'login', 'username'] },
  { type: 'password', keywords: ['password', 'pass', 'pwd'] },
  { type: 'email', keywords: ['email', 'mail'] },
  { type: 'confirmpassword', keywords: ['confirm', 'password', 'confirm_password', 'confirmPassword', 'verify'] },
];

const options = {
  keys: ['keywords'],
  threshold: 0.3,
  includeScore: true,
};

const fuse = new Fuse(fieldTypes, options);

function identifyFieldType(inputField) {
  const attributesToCheck = ['name', 'id', 'class', 'type'];

  let bestMatch = { score: Infinity, type: 'unknown' };

  attributesToCheck.forEach((attr) => {
    const query = inputField.getAttribute(attr);
    if (!query) return;

    const lowercaseQuery = query.toLowerCase();
    const result = fuse.search(lowercaseQuery);

    if (result.length > 0 && result[0].score < bestMatch.score) {
      bestMatch = { score: result[0].score, type: result[0].item.type };
    }
  });

  return bestMatch.type;
}

let fieldTypeMap = {

};


// Usage:
const inputFields = document.querySelectorAll('input');
inputFields.forEach((input) => {
  const fieldsType = identifyFieldType(input);
  fieldTypeMap[input.id] = fieldsType;
  console.log("identifyFieldType", fieldsType);
});

function hasLoginForm() {
  const passwordInputs = document.querySelectorAll('input[type="password"]');
  const emailInputs = document.querySelectorAll('input[type="email"]');
  const textInputs = document.querySelectorAll('input[type="text"]');

  // Check if there's at least one password input field.
  if (passwordInputs.length === 0) {
    return false;
  }

  // Check if there's an email or text input field.
  if (emailInputs.length === 0 && textInputs.length === 0) {
    return false;
  }

  return true;
}

function getFormType(form) {
  const passwordInputs = form.querySelectorAll('input[type="password"]');
  const emailInputs = form.querySelectorAll('input[type="email"]');
  const textInputs = form.querySelectorAll('input[type="text"]');
  const confirmPasswordInputs = form.querySelectorAll('input[name*="confirm"], input[name*="Confirm"]');

  if (passwordInputs.length === 0) {
    return null;
  }

  if (emailInputs.length === 0 && textInputs.length === 0) {
    return null;
  }

  // If there's a confirm password field, it's likely a signup form.
  if (confirmPasswordInputs.length > 0) {
    return 'signup';
  }

  return 'login';
}



function createButton() {
  const button = document.createElement('button');
  const icon = document.createElement('img');
  icon.src = chrome.runtime.getURL('subtract-dark.png');
  icon.style.width = '100%';
  icon.style.height = '100%';
  icon.style.objectFit = 'contain'; // Use the correct style syntax

  button.style.width = '24px';
  button.style.height = '24px';
  button.style.position = 'absolute';
  button.style.zIndex = 2147483647;
  button.style.border = 0;
  button.style.padding = 0;
  button.style.backgroundColor = 'transparent'; // Set the button's background to transparent
  button.style.cursor = 'pointer'; // Change the cursor to a pointer when hovering over the button

  button.appendChild(icon);
  return button;
}


function positionButton(button, inputField) {
  const rect = inputField.getBoundingClientRect();
  const horizontalSpacing = 8; // The spacing between the button and the right end of the input field

  button.style.left = rect.left + window.pageXOffset + rect.width - 24 - horizontalSpacing + 'px';
  button.style.top = rect.top + window.pageYOffset + (rect.height / 2) - (24 / 2) + 'px';
}

function Popup(fieldType, inputField) {
  const popup = document.createElement('div');
  popup.innerHTML = '';

  if (fieldType === "unknown"){
    Object.entries(dataMap).forEach(([fieldType, fieldList])=>{
      const header = document.createElement('div');
      header.innerHTML = fieldType;
      header.style.fontWeight = 'bold';
      popup.appendChild(header);
      fieldList.map(value=>{
        const item = document.createElement('div');
        item.innerHTML = value;
        item.addEventListener("click", (event)=>{
          inputField.value = event.target.textContent;
        });
        popup.appendChild(item);
      });
    })
  }
  else{
    const header = document.createElement('div');
    header.innerHTML = fieldType;
    header.style.fontWeight = 'bold';
    popup.appendChild(header);
    console.log("dataMap[fieldType]", fieldType, dataMap[fieldType], fieldTypeMap);
    dataMap[fieldType].forEach(value=>{
      const item = document.createElement('div');
      item.innerHTML = value;
      item.addEventListener("click", (event)=>{
        inputField.value = event.target.textContent;
      });
      popup.appendChild(item);
    });
  }

  popup.classList.add('your-popup-class');
  return popup;
}

function positionPopup(popup, inputField) {
  // Position the popup relative to the input field
  const rect = inputField.getBoundingClientRect();
  popup.style.left = rect.left + window.pageXOffset + 'px';
  popup.style.top = rect.top + rect.height + window.pageYOffset + 'px';
}

/*
---------------------TODO-------------------
1. Set default password and username.
2. Test if page is create account page? If yes, then make password recommendations.
*/


if(hasLoginForm()){
  const inputFields = document.querySelectorAll(`input[type="password"], input[type="text"], input[type="email"]`);

  inputFields.forEach((inputField) => {


    // Setup button for input field
    const button = createButton();
    button.id = `button-${inputField.id}`
    positionButton(button, inputField);
    document.body.appendChild(button);

    window.addEventListener('resize', () => {
      positionButton(button, inputField);
    });

    // Setup autofill suggestion popup
    let popup = Popup(fieldTypeMap[inputField.id], inputField);
    popup.id = `popup-${inputField.id}`

    // Toggle autofill suggestion popup on button click
    button.addEventListener('click', () => {
      if(!document.getElementById(popup.id)){
        document.body.appendChild(popup);
      }
      else{
        popup.remove();
      }
    });

    positionPopup(popup, inputField);

    inputField.addEventListener('focus', () => {
      if(!document.getElementById(popup.id)){
        document.body.appendChild(popup);
      }
    });

    inputField.addEventListener('blur', () => {
      if(document.getElementById(popup.id)){
        popup.remove();
      }
    });

    window.addEventListener('resize', () => {
      positionPopup(popup, inputField);
    });

  });
}
