## Pipeline status:

[![api](https://github.com/dogabudak/parcellab/actions/workflows/workflow.yaml/badge.svg)](https://github.com/dogabudak/parcellab/actions/workflows/workflow.yaml)

refresh mechanism =>
an approach about fetching these weathers there 2 approaches, either

checkDb periodically => if updated at is too old then fetch the id
this could work really well but it would made problems if the database grows bigger

2 option, create something like an event queue and register tracking ids to event queue and
fetch the ids from this event queue every 5 minutes periodically for the sake of this challenge i went for the simple approach and went for the first one

There are 2 endpoints in this application, maximum 5 days in the future can be called with 3 hours interval

Dont forget to write which type the data is (celcius ? percipation etc ? ? )

Used another weather app since it was easier to use (this is )

Picked typescript as the language because it is like node but with types, i did not go with types extensively https://github.com/dogabudak/parcellab

Testing is not so tidy, since i did not speand so much time, mock and stubs and spies are everywhere

Not taking care of timezone

conventional commit

why did i use a different api

Explain 2 end points and the logic behind the cron job
