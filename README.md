<h1>Documentation</h1>

<br/>
<h2>1 Overview</h2>

MetroPress is an app template that powers the transformation of any WordPress website into a Windows Store App.
 
Building on the foundation of version 1 and the feedback from the community, version 2 has undergone major additions to its architecture that include:

 - Modularization – creates separatio of
   functions and enhances extendibility
 - WordPress.com Support – sites hosted
   on WordPress.com are now supported as
   well
 - Theme/Template System
   
    - Offers easy and flexible customization
    - Has a number of default color themes     and templates to choose   
   from
 - Live Tile Support – display new posts
   by pulling the WordPress website with
   a background task

MetroPress is primarily constructed using HTML5, WinJS, and Cascading Style Sheet (CSS).
<br/>
<br/>
<br/>
<h2>2 Features</h2>
MetroPress v2 offers the following set of features:

<table>
  <tr>
    <th>Functionality</th><th>Self-Hosted WordPress</th><th>Wordpress.com</th>
  </tr>
  <tr>
    <td>Recent Posts</td><td>Yes</td><td>Yes</td>
  </tr>
  <tr>
    <td>Posts by Category</td><td>Yes</td><td>Yes</td>
  </tr>
  <tr>
    <td>Pages</td><td>Yes</td><td>Yes</td>
  </tr>
  <tr>
    <td>Bookmarking</td><td>Yes</td><td>Yes</td>
  </tr>
  <tr>
    <td>Sharing</td><td>Yes</td><td>Yes</td>
  </tr>
  <tr>
    <td>Auto Fetch when scroll to the end</td><td>Yes</td><td>Yes</td>
  </tr>
  <tr>
    <td>Show Related Posts</td><td>Yes</td><td>Yes</td>
  </tr>
  <tr>
    <td>Show Comments</td><td>Yes</td><td>Yes</td>
  </tr>
  <tr>
    <td>Post Commenting</td><td>Yes</td><td>Yes <br/> Requires Client ID/Secret from Wordpress.com</td>
  </tr>
  <tr>
    <td>Live Tile</td><td>Yes</td><td>Yes</td>
  </tr>
  <tr>
    <td>Search</td><td>Yes</td><td>Yes</td>
  </tr>
</table>
<br/>
<br/>
<br/>
<h2>3 Building Your First MetroPress App Using Your WordPress Website</h2>
<h3>3.1 Download MetroPress</h3>

Download MetroPress from CodePlex: https://metropress.codeplex.com

<h3>3.2 Compile The VS Solution</h3>

Unzip the downloaded file, compile, and run the MetroPress solution in Visual Studio 2012 on your Windows 8 system. As you compile, it will bring up the MetroPress App, but it connects to http://ideanotion.net by default. 

<h3>3.3 Change It to Your Own Website</h3>

Open up **option.js** in the **js** folder, find http://ideanotion.net and replace it with your website’s URL.
 
If your WordPress site is self-hosted, make sure that you have the plugin JSON API installed - http://wordpress.org/extend/plugins/json-api/

<h3>3.4 Self-Hosted WordPress or WordPress.com</h3>

If WordPress is self-hosted, include only **wp.module.js** on line 6 and remove lines 19 to 22. 
If you WordPress is at WordPress.com, use **wpcom.module.js** instead, and remove lines 16 to 18. 

<h3>3.5 Update Page Title</h3>

Change the App Title to your own on **line 11**. Or if you wish to use an image instead, specify the image URL on **line 10**.

![image alt][1]


<h3>3.6 Add Categories, Pages, Most Recent Posts, and Bookmarks</h3>

