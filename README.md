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

MetroPress v2 currently includes two types of modules that can be instantiated: one that supports WordPress.com hosted websites and the other for self-hosted WordPress websites. 

<h4>5.1.1 Modules – WordPressComModule</h4>

The WordpressComModule works with any WordPress.com website.  An instance of this module can display the following: 
Most Recent Posts, Pages, Posts by a category, or bookmarked posts. The module can be initialized to handle Search and 
Live Tile as well.
 
In options.js, instance of module can be configured by these parameters:
<table border=1>
  <tbody>
    <!-- Results table headers -->
    <tr>
      <th>Options Parameter </th>
      <th>Description</th>
    </tr>
    <tr>
      <td>title	</td>
      <td>Title to display in the Hub Page on top of its GridView<br />If categoryId is set to wordpresscomModule.PAGES, title will not be displayed.</td>
    </tr>
    <tr>
      <td>siteDomain</td>
      <td>User’s WordPress.com site domain URL.  Do not include “http://” prefix.  <br />i.e. (metropress.wordpress.com)</td>
    </tr>
    <tr>
      <td>categoryId</td>
      <td>Defines the category this module will fetch from user’s WordPress.Com website.  Use category slur in string (i.e. “Tech”)<br /> <br />Or, use of the predefined values:<br />wordpresscomModule.PAGES:  pages<br />wordpresscomModule.BOOKMARK: bookmarked pages or posts<br />wordpresscomModule.MOSTRECENT: most recent posts</td>
    </tr>
    <tr>
      <td>pageIds</td>
      <td>Array of page ID to fetch from user’s WordPress.com website.  This is only applicable if categoryId = wordpresscomModule.PAGES.<br /> <br />i.e. ([1,2,8])</td>
    </tr>
    <tr>
      <td>clientId</td>
      <td>In order to allow user to post comment to user’s WordPress.com website, a WordPress Application Client ID/Secret must be generated and provided here.<br /> <br />See this link on how to create Client ID/Secret:<a href="https://developer.wordpress.com/apps/new/">https://developer.wordpress.com/apps/new/</a></td>
    </tr>
    <tr>
      <td>clientSecret</td>
      <td>See above.</td>
    </tr>
  </tbody>
</table>

<h4>5.1.2 Module – WordPressModule (Self-hosted)</h4>

The WordpressModule works with any self-hosted WordPress website. The WordPress website must have already install 
the <a href="http://wordpress.org/extend/plugins/json-api/installation/">JSON API plugin</a> in order for MetroPress to interact with. An instance of this module can display the following:  
Most Recent Posts, Pages, Posts by a category, or bookmarked posts. The module can be initialized to handle Search and 
Live Tile as well.

In options.js, instance of module can be configured by these parameters:

<table border=1>
  <tbody>
    <!-- Results table headers -->
    <tr>
      <th>Options Parameter </th>
      <th>Description</th>
    </tr>
    <tr>
      <td>title	</td>
      <td>Title to display in the Hub Page on top of its GridView<br />If categoryId is set to wordpressModule.PAGES, title will not be displayed.</td>
    </tr>
    <tr>
      <td>apiURL</td>
      <td>User’s self-hosted WordPress website URL.  Please use full url in this format “http://www.ideanotion.com/”</td>
    </tr>
    <tr>
      <td>categoryId</td>
      <td>Defines the category ID this module will fetch from user’s website.  Use category id in integer type format (i.e. 6)<br /><br />Or, use of the predefined values:<br />wordpressModule.PAGES:  pages<br />wordpressModule.BOOKMARK: bookmarked pages or posts<br />wordpressModule.MOSTRECENT: most recent posts</td>
    </tr>
    <tr>
      <td>pageIds</td>
      <td>Array of page ID to fetch from user’s WordPress.com website.  This is only applicable if categoryId = wordpresscomModule.PAGES.<br /><br />i.e. ([1,2,8])</td>
    </tr>
  </tbody>
</table>

<h3>5.2 Hub Page</h3>

The Hub Page (~/pages/hub.html) is the landing page when the application launches. **hub.js** will initialize each 
module, and trigger the module to render and update its content on the Hub Content Area. 
<img src="https://lh4.googleusercontent.com/5FdqJeH5Vz1BRYarILdN34XnAS0Fnb-BtCoXSYLV0OM0_P26i4Wl9AvcxYalFBWgeraoCIfXnx8vWOpIg9gWzEMIWoYLBeHTtU4YaK5DSD4apZ-1mNiF-zYrlrNQz7vWatc"/>

<h3>5.3 Options.js</h3>

