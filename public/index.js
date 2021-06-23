//true gaanda hai false accha hai

var tokens;
var tokenscopy;

var keyworderror = false;
var semicolonerror = false;
var bracketserror = false;
var spaceafterkeyworderror = false;
var deletestarerror = false;
var doubleQuoteserror = false;
var singleQuoteserror = false;
var unknownSpecialCharactererror = false;
var unknownSpecialCharacter = [];

var specialCharacterArray = [];
    specialCharacterArray.push("*");
    specialCharacterArray.push("\"");
    specialCharacterArray.push("\'");
    specialCharacterArray.push(",");
    specialCharacterArray.push("(");
    specialCharacterArray.push(")");
    specialCharacterArray.push(";");
    specialCharacterArray.push("=");
var keywordarray = [];
    keywordarray.push("SELECT");
    keywordarray.push("UPDATE");
    keywordarray.push("INSERT");
    keywordarray.push("INSERT");

var errorString = "";
let submit_btn =  document.getElementById("submit_btn");

// document.querySelector("#redirecting").onclick = function(){
//     window.location.href = "https://www.google.com/";
//     // window.location.replace("https://www.google.com/");
// }

document.querySelector("#clear-btn").addEventListener("click",function(){
    document.querySelector(".querybox").value = "";
    document.querySelector("#error_area").innerHTML = "Errors here";
    submit_btn.disabled = true;
});

// document.querySelector("#submit_btn").addEventListener("click",function(){
    
//     submit_btn.disabled = true;
// });

document.querySelector("#validate-btn").addEventListener("click",function(){
   var query = document.querySelector(".querybox").value;
   
   if(query.localeCompare("") === 0){
        alert("Please Enter a Query");
   }

   var queryWithoutLines = query.replace(/^(?=\n)$|^\s*|\s*$|\n\n+/gm, "");

   tokenizeString(query);
   
   keyworderror = checkForKeyword();
   semicolonerror = checkForSemiColon();
   bracketserror = checkForBrackets();
   spaceafterkeyworderror = checkforSpaceAfterKeyword();
   
   if(tokens[0].toUpperCase().localeCompare('DELETE') === 0)
        deletestarerror = checkForDeleteStar();
   
    doubleQuoteserror = checkForDoubleQuotes();
    singleQuoteserror = checkForSingleQuotes();
    checkForUnknownSpecialCharacter();
    
    generateErrorString(query);
    
    document.querySelector("#error_area").innerHTML = errorString;
    
    if(errorString.localeCompare("Everything alright") === 0){
            submit_btn.disabled = false;
        }
    else{
          submit_btn.disabled = true;
    }

    // if(errorString.localeCompare("Everything alright!!") === 0){
    //     Download(queryWithoutLines);
    // }

    errorString = "";
    unknownSpecialCharacter = [];
    
});

function Download(queryWithoutLines){
    
  const textToBLOB = new Blob([queryWithoutLines], {
    type: 'text/plain'
  });

  const sFileName = 'formData.txt'; // The file to save the data.

  let newLink = document.createElement("a");
  newLink.download = sFileName;

  if (window.webkitURL != null) {
    newLink.href = window.webkitURL.createObjectURL(textToBLOB);
  } 
  else {
    newLink.href = window.URL.createObjectURL(textToBLOB);
    newLink.style.display = "none";
    document.body.appendChild(newLink);
  }

  newLink.click();
}

