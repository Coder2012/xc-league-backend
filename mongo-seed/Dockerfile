FROM mongo

COPY flights.json .
CMD mongoimport --host mongodb --db test --collection flights --type json --file ./flights.json --jsonArray