FROM mongo

COPY flights.json .
CMD mongoimport --host mongodb --db test --collection flights --drop --type json --file ./flights.json --jsonArray