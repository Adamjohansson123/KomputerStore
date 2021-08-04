const getLoanButton = document.getElementById("getLoan");
const payLoanButton = document.getElementById("payLoan");
const bankButton = document.getElementById("bank");
const workButton = document.getElementById("work");
const loanElement = document.getElementById("loan");
const balanceElement = document.getElementById("balance");
const payElement = document.getElementById("pay");
const buyComputerButton = document.getElementById("buy");
const loanContainer = document.getElementById("loanContainer");
const computersElement = document.getElementById("computersElement");
const computerTitle = document.getElementById("computerTitle");
const computerDescription = document.getElementById("description");
const computerPrice = document.getElementById("price");
const computerFeatures = document.getElementById("computerFeatures");
const computerImage = document.getElementById("computerImage");

const ApiURL = "https://noroff-komputer-store-api.herokuapp.com/"; //URL to connect to the API

let balance = 0;
let loan = 0;
let haveBoughtComputer = true;
let payBalance = 0;
let computers = [];

//*********************The Bank***********************

/**
 * Tells the user to enter the amount of money he wishes to loan. If he leaves the field empty it triggers a alert.
 * If the user already have a loan he can´t take a new loan before the previous loan is payed back. The user can also
 * not get a new loan before he has bought a new computer.  
 * If the user wants to loan more money than he has in his bank account it will trigger a alert.
 * If the loan is OK then the bank account increases with the loan amount and it also displays for the user how much
 * loan he has left to pay back. A new button gets visible for the user which makes it possible to pay back the loan.
 */
 const handleGetLoan = () => {

    const amount = parseInt(prompt("Please enter the amount of money you wish to loan: "));

    if(haveBoughtComputer != true) {
        alert("You need to buy a computer before you can take a new loan!")
    }
    else if(isNaN(amount)) {
        alert("You need to enter a valid amount!");
    }
    else if(loan > 0){
        alert("You already have a loan and can therefore not take a new loan!");
        
    }
    else if(amount <= 0 || amount > (balance * 2)){
        alert("You can´t loan this amount of money!");
    }
    else {
      balance += amount;
      loan = amount;
      payLoanButton.style.display = "block";
      haveBoughtComputer = false;
    }

    displayBalance(); //Calls a method to display the new bank account balance and the amount which were loaned. 
}

/**
 * Method to display bank account balance, work account balance and the amount of loaned money.
 * If loan is bigger than 0 then a button which makes it possible to pay back the money. If there is no loan
 * then the button is hidden from the user.
 */
const displayBalance = () =>{
    balanceElement.innerText = balance + " KR";
    payElement.innerText = payBalance + " KR";
    loanElement.innerText = loan + " KR";
    if(loan > 0){
        payLoanButton.style.display = "block";
        loanContainer.style.visibility = "visible";
        workButton.style.marginRight = "5px";
    }
    else {
        payLoanButton.style.display = "none";
        loanContainer.style.visibility = "hidden";
        workButton.style.marginRight = "25px";
    }
}

//*********************Work***********************

/**
 * Method to add 100 Kr as salary to the work account everytime the "Work" button is clicked.
 */
const handleWork = () => {
    
    payBalance += 100;
    
    displayBalance(); //Displays the new balance in the work account to the user
}

/**
 * Method which makes it possible for the user to transfer his money from the work account to his bank account.
 * If there is an active loan and the work account minus 10 % is still a bigger amount than the loan itself, then
 * the whole loan is repayed. This also makes the repay button disappear. If the loan is bigger than the amount in the 
 * work account then only 10 % of the money gets used to repay the loan and the rest (90 %) goes into the bank account.
 * If there´s no active loan then the money in the work account transfers straight into the bank account. The bank account
 * then increases with the amount of money which were transfered and the work account gets reset to 0 Kr.  
 * 
 */
 const handleBank = () => {
    if(loan > 0){
        if(payBalance * 0.10 > loan){
            payBalance -= loan;
            loan = 0;
            payLoanButton.style.display = "none";
        } 
        else {
            loan -= payBalance * 0.10;
            payBalance = payBalance * 0.90;
        }
    }
    balance += payBalance;
    payBalance = 0;
    
    displayBalance(); //Displays the new balance in the bank account and the new amount of money in the work account. Also displays what´s left of the loan to repay.
}

