1- add a section to a Readme
2- Create unit tests
3- place coments for the code
4- create a github ci/cd
5- husky
6- cron is not working
7- swagger'i duzgun bir yere koy
8- it should disconnect after seed
9- // TODO first ones never get cought
10- // TODO gps coordinate should be saves as coordinate
11- date must be with in 5 days
12- // TODO change location at weather aggregation
13- swagger'i bitir
14- place more eror codes (not found etc.) use HTTP ERRORCODES package
15- use geo spatial locations for mongodb
16- Readme, why i did simple cron job rather than event queue
17- make cron a child process
18 -weather forecast should be with date and time
19- TODO on init fetch the weather
20-add readme conventional commit




refresh mechanism =>
an approach about fetching these weathers there 2 approaches, either

checkDb periodically => if updated at is too old then fetch the id
this could work really well but it would made problems if the database grows bigger

2 option, create something like an event queue and register tracking ids to event queue and
fetch the ids from this event queue every 5 minutes periodically for the sake of this challenge i went for the simple approach and went for the first one

maximum 5 days in the future can be called with 3 hours interval