The application and modules are setup in options.js. It imports the module JavaScripts and sets all the options. It is essential to understand options.js in order to correctly setup MetroPress.

<table border=1>
  <tbody>
    <!-- Results table headers -->
    <tr>
      <th>Options Parameter </th>
      <th>Description</th>
    </tr>
    <tr>
      <td>appTitleImage</td>
      <td>Title Image Url ;  If specified, it will ignore the appTitle parameter<br /></td>
    </tr>
    <tr>
      <td>appTitle	</td>
      <td>Title text</td>
    </tr>
    <tr>
      <td>cacheTime</td>
      <td># of Minutes to keep the cached data<br /></td>
    </tr>
    <tr>
      <td>mainUrl</td>
      <td>Main Url to share when user click the Share Charm in the hub page<br /></td>
    </tr>
    <tr>
      <td>privacyUrl</td>
      <td>Url for the privacy page, launch from Settings Charm<br /></td>
    </tr>
    <tr>
      <td>modules</td>
      <td>See module options section below<br /></td>
    </tr>
    <tr>
      <td>searchModule</td>
      <td>See module options section below<br /></td>
    </tr>
    <tr>
      <td>liveTileModule</td>
      <td>See module options section below</td>
    </tr>
  </tbody>
</table>

<h3>5.4 Images</h3>

The following are the default set of images for the App.

<table border=1>
  <tbody>
    <!-- Results table headers -->
    <tr>
      <th>File name </th>
      <th>Dimension</th>
      <th>Purpose</th>
    </tr>
    <tr>
      <td>background.png</td>
      <td>Varies</td>
      <td>Background image of the app.  A good resolution will be 1920 by 1080.  If you want to enable the scrolling background effect, use a double wide background such as 3840 x 1080 or higher<br /></td>
    </tr>
    <tr>
      <td>badgelogo.png	</td>
      <td>24x24px</td>
      <td>Badge icon on Win8 start screen<br /></td>
    </tr>
    <tr>
      <td>blank.png	</td>
      <td>Varies</td>
      <td>Default background when no featured image<br /></td>
    </tr>
    <tr>
      <td>logo.png	</td>
      <td>150x150px</td>
      <td>The default app logo<br /></td>
    </tr>
    <tr>
      <td>smalllogo.png	</td>
      <td>30x30px</td>
      <td>Smaller dimension of the default app logo<br /></td>
    </tr>
    <tr>
      <td>splashscreen.png </td>
      <td>620x300px</td>
      <td>Image for the splash screen<br /></td>
    </tr>
    <tr>
      <td>storelogo.png	</td>
      <td>50x50px</td>
      <td>Logo displayed in Windows Store<br /></td>
    </tr>
    <tr>
      <td>widelogo.png	</td>
      <td>310x150px</td>
      <td>Large icon on Win8 start screen</td>
    </tr>
  </tbody>
</table>

<h3>5.5 Search Charm</h3>

Both modules can be configured in options.js to handle Search Charm.  When user enters a query into the search charm, 
the application navigates to the module’s search page displaying the results.
<img src="https://lh5.googleusercontent.com/k5BplnZ_axmFdZUCudlLS5cfsd6j78UqoE64JEFLrC7ED2lhwH1vJ8BxkP42zvZ8VfxxVnhq6FonRYP0tE9V-5xH9X5SbFcAAhX45ScqHHtAJsEHL9Ns4TBAqlr12PXMW3w"/>

<h3>5.6 Share Charm</h3>

Share Charm is handled by MetroPress. The default behavior is to share the mainUrl defined in options.js. This is useful 
in hub page or other pages that doesn’t have content to share. However, a module can override that behavior if the page 
has a special Div element:

```html
<div class="mp-share" title="this is the title" permalink="http://blah.com">
 This is the description...
</div>
```

The Share Charm will use the title, permalink and div inner Html as description. The class mp-share will by default keep
the element hidden.
<img src="https://lh5.googleusercontent.com/ugtlonHlJC3ekeOGhXL9pPLRLI_5r_QALjjxDj7Ri8gf-yHllrTVNYagceJi8fbKtAsLUr8jtNn-bdKjhaoasScs_uWbEV2OFlTmv2cJXAqG9m1VA5lFZFJp3RI4tXRyJf0"/>

<h3>5.7 Live Tiles</h3>

Live Tiles is improved in version 2 by using background task to update the tile. Both modules can be configured in 
options.js to handle Live Tiles. Live tiles will show the latest 5 posts. This is the general flow:
<img src="https://docs.google.com/a/ideanotion.net/drawings/d/smfSlZM0F1W2FNP_HcLY84w/image?w=648&h=129&rev=1&ac=1"/>

