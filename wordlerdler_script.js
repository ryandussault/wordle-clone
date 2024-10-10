//stores not allowed characters
var not_allowed_characters = [" ","","~", ":", "'", "+", "[", "\\", "@", "^", "{", "%", "(", "-", '"', "*", "|", "'","'", "&", "<", "`", "}", ".", "_", "=", "]", "!", ">", ";", "?", "#", "$", ")", "/", "1", "2", "3", "4", "5", "6", "7", "8", "9","0"];
//stores the current row and box
var current_row = 1;
var current_box = 0;
//stores the user guess
var user_guess = "";
//stores the valid answers
var valid_answers = getColumn("Wordle", "validWordleAnswer");
//stores the valid guesses
var valid_guesses = getColumn("sorted_guesses", "validWordleGuess");
//stores a randomly picked answer from the answer list
var answer = valid_answers[randomNumber(0,2307)];
//stores the range the first letter of the guess appears in the valid guess table
var letter_index_table = {
'a':[0,595], 
'b':[596,1330], 
'c':[1331,2052], 
'd':[2053,2622], 
'e':[2623,2853],
'f':[2854,3313],
'g':[3314,3835],
'h':[3835,4254],
'i':[4255,4385],
'j':[4386,4565],
'k':[4568,4922],
'l':[4923,5410],
'm':[5411,5996],
'n':[5997,6284],
'o':[6285,6505],
'p':[6506,7221],
'q':[7222,7276],
'r':[7277,7779],
's':[7800,8994],
't':[8995,9661],
'u':[9662,9816],
'v':[9817,10015],
'w':[10016,10344],
'x':[1,2],
'y':[10345,10535],
'z':[10536,10637]
};

//changes screen when the "playtime" button is pressed
onEvent("startButton", "click", function(){
  setScreen("wordleScreen");
});

//calls the reset function when the reset button is pressed
onEvent("reset_button", "click", function(){
  reset_game();
});
//checks if the key pressed is a special character, if the row is full, and if the key isnt empty space 
//then it sets the current box to the key pressed, increases the box number and hides the invalid guess/key label
onEvent("wordleScreen", "keypress", function(event){
  if (special_characters(event.key) == false && current_box<5 && event.charCode !=13){
    setProperty("row"+current_row+"_box"+current_box, "text", event.key);
    current_box++;
    hideElement("invalid_guess_label");
  }
});

onEvent("wordleScreen", "keydown", function(event){
  //deletes the letter in the previous box
  if (event.key == "Backspace" && current_box>0){
     current_box = current_box-1;
     //changes the letter in the box to empty space
    setProperty("row"+current_row+"_box"+current_box,"text","");
  }
  //checks if the keydown was enter, if the current row is less than 7 and also makes sure the user is at the last box
  else if (event.key == "Enter" && current_row<7 && current_box ==5){
    //loops through the 5 boxes to concat the userguess, also puts each letter as lowercase incase it was uppercase when inputted
    for (var x = 0; x<5; x++){
      user_guess = user_guess+getText("row"+current_row+"_box"+x).toLowerCase();
    }
    //checks if the guess is a valid wordle guess
    if (valid_guess_parser()== "valid"){
      //hides invalid label
      hideElement("invalid_guess_label");
      //calls the update row colors function
      update_row_colors();
      //checks if the user's guess is correct
      if(user_guess ==answer){
        //shows the win label and the reset button also resets the userguess
        showElement("win_label");
        showElement("reset_button");
        user_guess = "";
      }
      //checks if the user has filled in all rows without getting a correct answer
      //shows the lose label and reset button if that is the case
      else if(current_row ==6){
        showElement("lose_label");
        showElement("reset_button");
        //popup that shows the user what the word was
        setTimeout(function(){prompt("the word was " + answer);}, 50);
      }
      //if the other two conditions arent true the row is increased. the box is reset, and the userguess is reset
      else{
      current_row++;
      current_box =0;
      user_guess = "";
      }
    }
    //displats invalid guess label if the user guess is invalid
    else{
      user_guess = "";
      showElement("invalid_guess_label");
    }
  }
});

//update row color function hat is used above
function update_row_colors(){
  //loops through the current row
  for (var index =0; index<5;index++){
      //sets the user_guess to upper case for display
      setProperty("row"+current_row+"_box"+index, "text", user_guess[index].toUpperCase());
      //checks if the letter is in the right spot and if so sets the box backgroud to green
      if (user_guess[index].toLowerCase() == answer[index]){
        setProperty("row"+current_row+"_box"+index, "background-color", "green");
      }
      //checks if the letter is in the word and sets the letters backgound to yellow
      else if (answer.includes(user_guess[index].toLowerCase())){
        setProperty("row"+current_row+"_box"+index, "background-color", "yellow");
      }
      //if the letter isnt in the word it sets the background to gray
      else{
        setProperty("row"+current_row+"_box"+index, "background-color", "gray");
      }
    }
}


//loops through the guess list based on the first letter of the users guess to check if it is valid
function valid_guess_parser(){
  //gets the min and max of the first letters range in the list
 var index_max = letter_index_table[user_guess[0]][1];
  var index_min = letter_index_table[user_guess[0]][0];
  
  console.log(index_min + " " + index_max);
  //loops through the min max index values of the pre-chosen range and checks if the userguess is their
  for (var i = index_min; i < index_max+1; i++){
    if (valid_guesses[i]==user_guess){
      return "valid";
    }
  }
  //checks if the guess is in the answer list because they have to make seperate lists for some reason
  for (var j = 0; j<2308; j++){
    if (valid_answers[j] == user_guess){
      return "valid";
    }
  }
  return "invalid";
}
//checks the users inputted key is a special character/number
function special_characters(letter){
  //loops through the specail characters list and checks if the users input is in it
  for (var i = 0; i<not_allowed_characters.length-1; i++){
    if (letter == not_allowed_characters[i]){
      return true;
    }
  }
 return false;
}

//resets the game
function reset_game(){
  //hides the reset button, win label, and lose label
  hideElement("reset_button");
  hideElement("lose_label");
  hideElement("win_label");
  //picks a new random answer
  answer = valid_answers[randomNumber(0, 2307)];
  //resets the box and row to the first box and first row
  current_row = 1;
  current_box = 0;
  //loops through both the boxes and the rows and sets the color back to white and the text back to empty
  for(var j =0; j<6; j++){
    for (var i = 0; i <5; i++){
    setProperty("row"+current_row+"_box"+i, "background-color", "white");
    setProperty("row"+current_row+"_box"+i, "text", "");
    }
    current_row++;
  }
  //resets the current row after using it to loop through the wordle board
  current_row = 1;
  setScreen("wordleScreen");
}
