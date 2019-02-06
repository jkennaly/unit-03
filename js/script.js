// js/script.js

/************
	
	Utility functions

*************/

const getSelectedOption = $select =>
	$select.children()[$select.prop("selectedIndex")];

/************
	
	Set Focus

*************/

//set focus to first input element
$("input[name=user_name]").focus();

/************
	
	Job Role

*************/

//hide the other job role title on load unless Job Role is on Other
const $otherTitle = $("#other-title");
const selectedOption = getSelectedOption($("#title"));
const otherNotSelected = selectedOption.value !== "other";
if (otherNotSelected) $otherTitle.hide();

//show other title when job role is other
$("#title").on("change", e => {
	if (e.target.value === "other") $otherTitle.show();
	else $otherTitle.hide();
});

/************
	
	T-Shirt info

*************/

//punsSelected returns true if the value string contains 'puns' (case-insensitive)
const punsSelected = value => /puns/i.test(value);

//organizes select into punny and notPunny options
const optionsByPunniness = $select => {
	//filter out the placeholder option from the show/hide logic
	const $options = $select.children("option").filter(i => i);
	//sort the options in punny and notPunny and return on an object
	const $punny = $options.filter((i, option) =>
		punsSelected(option.innerHTML)
	);
	const $notPunny = $options.filter(
		(i, option) => !punsSelected(option.innerHTML)
	);
	return {
		$punny: $punny,
		$notPunny: $notPunny
	};
};

//show the punny and hide the unPunny; set color selector back to placeholder
const showPuns = (reset = true) => $select => {
	const options = optionsByPunniness($select);
	options.$punny.show();
	options.$notPunny.hide();
	//reset the color selecter if requested (also by default)
	if (reset) $select.prop("selectedIndex", 0);
};

//hide the punny and show the unPunny; set color selector back to placeholder
const hidePuns = (reset = true) => $select => {
	const options = optionsByPunniness($select);
	options.$punny.hide();
	options.$notPunny.show();
	//reset the color selecter if requested (also by default)
	if (reset) $select.prop("selectedIndex", 0);
};

/*************

Extra Credit: T-Shirt section

**************/
//show the color selector only if the design is off the placeholder
const considerShowColorSelector = () => {
	if ($("#design").prop("selectedIndex")) {
		$("#color").show();
		$('label[for="color"]').show();
	}
	//hide it if its not
	else {
		$("#color").hide();
		$('label[for="color"]').hide();
	}
};

//show/hide color selector on load
considerShowColorSelector();

//on load, the #design selection is punny
const punnyInit = punsSelected(getSelectedOption($("#design")));

//select the show/hide function based on whether puns selected
//the false parameter indicates not to reset the index on init load
const punFunction = punnyInit ? showPuns(false) : hidePuns(false);
//call the function on the color select el
punFunction($("#color"));

//t-shirt color menu: only display colors that match design
//listen for change in the design menu
$("#design").on("change", e => {
	//on change in design menu, see if puns design is selected
	const punnyDesign = punsSelected(e.target.value);
	//select the show/hide function based on whether puns selected
	//the empty parameter indicates to allow the default for resetting the select index (which is true)
	const punFunction = punnyDesign ? showPuns() : hidePuns();
	//call the function on the color select el
	punFunction($("#color"));

	//Extra Credit: hide the color selector when no design chosen
	considerShowColorSelector();
});

/************
	
	Register for Activities

*************/

const getPriceFromInput = input => {
	const activityString = input.parentNode.textContent;
	const priceString = /.*\$(\d*)$/.exec(activityString)[1];
	return parseInt(priceString, 10);
};

const getTimeFromInput = input => {
	const activityString = input.parentNode.textContent;
	const timeStringPossible = /.*—\s([F-W]\w*\s\S*),/.exec(activityString);
	const timeString = timeStringPossible ? timeStringPossible[1] : undefined;
	return timeString;
};

//for runningTotal, convert checked items to array
//then extract the price from each element, and then add them up
const calcRunningTotal = $checkedActivities =>
	$checkedActivities
		.toArray()
		//map each item to its price
		.map(getPriceFromInput)
		//add up all the prices
		.reduce((total, price) => total + price, 0);