/**
 * Method to repay the loan. If the amount in the work account is bigger than the loan itself then the whole loan is 
 * repayed and the rest of the money is transferred to the bank account. If the work account have less money than the loan
 * then all money (100 %) in that account gets used to repay the loan. The work account is also set to 0 Kr.
 */
const payLoan = () => {
    if(payBalance > loan){
        balance += (payBalance - loan);
        loan = 0;
    }else {
        loan -= payBalance;
    }
    payBalance = 0;

    displayBalance(); //Displays the new balance in the work account and what´s left of the loan to pay.
}

//*********************Laptops***********************

/**
 * Fetch data from a API. Takes the API Url and adds "computers" to the Url to reach the desired endpoint.
 * Try, catch and finally to handle any error that could occur. 
 */
try {
    fetch(ApiURL + "computers")
    .then(response => response.json())
    .then(data => computers = data)
    .then(computers => addComputersToSelection(computers)); 
}
catch(error) {
    console.log('Something went wrong when fetching all data!', error);
}
finally {
   
} 

/**
 * Method that sends all computers to the addComputerToSelection method. 
 * @param {*} computers An array of computers 
 */
const addComputersToSelection = (computers) => {
    computers.forEach(computer => addComputerToSelection(computer));

    displayComputer(computers[0]); //Displays information of the first computer when the webpage is loaded.
}

/**
 * Method that takes in all computer objects from the addComputersToSelection method and adds them in a dropdown options list.
 * @param {*} computer A computer object
 */
const addComputerToSelection = (computer) => {
    const computerElement = document.createElement("option");
    computerElement.value = computer.id;
    computerElement.appendChild(document.createTextNode(computer.title)); 
    computersElement.appendChild(computerElement);
}

/**
 * When the user change computer in the dropdown options list, information about the new computer gets displayed instead of the previous one.
 * @param {*} e The event that occur
 */
const handleComputerSelectionChange = e => {
    const selectedComputer = computers[e.target.selectedIndex];

    displayComputer(selectedComputer);
}

/**
 * Takes in a computer object and returns all features the computer have. 
 * @param {*} computer A computer object
 * @returns A string of all features the computer have.
 */
const getFeatures = (computer) =>{
    let specs = "";
    for(let i = 0; i < computer.specs.length; i++){
        specs += computer.specs[i] + "\n";
    }
    return specs;
}

/**
 * Takes in a computer object and then displays all information about it. 
 * @param {*} computer A computer object
 */
const displayComputer = (computer) =>{
    computerFeatures.innerText = getFeatures(computer);
    computerImage.src = ApiURL + computer.image;
    computerTitle.innerText = computer.title;
    computerDescription.innerText = computer.description;
    computerPrice.innerText = computer.price + " KR";
}

/**
 * Method which makes it possible for the user to buy a computer. If the user doesn´t have enough money in his bank account
 * then a alert message will occur that tells the user that he can´t afford the selected computer. If the user have enough money
 * he has successfully bought a new computer. 
 */
const buyComputer = () => {
    const selectedComputer = computers[document.getElementById("computersElement").value-1];
    if(balance < selectedComputer.price){
        alert("You can't afford to buy that laptop!")
    }else{
        balance -= selectedComputer.price;
        alert("Congratulations! You have successfully bought a new laptop!");
        haveBoughtComputer = true;
    }
    
    displayBalance(); //Displays the new balance in the bank account
}

/**
 * Eventlisteners that gets triggered when the user clicks certain buttons or if he changes computer in dropdown options list.
 */
computersElement.addEventListener("change", handleComputerSelectionChange);
getLoanButton.addEventListener("click", handleGetLoan);
bankButton.addEventListener("click", handleBank);
workButton.addEventListener("click", handleWork);
payLoanButton.addEventListener("click", payLoan);
buyComputerButton.addEventListener("click", buyComputer);