<h3>5.8 Settings Charm</h3>

Two menu items were added to the Settings Charm.  

 * About Us flyout defined in /html/About-flyout.html
 * Privacy Policy will launch Internet Explorer to display the privacy URL defined in options.j
<img src="https://lh4.googleusercontent.com/ygRjJ9PgRcuRBxgdiWMUYaxXRShjlCCUEYJV1tqCi720YfJuWawrFCp63FU_ca6JK4IJWwTv5sMd69tI6_xu0kST9sqRA4MzAH2KtZKY_PtN5SL77NCwTLajKOhfnEdOWLw"/>

<h3>5.9 Bookmarking</h3>

User can bookmark any post or page to view it at a later time.  Bookmarked items will only be shown at the Hub page if one instance of the module is configured as Bookmark type. 

<img src="https://lh5.googleusercontent.com/6GHnowLmHi04SqgFfFeIhKCRs4SJ_eN3IHEJFdDGdSLvdiUd3csuhB_yUY25LERdsxRs0sshmAtRa2jz2Yg2kuegVnHQE5n5uNVuSrClo4e4TQp_Lo0IVdUCa8TcQPtETas"/>

<h3>5.10 LocalStorage Caching</h3>

MetroPress and modules utilize LocalStorage to cache data to improve performance, and allow off line access. The modules stored fetched posts, and pages into localStorage along with a timestamp.  When loading from localStorage, the timestamp is used to check if it exceeded the CacheTime set by the options.js.

During development, one may need to flush the cache, and the quickest way is to increment the localStorageSchemaVersion.  This will clear the EVERYTHING from the localStorage when the application launches.

```javascript
var metroPress = {
   // Change Storage Version to empty the local storage
   localStorageSchemaVersion: '20130101-1',
   modules: [],
   initialized: false,
   accessToken: null,
}
```

<h2>6 Theme Customization</h2>
The CCS styling rules govern the look and feel of MetroPress. It is important that the theme system is easy-to-customize and flexible. The CSS files are organized into four separate groups.  

