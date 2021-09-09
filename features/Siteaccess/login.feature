Feature: Site login

Scenario: An unauthenticated acceses the site and is logged in
Given An unauthenticated user with a Yahoo profile is on the home page
When The user clicks the sign in link
Then The user is logged into the website

