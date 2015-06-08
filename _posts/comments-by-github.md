---
title: Comments powered by GitHub
date: 2015-06-08
draft: false
template: post.html
issueId: 2
---

Maybe it's a bit too early to start meta-posting but I am starting to doubt the decisions I took regarding this so may be if  I go through the process of it I might feel a bit better.

This blog is hosted on GitHub pages. I am not entirely sure why GitHub has this service but it is very cool for us who use it. The deployment model is awesome (git push on a branch and you are done), it is free and hopefully with good CDN. That last part I will try to measure soon-ish. One important limitation - it is static pages only. Which calls for interesting combinations of static site generators and JavaScript.

GitHub does not provide any comment system as such, so the blogging story is somewhat incomplete. Which once again makes for a good challenge. Setting up a database and using it for comments is out of the question for me - have to host it somewhere, setting up all the processes around the management of comments - posting comments, reviewing, e-mail notifications, responding by e-mail, etc. It basically would erase the simplicity GitHub pages gives me.

There is [Disqus](https://disqus.com), they host and take care of all those things but in return you pay with your visitors/readers privacy. At a glance it looks like the their JavaScript API is fine so using their services is feasable but probably would have lost some level of customization. All in all not a bad option just feeling uneasy since it is not quite clear what kind of deal am I getting. 

At this point I get this idea that it would be really awesome if I can somehow get the GitHub issue discussion page and embed it into my blog. I checked out the GitHub issues API - looked good; I googled around and found this [post by Ivan Zuzak](http://ivanzuzak.info/2011/02/18/github-hosted-comments-for-github-hosted-blogs.html) essentially implementing the same idea. I stole a whole lot of code from that post but I need a few more things to make it really work well.

So what are the pros and cons with the GitHub-issue-as-a-backend:

**Pros:**
  - Open API to access the comments, accessible by anyone, which is right - I do not own anyone's comments
  - GitHub handles sending email notifications as well as answering to comments by email
  - Full control over the HTML/CSS of the comments section
  - Trustworthy (so far) keeper of the data - GitHub


**Cons:**
  - commenters do need a GitHub account
  
  
  I believe my current and potential readers are the kind of people who do have a GitHub account so hopefully this one drawback does not matter, but if you would like to comment and don't have an account please tweet at [me](https://twitter.com/pshomov) and I would proxy on your behalf.
  
  I think I feel better now ;-)