<table border=1>
  <tbody>
    <!-- Results table headers -->
    <tr>
      <th>Type </th>
      <th>Path</th>
      <th>Description</th>
      <th>Extendable</th>
    </tr>
    <tr>
      <td>Application</td>
      <td>/css/default.css	</td>
      <td>Default elements such as typography, Size, common controls, and other non-theme-able elements.	</td>
      <td>No</td>
    </tr>
    <tr>
      <td>Theme</td>
      <td>/css/themes/custom.*.css	</td>
      <td>Theme elements such as font, colors, background colors, background images	</td>
      <td>Yes</td>
    </tr>
    <tr>
      <td>Module</td>
      <td>/modules/css/*.css	</td>
      <td>Module specific styling	</td>
      <td>No</td>
    </tr>
    <tr>
      <td>Template</td>
      <td>/modules/css/templates/*.css	</td>
      <td>Defines the main Grid View layout template  	</td>
      <td>Yes</td>
    </tr>
  </tbody>
</table>

<h3>6.1 Application-Specific CSS: Default.css</h3>

Default.css defines the positioning, layout of the application, common controls, and HTML elements.  Default.css have 
rules specific to different application View State (i.e. snapped). Default.css is less likely to be modified, it is 
recommended that styles are changed in **Theme CSS**.

<h3>6.2 Theme CSS: Custom.*.css</h3>

The theme CSS defines the colors, font, and background of a MetroPress App. It also defines CSS classes and common 
HTML elements such as &lt;1> to &lt6>, &lt;a>, &lt;body>, etc;.  

Few default themes were provided: custom.light.css, custom.dark.css, and custom.orange.css. They are a good starting 
place to extend and customize your own MetroPress application.

To choose one of the default themes, open default.css and find the import statement at the beginning of the file.  
Then change the file name to apply a different theme:

```css
@import  url('themes/custom.light.css');
```
This is a breakdown of CSS classes that custom.*.css must define:

<table border=1>
  <tbody>
    <!-- Results table headers -->
    <tr>
      <th>CSS Class Name </th>
      <th>Description<br /></th>
    </tr>
    <tr>
      <td>.mp-color-header	</td>
      <td>Default font color for header and &lt;1> to &lt;6></td>
    </tr>
    <tr>
      <td>.mp-color-text	</td>
      <td>Default font color for text and body text<br /></td>
    </tr>
    <tr>
      <td>.mp-color-title	</td>
      <td>Default font color for title used by modules<br /></td>
    </tr>
    <tr>
      <td>.mp-color-subtitle	</td>
      <td>Default font color for sub-title used by modules<br /></td>
    </tr>
    <tr>
      <td>.mp-color-link	</td>
      <td>Default font color for links <a><br /></td>
    </tr>
    <tr>
      <td>.mp-bg-main	</td>
      <td>Default background color for the main application<br /></td>
    </tr>
    <tr>
      <td>.mp-bg-overlay	</td>
      <td>Default background color for the Grid text overlay<br /></td>
    </tr>
    <tr>
      <td>.win-backbutton	</td>
      <td>Back button color</td>
    </tr>
  </tbody>
</table>

**Theme Custom.*.css Colors Diagram**

<img src="https://lh6.googleusercontent.com/UZO8SX-6FrRMgjDkoVdhybmeb0SY2rC29uAJ0QuVSHpk05bDYl3Tc8Yg7vzSYJngUDaBvYQ0hL0KBmPxXMsGoRqici36Dvc_k5_Xa6c7npmIjseTQBZoyf-ZIKB5754sk9c"/>
<img src="https://lh5.googleusercontent.com/wYN3_DH93pzhY7zwgEUl9-dLIX1l8kHbhbnwys3_ZskuM1cPap3ye400cFhRYS7qtrEYfL0RHPAw2efoA-sotnnw0PZ1IupTrOgPjMTC6NlZUKMeCplGy3zTCROzpLUMOLs"/>

<h3>6.3 Module Specific CSS</h3>

These CSS defines the overall module styling and such as positioning of various controls and elements.  They are located
at folder **~/modules/{module name}/css**

<h3>6.4 Module Template CSS</h3>

MetroPress uses ListView (GridView) to group and display WordPress posts and pages into tiles. GridView is highly 
customizable through CSS, and can easily achieve different looks by changing CSS rules. The CSS rules that control the 
layout of the GridView were extracted into Template CSS. They are located in folder **~/modules/{module name}/css/
templates**

Three default templates were provided: normal.css, large.css, and wide.css. To choose a template, open **modules/<module 
name>/css/<module name>.module.css**. Then locate the import statement at the beginning of the file.  Change the file path
name to apply a different template:

```css
@import url('templates/normal.css');
```

<h3>6.5 Grid View HTML and CSS Class Diagram</h3>

A WordPress post or page tile is composed using 3 piece of information: image, title and subtitle. Below we will show a walk-through on how a “normal” template tile is being styled and layout.  
The Html template is defined below:
```html
<div class="wp-item wp-item-0" > 
	<div class="wp-image-container">   
		<div class="wp-image"></div> 
    </div> 
        <div class="wp-text-section mp-bg-overlay">             
			<h3 class="mp-color-title win-type-ellipsis">…</h3> 
       		<h5 class="mp-color-subtitle win-type-ellipsis">…</h5> 
    </div> 
</div>
```
The normal.css control the layout of the tile using -ms-grid and related CSS rules.  

* Formats the tile into a square 220x220px, and 2 rows – one for image, one for the text section.

```css
.wp-list .wp-item {
   overflow: hidden;  
   display: -ms-grid;
   -ms-grid-columns: 1fr;
   -ms-grid-rows: 160px 60px;
   width: 220px;
   height: 220px;
}
```
* Fit the image container into the first row, and assign 160px height to the image

```css
.wp-list .wp-item .wp-image-container {
   overflow: hidden;
   position: relative;
   -ms-grid-row: 1;
   -ms-grid-row-span: 1;
}

.wp-list .wp-item .wp-image-container .wp-image{
   height:160px;
   width:220px;
   background-position: center;
   background-size:cover;
}
```
* Fit the text section into row 2

```css
.wp-list .wp-item .wp-text-section {
   padding: 4px 12px 8px;
   -ms-grid-row: 2;
   z-index: 1;
   width: calc(100% - 24px);
   height: 100%; 
}
```
Here is a schematic look of the HTML and CSS classes:

<img src="http://download-codeplex.sec.s-msft.com/Download?ProjectName=metropress&DownloadId=634043"/>
  [1]: https://lh4.googleusercontent.com/9EXeWB41_clwNQILjpqcfqI9LunZoDd75XE6W3rC688-SZzyIQ7XMikuQAQf3tshG6dJ1n-_iUeqB6YOu_SrVdUqT5RWCPBvXk2KQr14L33e_h1yylAg0gMBRsc378Cmbbc
  [2]: https://lh6.googleusercontent.com/Fl-ah70aavCp2zG3ObCOnk2lE6Yz-9sDF_VLHZIXD0cxNEjzTLgSHBGppZwvXlPo9iTskQQG6qnpquK3lgCvvPtBYS0vXdibIvDDilq8D4llPjVs3U5nCinzBC8ca-TkGHQ
