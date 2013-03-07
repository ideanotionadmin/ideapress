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
<img src="https://lh3.googleusercontent.com/qyIsZ3DdqC6otAYAvBSOWIDWnu8euqNaSWNaFk6fAscPiX7ZLLlhxvN8MtInwsCGjg9MxJEFL1eJlZMrAmxTcgb2des01OGLTTqrUYbAmIpiWktEnA08konYF4ZGk0glshE" alt="Drawing" style="border:1px solid black; width: 80%"/>

  [1]: https://lh4.googleusercontent.com/9EXeWB41_clwNQILjpqcfqI9LunZoDd75XE6W3rC688-SZzyIQ7XMikuQAQf3tshG6dJ1n-_iUeqB6YOu_SrVdUqT5RWCPBvXk2KQr14L33e_h1yylAg0gMBRsc378Cmbbc
  [2]: https://lh6.googleusercontent.com/Fl-ah70aavCp2zG3ObCOnk2lE6Yz-9sDF_VLHZIXD0cxNEjzTLgSHBGppZwvXlPo9iTskQQG6qnpquK3lgCvvPtBYS0vXdibIvDDilq8D4llPjVs3U5nCinzBC8ca-TkGHQ
