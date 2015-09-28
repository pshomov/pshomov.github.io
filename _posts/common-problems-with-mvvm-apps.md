---
title: Common problems with MVVM apps
date: 2015-09-22
updated: 2015-09-26
draft: false
template: post.html
issueId: 3
---

Those few who have read my blog before might remember me raving about the combo [Fody.PropertyChanged + MVVMCommand](/worry-free-mvvm-with-xamarin-forms/). I was pretty excited to get some good comments on that post and it is really [the comments](/worry-free-mvvm-with-xamarin-forms/#comments) that are the reason I am writing this post.

~~I have to say it right away - I am not very experienced writing MVVM apps. I am quite experienced developer (~20 years of experience) but I just haven't been around **native desktop** app development in the last 10 years. I did find myself involved recently however in Xamarin.Forms mobile apps and I must say MVVM is pretty nice. I should mention I have been doing a lot of web development in JavaScript both server and client side which should bring back a bit of credibility to my observations.~~

I realized I seem to have underplayed myself so here is what I would rather say - I have read and watched a lot connected with MVVM and have about 1 year of on/off writing MVVM apps(Xamarin Forms). I also have been using or examining UI frameworks in JavaScript, Ruby, Python. Mostly JavaScript though.

So after being around [AngularJS](http://angularjs.org) and [React](http://facebook.github.io/react/) here are the things that I find wrong with most of the examples of MVVM apps I find on the web:

* **App logic is distributed and disconnected**

  This is the main point really and the other two are a consequence of it - there is no central app object or a system which controls the flow and holds the state of the app.

* **Too much logic and responsibilities in the views**

	Since app logic has no special home it is spread over views. Those are fetching data from services and transforming it to their own structure, doing navigation to other views, etc. These extra responsibility only make changing the flow of the app and reusing the views more difficult. I am talking about view models like [this](https://github.com/dotnetcurry/wpf-mvvmlight/blob/master/WPF_MVVMLight_CRUD/ViewModel/MainViewModel.cs), [this](https://github.com/MvvmCross/MvvmCross-Tutorials/blob/master/Sample%20-%20TwitterSearch/TwitterSearch.Core/ViewModels/TwitterViewModel.cs) and [this](https://github.com/rid00z/FreshMvvm/blob/master/samples/FreshMvvmSampleApp/FreshMvvmSampleApp/PageModels/ContactPageModel.cs) one. In my opinion views should receive data, take care of the user interactions in the view and send out notifications/actions with the data the user has submitted. Here is a link to a blog post by Adam Kemp that goes in detail about [decoupled views](http://blog.adamkemp.com/2015/03/decoupling-views.html).
 
* **Not good enough testing of the behaviour of the app due to issues described in the previous two points**

  Testing of the app is limited to testing individual views, it is quite hard to test the flow of the app unless you are up for setting up a lot of infrastructure and usually plenty of mocking.

MVVM frameworks that are on the market either (inadvertently) support these design shortcomings (dependency injection containers make it super easy to get all kinds of services in the viewmodel with minimal effort) or at best do not address them at all. To be fair these frameworks are mostly trying to smooth out the MVVM pattern and are not trying too hard to advise you on app architecture but their samples are doing that in a way.

So back to those comments mentioned earlier.<br/> 
I wrote I am going to write **my** idea of a good mobile app and I would like to show you what I have been up to. Coming up real soon ;)

_UPDATE:_ fixed broken links to the examples