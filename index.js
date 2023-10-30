'use strict';

const mockData = require('./mockData.js').data;
const prompt = require('prompt-sync')();

// Example user profile for testing purposes
const userProfile = {
  first_name: 'Evi',
  last_name: 'Joyce',
  age: '32',
  location: 'city',
  gender: 'm',
  gender_interest: 'f',
  min_age_interest: '28',
  max_age_interest: '39'
};

// List of questions along with format validity checks
const questions = [
  { key: 'First name', question: "What is your first name?", format: /^[A-Za-z\s]+$/, validator: (value) => value.trim() !== '' },
  { key: 'Last name', question: "What is your last name?", format: /^[A-Za-z\s]+$/, validator: (value) => value.trim() !== '' },
  { key: 'Age', question: "What is your age?", format: /^[0-9]+$/, validator: (value) => Number(value) >= 18 },
  { key: 'Location', question: "What is your location? (rural/city)", format: /^(rural|city)$/i },
  { key: 'Gender', question: "What is your gender? (M/F/X)", format: /^(M|F|X)$/i },
  { key: 'Gender interest', question: "Which genders are you interested in dating? (M/F/X)", format: /^(M|F|X)$/i },
  { key: 'Minimum age interest', question: "What is the minimum age you are interested in?", format: /^[0-9]+$/, validator: (value) => Number(value) >= 18 },
  { key: 'Maximum age interest', question: "What is the maximum age you are interested in?", format: /^[0-9]+$/, validator: (value) => Number(value) >= 18 },
];

for (const userInfoQuestion of questions) {
  let answer = prompt(userInfoQuestion.question);

  // Check that maximum age interest is higher than minimum age interest
  if (userProfile.max_age_interest < userProfile.min_age_interest) {
    console.log('Maximum age interest should be higher than minimum age interest');

    // Ask user to enter minimum age interest and maximum age interest
    // again in case  of wrong input
    userProfile.min_age_interest = Number(prompt('Enter your minimum age interest:'));
    userProfile.max_age_interest = Number(prompt('Enter your maximum age interest:'));
  }

  // In case of an invalid format answer, ask the user the question again
  while (!userInfoQuestion.format.test(answer) || (userInfoQuestion.validator && !userInfoQuestion.validator(answer))) {
    answer = prompt("Invalid input. " + userInfoQuestion.question);
  }

  userProfile[userInfoQuestion.key] = answer;
}

// Print the info that the user just entered
console.log("User profile:", userProfile);

// Define an empty array of matches
const matches = [];

// Look for matches between current user and other users in database

for (const user of mockData) {
  // Define a variable to make sure that if a user enters X as a gender
  // interest, they are open to dating individuals of any gender (M,F,or X)
  const genderInterestMatch =
    userProfile.gender_interest === 'X' || user.gender_interest === 'X' || userProfile.gender === user.gender_interest;

  if (
    //Check that minimum and maximum age interests match
    (user.age >= userProfile.min_age_interest && user.age <= userProfile.max_age_interest) &&
    (userProfile.age >= user.min_age_interest && userProfile.age <= user.max_age_interest) &&
    // Check that gender interests match
    (genderInterestMatch) &&
    // Check that locations match
    (user.location === userProfile.location)
  ) {
    // Add matched user profile to match array
    matches.push(user);
  }
}

// Print the number of matches
console.log(`Number of matches: ${matches.length}`);

// Print info of matched users
matches.forEach((match) => {
  console.log(`Name: ${match.first_name} ${match.last_name}, Age: ${match.age}, Location: ${match.location}`);
});