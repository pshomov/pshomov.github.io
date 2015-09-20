---
title: Common problems with MVVM apps
date: 2015-09-25
draft: 
template: post.html
issueId: 3
---

Those few who have ready my blog before might remember me raving about the combo [Fody.PropertyChanged + MVVMCommand](/worry-free-mvvm-with-xamarin-forms/). I was pretty excited to get some good comments on that post and it is really [the comments](/worry-free-mvvm-with-xamarin-forms/#comments) that are the reason I am writing this post.

I have to say it right away - I am not very experienced writing MVVM apps. I am quite experienced developer (~20 years of experience) but I just haven't been around **native desktop** app development in the last 10 years. I did find myself involved recently however in Xamarin.Forms mobile apps and I must say MVVM is pretty nice. I should mention I have been doing a lot of web development in JavaScript both server and client side which is relevant as a context later on.

So after being around AngularJS and React here are the things that I find wrong with most of the examples of MVVM apps I find on the web:

* app logic is distributed and disconnected - no central app object which controls the flow and interactions
* too much logic and responsibilities in the viewmodels - getting data from services and transforming it to their own structure, navigation
* not good enough testing of the behaviour of the app due to the previous two points - testing of the app is limited to testing individual viewmodels, quite hard to test the flow of the app
 
MVVM frameworks that are on the market either support these design failures (dependency injection containers) or do not address them at all.  
So in those comments I said I am going to write **my** idea of a good mobile app and I would like to show you what I have been up to. Until next time ;)