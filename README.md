# covid-aws

Lambda consumes data from Covid 10 project (covidtracking.com) and saves JSON file in S3 bucket.
A Cloud Watch schedule is setup to run the lambda daily. 

Quick Sigght dashboards can be setup to visualize the covid data however that is not part of this exercise. 

CW schedule CRON expression : 0 10 * * ? *

<img src="https://github.com/nyalavarthi/covid-aws/blob/master/cw-schedule.PNG">
