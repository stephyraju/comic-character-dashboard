  # Comic Character Dashboard
  
  **Milestone Project 2: Interactive Frontend Development**
 
 
  The single page datadashbord illustrates the original data from ['FiveThirtyEight Comic Characters Dataset'](https://fivethirtyeight.com/features/women-in-comic-books/) in a way that users can easily understand and analyse the content.
  
  The page uses Javascript libraries D3.js, DC.js and crossfilter.js in order to present interconnected and dynamic graphs. 
  
  The site contains barcharts, piecharts, scatterplot and a table which has all the list of characters. All the charts are connected
  and presented in a way that the users can easily analyse the data and get the required information.
  
  The current deployed version can be accessed at: [https://stephyraju.github.io/comic-character-dashboard/](https://stephyraju.github.io/comic-character-dashboard/)

### Contents Table

1. **[UX](#UX)**

2. **[User Story](#User-Story)**

3. **[Wireframes](#Wireframes)**

4. **[Features](#Features)**
   * Existing Features
   * Features Left to Implement

5. **[Technologies Used](#Technologies-Used)**

6. **[Testing](#Testing)**

7. **[Deployment](#Deployment)**

8. **[Credits](#Credits)**
    * Source
    * Code
    * Acknowledgements
    * Disclaimer


 ## UX
 
This website is for people who are intersested in comic characters, this will help them to find some interesting  information about their 
favorite characters.

Using D3, Dc, and Crossfilter, all charts (except scatter plot) will filter the required data for the user.

The dashboard offers short cuts to reset all data with icons. The user will then be led to the relevant section via smooth scrolling.

For ease of navigation, the top section and also each graph (except scatterplot) has reset icon or reset button, as well as a 'back to top' arrow at the bottom of the page.


     
### User Story
 
 * As a user 
    - I want to get all the comic character data in a single page.
    - I want to analyse and compare the data easily.
    - I want to find the specific features of characters and find my own conclusions.
    - I want to understand the intersesting features among the characters like how the relate with eye color,haircolor and align.
    - I want to filter the data and reset it for easy use.


### Wireframes

These wireframes were created using [Balsamiq](https://balsamiq.com/) during planning process for this project.

 * [Desktop Wireframes](https://github.com/stephyraju/comic-character-dashboard/blob/master/wireframe/large.png)
 
 * [Tablet Wireframes](https://github.com/stephyraju/comic-character-dashboard/blob/master/wireframe/ipad.png)

 * [Mobile Wireframes](https://github.com/stephyraju/comic-character-dashboard/blob/master/wireframe/mobile.png)

 
### Features

#### Existing Features

1. Information Modal
    
   * The modal pops up when open the page, which has brief information about the dashboard. The user can close it either 
using the button at the bottom or the 'x' mark on the top right.
   * The user can open the information modal by clicking the information icon on the navbar too.
2. Reset  

   *  There is one reset (redo icon) on the right side of navbar which can reset all the charts.
   *  Moreover Reset option is given for some charts too, when chart is clicked, the reset link will appear which allows user to reset the filters from the selected chart and also other charts.
  
3. Navbar 
   
   * The navbar is fixed on the top.
   * The navbar contains the title of the site, a reset icon that when clicked, resets all the filters back to their default values and also an information icon that opens the modal if clicked on that.
    
4. Gender Icon
   
   * The gender icons are displayed with the percentage of characters in each gender and the number changes as the user filter the charts.
    
5. Pie charts
    
   * There is one piechart and two doughnut charts which displays different data.
     The Piechart shows the identity whereas the donughts shows Eye color and Hair color.
     The user can filter the data by clicking on each slices.

6. Bar charts
    
   * The stacked bar graph explains the the genderbased alignment.Like other chart user can filter the data 
     to make a deeper understanding about characters.
   
   * The bar graph displays the live status of characters.The user can filter data here as well. 
  
7. Scatter plot
  
   * Scatterplot shows the name of the character, year of first appearance and the number of appearance in comic books.

8. Table 
  
   * The table has all the comic caharacters name,url slug and the first appearance.
   * Table has pagination and displays 100 rows in one page and has Next and Prev button which will help to 
     go forward and backward.

9. Footer
   
   * A simple footer with copyright notice on the left and return icon on the right.When you click on the reurn icon 
    you will reach back to the top of the site.
  

#### Features Left to Implement

   * Additional page with character information

      I would like to add an additional page with detailed information on the characters in future.
   
   * Link to website 

      I would like to link the url in the table to the respective webpages.


### Technologies Used
  
  * This project uses [HTML5](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5) and [CSS3](https://www.w3.org/Style/CSS/) programming languages.
  
  * [AWSCloud9](https://aws.amazon.com/cloud9/) - This developer used Cloud9 for their IDE while building the website.
  
  * [BootstrapCDN](https://www.bootstrapcdn.com/)

    The project uses Bootstrap4 to simplify the structure of the website and make the website responsive easily.
    The project also uses BootstrapCDN to provide icons from FontAwesome.

 * [Bootswatch](https://bootswatch.com/3/)

    Bootswatch 3.4.1 (Sandstone theme for bootstrap 3) was used to build responsive grid structure for the site and for CSS styling.

 * [Popper.js](https://popper.js.org/)

    The project uses Popper,js reference Javascript needed for the responsive navbar.

* [Javascript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

  - This project uses Javascript and Javascript Libraries for building the charts.The libraries used are 
   as follows 

      - [D3.js](https://d3js.org/) (version 3.5.17)
      - [Dc.js](https://dc-js.github.io/dc.js/) (version 2.1.8)
      - [Crossfilter.js](http://square.github.io/crossfilter/) (version 1.3.12)
 
  - [jQuery](https://jquery.com/) (version 3.4.1)

    The project uses jQuery to assist with DOM manipulation when resetting filters and to display the Modal.
        
  - [D3-queue.js](https://github.com/d3/d3-queue) 

    This will load the json data fully before running other files.
               
* [Font Awesome](https://www.bootstrapcdn.com/fontawesome/)

    Font Awesome was used for number display icons, info icon, redo icon and back to top icon.     
    
* [Balsamiq](https://balsamiq.com/)

    Balsamiq was used for creating the wireframes.
   
* [Git $ GitHub](https://github.com/)

    Git used for the Version control and GitHub used as hosting service for Git Repositories of this site.
 
### Testing

Testing information can be found in [testing.md](https://github.com/stephyraju/comic-character-dashboard/blob/master/testing.md) file
           
### Deployment

The site was developed using the [cloud9 IDE](https://aws.amazon.com/cloud9/?origin=c9io) and uses git for version control and pushed to GitHub.


  To deploy dashboard to GitHub Pages from its GitHub repository([https://github.com/stephyraju/comic-character-dashboard](https://github.com/stephyraju/comic-character-dashboard)), I followed these steps:
   * Log into GitHub.
   * From repositories I selected **Comic Character Dashboard**.
   * Then I selected **settings** from the menubar.
   * Scroll down to the page, on the  **Source** click the drop-down menu and select **Master Branch**.
   * The page is automatically refreshed and ready for deployment, it can take up to 5 minutes for it to be viewable.
   * The Comic Character Dashbord is now diployed and can found here :[ https://stephyraju.github.io/comic-character-dashboard/.](https://stephyraju.github.io/comic-character-dashboard/.)


### Credits
##### Content

All the text contents in the website is written by the developer.

##### Source

The original data is sourced from [kaggle](https://www.kaggle.com/explore-projects), and here is the link:[https://www.kaggle.com/fivethirtyeight/fivethirtyeight-comic-characters-dataset](https://www.kaggle.com/fivethirtyeight/fivethirtyeight-comic-characters-dataset).

To make the data easier to work with, the .csv file from kaggle.com was converted to a json file.

##### Code

  - Code for the pagination was sourced from [Steemit](https://steemit.com/utopian-io/@faad/tutorial-13-dive-into-dc-js-a-javascript-library-data-table-pagination).
  - I was helped out from stackoverflow for using a 'sortBy' function properly in datatable.
  - I used [tutorialspoint](https://www.tutorialspoint.com/dcjs/index.htm) to learn more about dc charts.
 

The code learned from the tutorials were used as help and guidance to be interpreted in a different and unique way.

##### Acknowledgements

A huge thanks to Code Institute Mentor Guido Cecilio for his time and support in explaining, demonstrating and giving constructive feedback for this project.

######  Disclaimer

The content of this website are for educational purposes only.