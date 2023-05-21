## E2E Tests for Bookbeat Categories

Smoke tests for bookbeat.se categories page and functionality
https://www.bookbeat.se/kategorier

Test written with Cypress
https://docs.cypress.io/

Requirements: 
- Latest version of Node

Install Cypress and run tests:
```bash
# Install Cypress
npm install cypress --save-dev

# Run
npm run cypress:open
```

## Test Notes

### Exploratory test

Main Category page
- 20 categories listed
- Responsive design

Click on a category to get to category sub-page
- see title card - header, description, visa mer (dissapears)
- breadcrumb
- filter
	- format
		- on/off - can have both one or neither (both = neither)
	- language
		- none (all), one, several, all (none = all)
- sub-categories
	- add to breadcrumb
- sorting
	- default - popularity
	- highlight what is clicked - ui updates
- responsive
	- can collapse sub- categories, filters, sorting

Click on language
- no description
- no language filter

**Notes**
- filter ui is a bit clunky
- no easy clear filter
- lose filters when switching categories
- change filter resets pagination
	- new request every-time

### Test Strategy
- main functionality is filters and sorting
- check content on page? or verify GET requests?
- only way to verify full e2e is to check content - but it's flaky - check api request confirm that filters, etc are working as expected
- chose combination of verifying GET requests and content that was not likely to change

### Tests
- visit main page ✅
	- title
	- 20 categories ✅
- click on category ✅
	- check title ✅
	- description
	- breadcrumb updates
- choose filters (format and language)
	- confirm correct content ✅
	- pick a  category, filters remain ✅
- change sorting, choose category ⛔️
	- breadcrumb updates
	- selected sorting highlights
	- sorting remain
- visit category page on mobile ⛔️
	- hide and show filters, sorting, categories
- visit language ⛔️
	- language filter not displayed

**Notes**
- would have liked to test mobile viewport because of difference in functionality
- need to set up page object model for test visibility, perhaps some aliases to re-use selector - need to learn how to do best in cypress