const appendRunningTotal = runningTotal => {
	//remove the existing total if present
	const $existingTotal = $(".running-total");

	if ($existingTotal.length) $existingTotal.remove();

	const $runningTotalSpan = $("<span />")
		.addClass("running-total")
		.html("Total price: $" + runningTotal);

	const $activitiesFieldset = $(".activities").append($runningTotalSpan);
};

const $activities = $('.activities input[type="checkbox"]');
//console.log('activities length ' + activities.length)

//find any elements checked on load
const $initCheckedActivities = $activities.filter(
	(i, activity) => activity.checked
);

//if there are any elements checked on load, calc and dispaly total
if ($initCheckedActivities.length) {
	const runningTotal = calcRunningTotal($initCheckedActivities);
	//add the total to the page
	appendRunningTotal(runningTotal);
}

$activities.on("change", e => {
	const $checkedActivities = $activities.filter(
		(i, activity) => activity.checked
	);

	const $uncheckedActivities = $activities.filter(
		(i, activity) => !activity.checked
	);

	//keep running total of costs of selected events
	const runningTotal = calcRunningTotal($checkedActivities);

	//add the total to the page
	appendRunningTotal(runningTotal);

	//disable selection of activities at the same time as a selected activity

	//get the currently selected times by making checkedActivities an array
	const selectedTimes = $checkedActivities
		.toArray()
		//map each item to its timeString
		.map(getTimeFromInput)
		//remove any undefined values
		.filter(x => x);

	//disable each unchecked item with a time that matches selectedTimes
	const $disabledActivities = $uncheckedActivities
		.filter(
			(i, activity) =>
				selectedTimes.indexOf(getTimeFromInput(activity)) > -1
		)
		.prop("disabled", true);

	//enable each unchecked item with a time that does not match selectedTimes
	const $enabledActivities = $uncheckedActivities
		.filter(
			(i, activity) =>
				selectedTimes.indexOf(getTimeFromInput(activity)) < 0
		)
		.prop("disabled", false);

	//console.log($disabledActivities.length + ' / ' + $enabledActivities.length)
});

/************
	
	Payment Info

*************/

const $paymentOptionSelect = $("#payment");

//change "Select Payment Method" to be disabled
$($paymentOptionSelect.children()[0]).attr("disabled", true);

//default to credit card for #payment
$paymentOptionSelect.prop("selectedIndex", 1);

//a function to show/hide divs based on index
const showHidePaymentDivs = (showIndex, $paymentDivs) =>
	$paymentDivs.each((index, el) => {
		//for the element that matches the target index, show; hide all others
		const displayFunction = showIndex === index ? "show" : "hide";
		$(el)[displayFunction]();
	});

//get jQuery object with the 3 payment info divs
//start by getting the credit card div
const $paymentDivs = $("#credit-card")
	.add(
		//then add the paypal div (also gets the container div for the form)
		$('div:has(p:contains("PayPal"))')
	)
	.add(
		//and the bitcoin div (also gets the container div for the form)
		$('div:has(p:contains("Bitcoin"))')
		//remove the container div for the form
	)
	.filter((i, el) => el.className.indexOf("container") < 0);

//call showHide... to hide btc/paypal by default
showHidePaymentDivs(0, $paymentDivs);

//listen for change in the payment menu
$paymentOptionSelect.on("change", e => {
	//get the new index
	const selectIndex = $paymentOptionSelect.prop("selectedIndex");
	//subtract 1 from index to account for placeholder option in <select>
	const divIndex = selectIndex - 1;
	//show the appropriate div and hide the other two
	showHidePaymentDivs(divIndex, $paymentDivs);
});

/************
	
	Form Validation

*************/

const errorMessageEl = message =>
	$("<span />")
		.addClass("error")
		.html(message);

const attachErrorMessage = ($expectingParent, message) =>
	$expectingParent.append(errorMessageEl(message));

const removeErrorMessages = () => $(".error").remove();

//blank name field
const $nameField = $("#name");
const nameFieldBlank = name => !name;
const nameFieldBlankMessage = "Name field cannot be empty";

