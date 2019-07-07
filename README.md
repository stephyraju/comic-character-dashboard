  # Comic Character Dashboard
  
  Data Visualisation Project for the second Milestone project of Code Institute's Diploma in Full-Stack Development.
  
  The single page datadashbord presents the original data from 'FiveThirtyEight Comic Characters Dataset' in a way that users can easily understand and analyse the content.
  
  The site uses Javascript libraries D3.js, Dc.js and Crossfilter.js to present the barchart,piechart ,scatterplot and a table which has all the list of characters.
  
 # UX
 
 This website is for people who are intersested in comic characters, this will help them to find some interesting  information about their 
 favorite characters.
 Using D3, Dc, and Crossfilter, all charts (except scatter plot) will filter the required data for the user.
 
### User Story
 
 * As a user 
    - I want to get all the comic character data in a single page.
    - I want to analyse and compare the data easily.
    - I want to find the specific features of characters and find my own conclusions.
    - I want to understand the intersesting features among the characters like how the relate with eye color,haircolor and align.
    - I want to filter the data and reset it for easy use.


### Wireframes

These wireframes were created using [Balsamiq](https://balsamiq.com/) during planning process for this project.



 
### Features

#### Existing Features

1. Information Modal
    
   *The modal pops up when open the page, which has brief information about the dashboard.The user can close it either 
using the button at the bottom or the 'x' mark on the top right.
   *The user can open the information modal by clicking the information icon on the navbar too.
2. Reset 
   *  There is one reset (redo icon)on the right side of navbar which can reset all the charts.
   *  Moreover Reset option is given for some charts too, when chart is clicked, the reset link will appear which allows user to reset the filters from the selected chart and also other charts.
  
3. Navbar 
   
    * The navbar is fixed on the top.
    * The navbar contains the title of the site, a reset icon that when clicked, resets all the filters back to their default values and also an information icon that opens the modal if clicked on that.
    
4. Gender Icon
   
    * The gender icons are displayed with the percentage of characters in each gender and the number changes as the user filter the charts.
    
5. Pie charts
    
    *There is one piechart and two doughnut charts which displays different data.
     The Piechart shows the identity whereas the donughts shows Eye color and Hair color.
     The user can filter the data by clicking on each slices.

6. Bar charts
    
    *The stacked bar graph explains the the genderbased alignment.Like other chart user can filter the data 
to make a deeper understanding about characters.
   
    *The bar graph displays the live status of characters.The user can filter data here as well. 
  
7. Scatter plot
  
   * Scatterplot shows the characters year of first appearance and the number of appearance in comic books.

8. Table 
  
  * The table has all the comic caharacters name,urslug and the first appearance.
  * Table has pagination and displays 100 rows in one page and has Next and Prev button which will help to 
    go forward and backword.

9. Footer
   
  * A simple footer with copyright notice on the left and return icon on the right.When you click on the reurn icon 
    you will reach back to the top of the site.
  

#### Features Left to Implement









  ### Technologies Used
  
  * This project uses HTML5 and CSS3 programming languages.
  
  * AWSCloud9 - This developer used Cloud9 for their IDE while building the website.
  
  * BootstrapCDN

The project uses Bootstrap4 to simplify the structure of the website and make the website responsive easily.

The project also uses BootstrapCDN to provide icons from FontAwesome.

 * Bootswatch

Bootswatch 3.4.1 (Sandstone theme for bootstrap 3) was used to build responsive grid structure for the site and for CSS styling.

 * Popper.js

The project uses Popper,js reference Javascript needed for the responsive navbar.

* Javascript

  - This project uses Javascript and Javascript Libraries for building the charts.The libraries used are 
   as follows 

      - D3.js (version 3.5.17)
      - Dc.js (version 2.1.8)
      - Crossfilter.js (version 1.3.12)
 
  - jQuery (version 3.4.1)

       The project uses jQuery to simplify traversing the DOM and displaying different parts of the data and the Modal.
        
 - D3-queue.js 

    This will load the json data fully before running other files.
               
* Font Awesome

    Font Awesome was used for number display icons, info icon and redo icon.     
    
* Balsamiq

   Balsamiq was used for creating the wireframes.
   
* Git $ GitHub

   Git used for the Version control and GitHub used as hosting service for Git Repositories of this site.
 
### Testing

Testing information can be found in [testing.md]() file
           
### Deployment

The site was developed using the [cloud9 IDE](https://aws.amazon.com/cloud9/?origin=c9io) and uses git for version control and pushed to GitHub.


  To deploy dashboard to GitHub Pages from its GitHub repository([https://github.com/stephyraju/comic-character-dashboard](https://github.com/stephyraju/comic-character-dashboard)), I followed these steps:
   * Log into GitHub.
   * From repositories I selected **Comic Character Dashboard**.
   * Then I selected **settings** from the menubar.
   * Scroll down to the page, on the  **Source** click the drop-down menu and select **Master Branch**.
   * The Comic Character Dashbord is now diployed and can found here :[ https://stephyraju.github.io/comic-character-dashboard/.](https://stephyraju.github.io/comic-character-dashboard/.)
