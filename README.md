<h1>Documentation</h1>


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
