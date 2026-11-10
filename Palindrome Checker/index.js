// Goal: Create a simple String checker to see if the inputted string is a palindrome
// change inputString to do this
let inputString = "Prorp";

let inString = inputString.toLowerCase().trim();
if (inString.length == 0) {
    console.log("Inputted string is length of zero. Please input valid string");
} else {
    console.log("Word to analyze: " + inString);
    
    if (checkPalindrome(inString)) {
        console.log("Your word is a palindrome!");
    } else {
        console.log("Your word is NOT a palindrome!");
    }
}



function checkPalindrome(inString) {
    let stringArray = inString.split("");
    let ascendingIndex = 0;
    let descendingIndex = stringArray.length - 1;

    while (descendingIndex > ascendingIndex) {
        if (stringArray[ascendingIndex] == stringArray[descendingIndex]) {
            console.log("Check passed");
        } else {
            console.log("Check failed");
            return false;
        }

        ascendingIndex++;
        descendingIndex--;
    };

    return true;
}