/*************

Extra Credit: Conditional Error Message && Real-time Error Message

**************/
//if name is field is not blank but contains any punctuation other than ' or _ it will trigger an error
//The name field is checked for illegal characters in real time
const nameCharsInvalid = name => /[^\w']/.test(name);
const nameCharsInvalidMessage = "Letters, numbers, _ and ' only";

//invalid email
const $emailField = $("#mail");
const emailFieldInvalid = email => !/^\S+@[\w-]+\.[\w-]+$/.test(email);
const emailFieldInvalidMessage =
	'Email format must be similar to "dave@teamtreehouse.com"';

//no activity
const noActivitySelected = () =>
	!$activities.filter((i, activity) => activity.checked).length;
const noActivityMessage = "At least one activity must be selected";

//if credit card payment selected:
//credit card number not between 13 and 16 digits
const $creditNumberField = $("#cc-num");
const creditNumberLengthWrong = num => {
	const creditSelected = $paymentOptionSelect.prop("selectedIndex") === 1;
	const test = creditSelected && !/\d{13,16}/.test(num);
	return test;
};

const creditNumberLengthWrongMessage =
	"Credit card number must be 13-16 digits";

//zip code 5 not digit number
const $zipCodeField = $("#zip");
const zipCodeLengthWrong = num => {
	const creditSelected = $paymentOptionSelect.prop("selectedIndex") === 1;
	const test = creditSelected && !/^\d{5}$/.test(num);
	return test;
};
const zipCodeLengthWrongMessage = "Zip code must be 5 digits";

//cvv 3 not digit number
const $cvvField = $("#cvv");
const cvvLengthWrong = num => {
	const creditSelected = $paymentOptionSelect.prop("selectedIndex") === 1;
	const test = creditSelected && !/^\d{3}$/.test(num);
	return test;
};

const cvvLengthWrongMessage = "CVV must be 3 digits";

const $form = $("form");
//errorMessages contains a message string for each possible error
const errorMessages = [
	nameFieldBlankMessage,
	nameCharsInvalidMessage,
	emailFieldInvalidMessage,
	noActivityMessage,
	creditNumberLengthWrongMessage,
	zipCodeLengthWrongMessage,
	cvvLengthWrongMessage
];
//labelSelector returns a jQuery selector that picks
//the parent to append the error message element to
const labelSelectors = [
	'label[for="name"]',
	'label[for="name"]',
	'label[for="mail"]',
	".activities legend",
	'label[for="cc-num"]',
	'label[for="zip"]',
	'label[for="cvv"]'
];
$form.on("submit", e => {
	//errors is truthy for each validation error, falsy if the error is not present
	const errors = [
		nameFieldBlank($nameField.val()),
		nameCharsInvalid($nameField.val()),
		emailFieldInvalid($emailField.val()),
		noActivitySelected(),
		creditNumberLengthWrong($creditNumberField.val()),
		zipCodeLengthWrong($zipCodeField.val()),
		cvvLengthWrong($cvvField.val())
	];
	//remove errors (unconditional to prevent multiple errors showing on repeated form submission)
	removeErrorMessages();

	//loop through each possible error
	for (let i = 0; i < errors.length; i++) {
		//if the error exists
		if (errors[i]) {
			attachErrorMessage($(labelSelectors[i]), errorMessages[i]);
		}
	}

	//set bool for whether any error is present
	const errorPresent = errors.reduce(
		(err, possibleErr) => err || possibleErr,
		false
	);

	if (errorPresent) e.preventDefault();
});

/*************

Extra Credit: Real-time Error Message

**************/

const setErrorMessage = ($label, message) => {
	//if there is already a child error el, return that
	//after adding the message
	const existingChild = $label.children(".error")[0];
	if (existingChild) return $(existingChild).html(message);
	//create a child and attach and then return it
	return attachErrorMessage($label, message);
};

const clearErrorMessage = $label => {
	//if there is already a child error el, set to empty string
	const existingChild = $label.children(".error")[0];
	if (existingChild) $(existingChild).html("");
};

//if the #name input value has invalid chars, show real-time error indication
$("#name").on("input", e => {
	const charsInvalid = nameCharsInvalid(e.target.value);
	const $label = $('label[for="name"]');
	if (charsInvalid) {
		//if there are invalid chars, set the error message
		setErrorMessage($label, nameCharsInvalidMessage);
	} else {
		//clear error message without wiping div for later reuse
		clearErrorMessage($label);
	}
});