function tokenizeString(query){
    tokens = query.split(/([,\s\'\";)(*])/g);
    tokens = tokens.filter(Boolean);
  

    tokenscopy = tokens;
    tokenscopy = tokenscopy.filter(function(entry) { return /\S/.test(entry); });
   
}


function checkForKeyword(){

    var keyword = tokenscopy[0];
    keyword = keyword.toUpperCase();

    if(keywordarray.includes(keyword))
        return false;
    else
        return true;

}
function checkForSemiColon(){

    var semicolon = tokenscopy[tokenscopy.length-1];

    if(semicolon.localeCompare(";") === 0)   
        return false;
    else
        return true;
}

function checkForBrackets(){
    var stack = [];

    for(var i =0;i<tokenscopy.length;i++){
       if(tokenscopy[i].localeCompare("(") === 0){
           stack.push("(");
       }
       else if(tokenscopy[i].localeCompare(")") === 0){
           if(stack.length === 0)
                return true;
           else
                stack.pop();
       }
    }

    if(stack.length === 0)
        return false;
    else
        return true;
}

function checkforSpaceAfterKeyword(){
    if(tokens[1].localeCompare(" ") === 0){
        return false;
    }
    else
        return true;
}

function checkForDeleteStar(){
    if(tokenscopy[1].localeCompare("*") === 0)
        return true;
    else
        return false;
}

function checkForDoubleQuotes(){
    var countDoubleQuotes = 0;

    for(var i=0;i<tokenscopy.length;i++){
        if(tokenscopy[i].localeCompare("\"") === 0)
        countDoubleQuotes++;
    }

    if(countDoubleQuotes %2  != 0)
        return true;
    else
        return false;
}

function checkForSingleQuotes(){
    var countSingleQuotes = 0;

    for(var i = 0;i<tokenscopy.length;i++){
        if(tokenscopy[i].localeCompare("\'") === 0)
        countSingleQuotes++;
    }

    if(countSingleQuotes%2 != 0)
        return true;
    else
        return false;;
}

function checkForUnknownSpecialCharacter(){
    
    var i;
    for(i = 0; i<tokenscopy.length; i++){
        
        // if(IsNumeric(tokenscopy[i]) === true)
        //     continue;

        if(tokenscopy[i].length === 1 && specialCharacterArray.includes(tokenscopy[i]) == false){
            unknownSpecialCharacter.push(tokenscopy[i]);
        }
        
    }

    
    
}

function generateErrorString(){
    // var keyworderror = false;
    // var semicolonerror = false;
    // var bracketserror = false;
    // var spaceafterkeyworderror = false;
    // var deletestarerror = false;
    // var doubleQuoteserror = false;
    // var singleQuoteserror = false;the :"   "
    var count = 0;
    if(keyworderror == true)
       { count++;
         errorString += "ERROR NO "+count+": "+"First keyword is not out of {SELECT,DELETE,UPDATE,INSERT}\n\n";
         
        }
    
    if(semicolonerror == true){
        count++;
        errorString += "EERROR NO "+count+": "+ "Missing semicolon\n\n";
    }
        
    
    if(bracketserror == true){
        count++;
        errorString += "ERROR NO "+count+": "+ "Brackets not balanced\n\n";
    }
        

    if(spaceafterkeyworderror == true && keyworderror == false){
        count++;
        
        errorString += "ERROR NO "+count+": "+ "Space after keyword "+tokens[0].toUpperCase()+ " missing\n\n";
    }
        

    if(deletestarerror == true && tokens[0].toUpperCase().localeCompare("DELETE")){
        count++;
        errorString += "ERROR NO "+count+": "+ "* after DELETE keyword\n\n";
    }
        

    if(doubleQuoteserror == true){
        count++;
        errorString += "ERROR NO "+count+": "+ "Double Quotes not balanced\n\n";
    }
        

    if(singleQuoteserror == true){
        count++;
        errorString += "ERROR NO "+count+": "+ "Single Quotes not balanced\n\n";
    }
        

    if(unknownSpecialCharacter.length !== 0){
        count++;
        errorString += "ERROR NO "+count+": "+ "Presence of Unknown characters : "+unknownSpecialCharacter.toString() +
        "       [[ not  present  in  the  set  {  \"    \'    ;    =    *    (    )    ,  }         ]]\n\n";
    }    
       

    if(errorString.localeCompare("") === 0){
        errorString += "Everything alright";
        
    }
        
}
