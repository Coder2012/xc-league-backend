# xc league backend

Cleaning up the db by year

```
db.flights.remove({date: {$gte: new Date('2006-01-01T00:00:00.000+00:00'), $lte: new Date('2006-12-30T00:00:00.000+00:00')}});
```