Each item in the modules array (line 15) represents a module for the App to load.  
{name: wordpressModule, options: {apiUrl: ‘http://ideanotion.net’, title: “Pages”, categoryId: wordpersssModule.PAGES, pagesIds: [2, 546, 565]}}
The following sets up the categories and pages to display from your wordpress site.
<h4>3.6.1 Add Categories</h4>

Assign an array of category IDs to **categoryId**. For example: categoryIds: [3, 5, 19]
<h4>3.6.2 Add Pages</h4>

Assign **wordpressModule.PAGES** to **categoryId** and assign an array of page IDs to **pageIds**. For example: categoryId: wordpressModule.PAGES, pageIds: [2, 243, 33]

To find your pageIDs goto WordPress admin, when you edit your page the post ID is shown on the URL.
95![image alt][2]

<h4>3.6.3 Add Recent Posts</h4>

Assign **wordpressModule.MOSTRECENT** to **categoryId**. 
<h4>3.6.4 Add Bookmarks</h4>

Assign **wordpressModule.BOOKMARKS** to **categoryId**.<br/>
> **NOTE**: For WordPress.com hosted sites, use **slug** instead of ID.

<h4>3.6.5 Compile</h4>

**Compile your solution and run again to have your own Windows Store App!**
<br/>
<br/>
<br/>
<h2>4 Solution Breakdowns</h2>

This section will provide a brief breakdown of the Visual Studio solution for MetroPress v2. Whether you download the release version or directly sync from source on CodePlex, you will find a **trunk** folder that contains a **MetroPress.sln** file and a **MetroPress** folder. If desired, you may rename the solution file from MetroPress.sln to your own project name.
<img src="https://lh3.googleusercontent.com/qyIsZ3DdqC6otAYAvBSOWIDWnu8euqNaSWNaFk6fAscPiX7ZLLlhxvN8MtInwsCGjg9MxJEFL1eJlZMrAmxTcgb2des01OGLTTqrUYbAmIpiWktEnA08konYF4ZGk0glshE" />

You need Visual Studio 2012 to open the solution. Upon opening it, you will see the following files and folder:
<img src="https://lh4.googleusercontent.com/tyeE7S-ee7WZ7x-xrbthPDe11p1HVhxuKR6jbyhPvLeU45mld_00ROy-1GzVPddigugtkcuR4QH-fEbWy4ksCvU45GVieRsoWFbv-90asnt2uvODUVMEloZk8d6-6y9qvp4" alt=""/>
<img src="https://lh5.googleusercontent.com/8FvI8mRVLDZWkz74t7dX0AvgtY1dcqEutHpt9rEDVSWuahW55xuJjvwP2mw2L9XVXg10bNWwUJ9paO2WtxVQ5Z7ZzvRxTO4fl8U0v4rimYTt7fZvumhSmw-6Zxt1SToJnls" alt=""/>
<br/>
<h3>4.1 css folder</h3>

The css folder contains a default.css and a theme folder. **default.css** consists of the styles applied throughout the App that makes it look and behave consistently. 
 
Each CSS file in the themes folder defines a theme. A theme CSS file can either be imported in the default.css or be included in default.html at the root of the solution. More detail is provided in section 5.
<h3>4.2 images folder</h3>

The images folder stores the required images of the App, as well as any other custom images you might have. 
<h3>4.3 js folder</h3>

The js folder contains the core JavaScript files for the App. The main file that needs to be edited is **options.js** which is used for configuring the App.

 - default.js – starting point of the App 
 - hub.js – loads up hub.html and sets things up by calling functions defined in metropress.js (Section 4.2)  
 - liveTileTask.js – handles the support of live tiles 
 - metroPress.js – contains core logics of the application 
 - navigator.js – controls the navigational behaviors of the App 
 - options.js – configures the application and the modules (Section 4.3) 
 - share-source.js – handles the Sharing functionality  
<h3>4.4 modules folder</h3>

Modularization, introduced in v2, greatly enhances the extendibility of MetroPress. By convention, each folder in the modules folder represents a different module, each with its own CSS, JavaScript files, and HTML files. The modules to be used are specified in **options.js**. 
<h3>4.5 pages folder</h3>

The pages folder contains hub.html and about-flyout.html. 
<h4>4.5.1 Hub.html</h4>

The Hub page (**hub.html** and **hub.js**) handles all the modules included in the Hub (The main page).

 - Each included module is initialized when the application is first loaded.
 - Render() function is called whenever there is a change in layout or viewing mode (back and forward on page)
 - Update() function is called when there is navigational changes (back and forward of pages)
 - Refresh() function is called when the Refresh button is clicked

If you wish to extend or implement a new module, please refer to Section 4.1 Modules for details on implementation of a module that conforms to the Hub page’s requirement.

<h4>4.5.2 about-flyout.html</h4>

The file **about-flyout.html** is defined for the About page specified in the Settings Charm (Section 4.8).

<img src="https://lh5.googleusercontent.com/jydxo_w5FrYOSYvf8MiIHVr3sqfJhiGd4NlFWLjYCE1T8VA7727V9qlfkdHgO4qfMBH8nZVq0PpTrKMexekkDoQgkw6ajiMzMond-7ILqhB9vsNznWFxiqLR5ZPRnrXUMWo"/>

<h3>4.6 default.html</h3>

This is the default container page for the MetroPress App.
<br/><br/><br/>
<h2>5 Components</h2>

This section will provide details on the main feature components that constitute MetroPress. 
<h3>5.1 Modules</h3>

Modularization emphasizes separating the functionality of a program into independent, interchangeable modules, 
such that each contains everything necessary to execute only one aspect of the desired functionality. MetroPress 
modules are designed and developed following this paradigm. It represents a separation of concerns, and improves 
maintainability by enforcing logical boundaries between components.
 
Each module consists of its own HTML, CSS, and JavaScript files. A module serves two main purposes:

 1. Specifying the data source
 2. Determining how initialization
    happens, what and when content will
    be rendered, updated, refreshed, or
    called. Specifically, a module
    maintains its own data access,
    caching, and rendering of content.

Modules are selected in **options.js**. The main application (Hub page, Section 4.2) interacts with each module by 
a set of basic functions such as Render(), Update(), Refresh(), Cancel(), and other functions that handle Search and 
Live Tiles. To perform functions, each module needs to be instantiated with a specific task. **The application can include 
multiple instances of modules, each managing or manipulating module data in a different ways. For example, showing 
recent posts vs. showing pages of the website or producing YouTube playlist vs. pulling the latest videos**.

<img src="https://lh5.googleusercontent.com/QGlfthqwQtA1P73V9w6YqGWQLd2ZN2qnLIEr_5VZtv5wqnsHs8yBuTueTwxkqTLPsC1mmiD1RZ0m9dsmYfhDol1Rwa_SzCoP_t4zXOmsSGnkL0KpNr3jsr0zq6kzGSi0i_4" />

To implement a module that the Hub page consumes, one constructor and six methods must be implemented.

<table border=1>
  <tbody>
    <tr>
      <th>Method Name</th>
      <td>constructor(metroPress, options)</td>
    </tr>
    <tr>
      <th>Input Params</th>
      <td>metroPress – metroPress object<br />options – JSON object options</td>
    </tr>
    <tr>
      <th>Output</th>
      <td>None</td>
    </tr>
    <tr>
      <th>Desctiption</th>
      <td>Setup the module with the passed in options</td>
    </tr>
  </tbody>
</table>

<table border=1>
  <tbody>
    <tr>
      <th>Method Name</th>
      <td>render(elem)</td>
    </tr>
    <tr>
      <th>Input Params</th>
      <td>elem – the HTML element from Hub Page to render module content</td>
    </tr>
    <tr>
      <th>Output</th>
      <td>Promise Object</td>
    </tr>
    <tr>
      <th>Desctiption</th>
      <td>Create a promise object and render the HTML fragment or dynamically create HTML elements and append to “elem”.  This is call every time user navigates to the hub page</td>
    </tr>
  </tbody>
</table>

<table border=1>
  <tbody>
    <tr>
      <th>Method Name</th>
      <td>update(viewState)<br /></td>
    </tr>
    <tr>
      <th>Input Params</th>
      <td>viewState – Application View State<br /></td>
    </tr>
    <tr>
      <th>Output</th>
      <td>N/A<br /></td>
    </tr>
    <tr>
      <th>Desctiption</th>
      <td>Update the content (Grid/ListView) by fetching from data source or cached.  This is call onload or when viewState changes</td>
    </tr>
  </tbody>
</table>

<table border=1>
  <tbody>
    <tr>
      <th>Method Name</th>
      <td>refresh(viewState)<br /></td>
    </tr>
    <tr>
      <th>Input Params</th>
      <td>viewState – Application View State<br /></td>
    </tr>
    <tr>
      <th>Output</th>
      <td>N/A<br /></td>
    </tr>
    <tr>
      <th>Desctiption</th>
      <td>This is called when User click on the refresh command.  Clear the cached data, and update the content (Grid/ListView) by fetching from data source</td>
    </tr>
  </tbody>
</table>

<table border=1>
  <tbody>
    <tr>
      <th>Method Name</th>
      <td>cancel()<br /></td>
    </tr>
    <tr>
      <th>Input Params</th>
      <td>None<br /></td>
    </tr>
    <tr>
      <th>Output</th>
      <td>None<br /></td>
    </tr>
    <tr>
      <th>Desctiption</th>
      <td>This is when to hook up the search charm.  For example:<br />Windows.ApplicationModel.Search.SearchPane.getForCurrentView().onquerysubmitted = function(args) { … } <br /> <br />This is called when application is ready.</td>
    </tr>
  </tbody>
</table>

<table border=1>
  <tbody>
    <tr>
      <th>Method Name</th>
      <td>getLiveTileList()<br /></td>
    </tr>
    <tr>
      <th>Input Params</th>
      <td>None<br /></td>
    </tr>
    <tr>
      <th>Output</th>
      <td>None<br /></td>
    </tr>
    <tr>
      <th>Desctiption</th>
      <td>This is called from a background task in (Worker scope).  Fetch and return a list of data in this format:<br />{<br />imgUrl: “”<br />title : “”<br />}</td>
    </tr>
  </tbody>
</table>
  [1]: https://lh4.googleusercontent.com/9EXeWB41_clwNQILjpqcfqI9LunZoDd75XE6W3rC688-SZzyIQ7XMikuQAQf3tshG6dJ1n-_iUeqB6YOu_SrVdUqT5RWCPBvXk2KQr14L33e_h1yylAg0gMBRsc378Cmbbc
  [2]: https://lh6.googleusercontent.com/Fl-ah70aavCp2zG3ObCOnk2lE6Yz-9sDF_VLHZIXD0cxNEjzTLgSHBGppZwvXlPo9iTskQQG6qnpquK3lgCvvPtBYS0vXdibIvDDilq8D4llPjVs3U5nCinzBC8ca-TkGHQ
