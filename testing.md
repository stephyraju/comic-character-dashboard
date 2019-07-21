## Comic Character Dashbord Testing details

[Main README.md file](https://github.com/stephyraju/comic-character-dashboard/blob/master/README.md)

[View Comic Character Dashbord here!](https://stephyraju.github.io/comic-character-dashboard/)


### Automated Testing

##### Validation Services

 Validation services were used to ensure the the validity of the website code.

- [W3C Markup Validation Service](https://validator.w3.org/): No errors or warnings found.
- [W3C CSS Validation Service](https://jigsaw.w3.org/css-validator/): No errors or warnings found.
- [JSHint](https://jshint.com/): Metrics from my graph.js file:There are 33 functions in this file.

Function with the largest signature take 3 arguments, while the median is 1.

Largest function has 14 statements in it, while the median is 3.

The most complex function has a cyclomatic complexity value of 3 while the median is 1.

Six undefined variables
12	queue
13	d3
17	crossfilter
23	appearance
41	dc
343	$



### Manual Testing

The dashboard was tested throughout development on all the major browsers using the developer tools and also testing on individual devices. 
After adding each chart and new functionality testing was performed.

The responsiveness and correct displaying of all elements has been tested on a number of devices, browsers, and resolutions after adding all the charts and was displaying everything well.

All the charts were positioned correctly on the page in both desktop,tablet and mobile.
    
### Custom Functions
    
The data is sourced from [Kaggle](https://www.kaggle.com/explore-projects),[FiveThirtyEight Comic Characters Dataset
Explore Data from FiveThirtyEight](https://www.kaggle.com/fivethirtyeight/fivethirtyeight-comic-characters-dataset).
    
The original data is in .csv format and the developer changed the data in .json format using a [Convert CSV to JSON](http://www.convertcsv.com/csv-to-json.htm) application,
for more convenience.

To make short labels on thge chart, the developer renamed few columns (e.g.'female characters' renamed to 'female')
    
Some features of the characters were blank in the original data as it was unknown.The developer chose to filter out the balnked data
using functon 'remove_blanks(group, value_to_remove)'.This function was working for the charts.
    
For checking the functionality of 'remove_blanks' I manually counted few data and also checked by adding a console.log to the script after each chart is drawn.
This was showing the number of empty data for each chart.
 
### Known Bugs    

In the console, "Error: <path> attribute transform: Trailing garbage, "…00.961538461537,NaN) was poping up. Since everything works correctly, I ignored this error.
    
#### jQuery Tests

jQuery is used in 2 areas of the website. To reset the filters, and in the next and prev buttons in pagination. 
Both of these have been tested and work 100% and without errors.
    
    
    

