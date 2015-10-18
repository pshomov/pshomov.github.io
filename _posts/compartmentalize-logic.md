---
title: Compartmentalize logic
date: 2015-09-28
draft: false
template: post.html
issueId: 5
---

Alright, this is the thing that I have had burning desire to share with you. I think it is awesome. But before I get to that I would like to give you a quick outline how I got here.
My [last post]() I was telling you about the painful points I experienced trying to build a Xamarin Forms MVVM. I considered [ReactiveUI] since I found it really really promising. I also found it to be too much of an all-in kind of proposition and the lack of documentation to even get started really killed it for me. Turned to JavaScript community in search of good ideas, considered Flux and almost started on a Flux-inspired port in .NET. 
And then I bumped into [Redux] and I _loved_ everything about it - simple, powerful, versatily. It's like I head a blurry image of I wanted and Redux just put everything in focus. I immediately knew it was exactly what I was looking for.

So I rushed out and ported it to .NET and I call it [Reducto](http://github.com/pshomov/reducto).

I encourage you to go over there and read everything about Store, Action and Middleware and it is pretty much the same in Reducto. Let me try to explain the basic concepts in Reducto:
 - Action - a structure which describes what has happened - LoggingIn, SignedOut, etc. The structure contains all the information relevant to the action - username, password, status, etc. Usually there are many actions in an app
 - Reducer - a side-effect free function that receives the current state of your app and an action. If the reducer does not know how to handle the action it should return the state as is. If the reducer can handle the action it makes a copy of the state, it modifies it in response to the action and returns the copy.
 - Store - it is an object that contains your whole app's state - a structure (quite likely a hierarchy of structures). It also has a reducer. We _dispatch_ action to the store which hands it to the reducer together with the current state and then keeps the new state until next action. There is only one store in your app. It's created when your app starts and gets destroyed when your app quits. Your MVVM models can get notifications when it changes so they can update themselves accordingly. 
 
Having one reducer operate on the whole state of the app probably sounds a bit scary but the trick is to [_compose_ the reducer from many smaller, simpler reducers](https://en.wikibooks.org/wiki/Muggles%27_Guide_to_Harry_Potter/Magic/Reducto#Overview) which distribute the responsibility of updating differents parts of the state. 

The basic idea is to create a store and give it a composite of reducers. We dispatch actions to the store which, with the help of reducers, updates the state. Rinse and repeat.
  
These are the core concepts Redux and Reducto. There are a couple more that are quite useful:

 - Async action - these are functions that may have side effects. This is where you talk to your database, call a web service, navigate to a view model, etc. Async actions can also dispatch actions (as described in the core concepts). 
 - Middleware - these are functions that can be hooked in the Store dispatch mechanism so you can do things like logging, profiling, authorization, etc. It's sort of a plugin mechanism which is quite useful.
 
Let's jump right in and see an example. Let's look at a very simple model which is only concerned with logging a user in. To make things simple I have presented this in the form of a unit test with the assertions showing what the expectations are

<script src="https://gist.github.com/pshomov/d3cd0ffa326dc042cf31.js"></script>

The example starts off with defining the app state - LoginState. Point of interest here is that it is a struct. Remember that app state is passed to the reducer and it is supposed to return a copy of it. Struct has the benefit of being passed by value by default so they get copied naturally whenever they are passed as a parameter.

Defined are two actions - LoginStarted and LoginSucceeded. They contain interesting information submitted from the user in the case of the former action and the authenticating service in the latter one.
On Line 31 we define a reducer for the app state and then we define how we handle different actions. If an action is dispatched that is not handled by the reducer, he sends the app state unmodified back.

Line 45 we define the app store and let the store have its reducer.
  

