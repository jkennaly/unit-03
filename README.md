# Treehouse Techdegree unit-03

This project is to validate a complex html form, plus provide some features to simplify the entry process.

## On load

1. The name input field is given focus on load.

## During form entry

### Name field
1. If any characters other than numbers or letters or a ' or _ is typed into the name field, an error message appears indicating the form is failing validation.

### Job role

1. There is a hidden (by default, with Javascript enabled) field to enter a Job Role if the Other option is picked from the selector.

### T-Shirts
2. T-Shirt Color Selector is hidden until a T-Shirt Design has been chosen.
3. Because not all T-Shirt Designs come in all colors, once a design is chosen, the color selector and only the appropriate options are shown.

### Activities
4. A running total of the cost of the selected activities is shown at the bottom of the activities section.
5. Because some of the times of the activities overlap, activities that conflict with currently selected activities are disabled from selection.

### Payment Info
6. The Select Payment Method placeholder option is disabled, and the default option is Credit Card
7. There are two other payment methods: Paypal and Bitcoin, and the payment information is displayed only for the option indicated by the payment method selector.

## On form submission
All validation errors on form submission display feedback in red text inside the respective label/legend appropriate to the form part containing the validation error.

### Name field
1. Field is blank
1. Any characters other than numbers or letters or a ' or _

### Email field
1. Email format is not similar to "dave@teamtreehouse.com"

### Activities
1. No activities selected

### Only if Credit Card Payment Method selected
1. Credit Card Number is 13-16 digits
2. Zip code is 5 digits
3. CVV is 3 digits.