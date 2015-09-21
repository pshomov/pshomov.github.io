---
title: Common problems with MVVM apps
date: 2015-09-25
draft: 
template: post.html
issueId: 3
---

Those few who have read my blog before might remember me raving about the combo [Fody.PropertyChanged + MVVMCommand](/worry-free-mvvm-with-xamarin-forms/). I was pretty excited to get some good comments on that post and it is really [the comments](/worry-free-mvvm-with-xamarin-forms/#comments) that are the reason I am writing this post.

I have to say it right away - I am not very experienced writing MVVM apps. I am quite experienced developer (~20 years of experience) but I just haven't been around **native desktop** app development in the last 10 years. I did find myself involved recently however in Xamarin.Forms mobile apps and I must say MVVM is pretty nice. I should mention I have been doing a lot of web development in JavaScript both server and client side which is relevant as a context later on.

So after being around [AngularJS](http://angularjs.org) and [React](http://facebook.github.io/react/) here are the things that I find wrong with most of the examples of MVVM apps I find on the web:

### App logic is distributed and disconnected
There is no central app object which controls the flow and holds the state

### Too much logic and responsibilities in the views
Since app logic has no special home it is stread over views. Those are fetching data from services and transforming it to their own structure, doing navigation to other views, etc. These extra responsibility only make changing the flow and reusing the views more difficult. I am talking about view models like [this](https://github.com/dotnetcurry/wpf-mvvmlight), [this](https://github.com/MvvmCross/MvvmCross-Tutorials/tree/master/Sample%20-%20TwitterSearch/TwitterSearch.Core/views) and [this](https://github.com/rid00z/FreshMvvm/blob/master/samples/FreshMvvmSampleApp/FreshMvvmSampleApp/PageModels/ContactPageModel.cs) one. In my opinion views should receive data, take care of the user interactions in the view and send out notifications/actions with the data the user has submitted.
 
### Not good enough testing of the behaviour of the app due to issues described in the previous two points
Testing of the app is limited to testing individual views, quite hard to test the flow of the app

MVVM frameworks that are on the market either (inadvertantly) support these design shortcomings (dependency injection containers make it super easy to get all kinds of services in the viewmodel with minimal effort) or at best do not address them at all. To be fair these frameworks are mostly trying to smooth out the MVVM pattern and are not trying too hard to advise you on app architecture but their samples are doing that in a way.

So back to the those comments mentioned earlier. I wrote I am going to write **my** idea of a good mobile app and I would like to show you what I have been up to. Coming up real soon ;)