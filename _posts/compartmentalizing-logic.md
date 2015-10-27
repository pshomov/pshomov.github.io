---
title: Compartmentalizing logic
date: 2015-10-27
collection: published
template: post.html
issueId: 5
---

Alright, this is the thing that I have had burning desire to share with you. I think it is awesome. But before I get to that I would like to give you a quick outline how I got here.

My [last post](/common-problems-with-mvvm-apps-take-two/) I was telling you about the friction I experienced trying to build a Xamarin Forms MVVM - all kinds of logic in view models, hard to have overview, hard to test, hard to understand. I considered [ReactiveUI](http://reactiveui.net) since I found it really really promising. I also found it to be too much of an all-in kind of proposition and the lack of documentation to even get started really killed it for me. Turned to JavaScript community in search of good ideas, considered Flux and almost started on a Flux-inspired port in .NET. 

And then I bumped into [Redux](http://redux.js.org) and I _loved_ everything about it - simple, powerful, versatile. It's like I head a blurry image of what I wanted and Redux just put everything in focus. I immediately knew it was exactly what I was looking for.

So I rushed out and made a port to .NET which I call [Reducto](http://github.com/pshomov/reducto).

Let me try to explain the basic concepts in Reducto:
 - **Action** - an object which describes what has happened - LoggingIn, SignedOut, etc. The object contains all the information relevant to the action - username, password, status, etc. Usually there are many actions in an app
 - **Reducer** - a side-effect free function that receives the current state of your app and an action. If the reducer does not know how to handle the action it should return the state as is. If the reducer can handle the action it makes a copy of the state, it modifies it in response to the action and returns the copy.
 - **Store** - it is an object that contains your whole app's state. It also has a reducer. We _dispatch_ an action to the store which hands it to the reducer together with the current app state and then uses the return value of the reducer as the new state of the app. There is only one store in your app. It's created when your app starts and gets destroyed when your app quits. Your MVVM view models can _subscribe_ to be notified when the state changes so they can update themselves accordingly. 

Having a single reducer operate on the whole state of the app probably sounds a bit scary but the trick is to [_compose_ the reducer from many smaller, simpler reducers](https://en.wikibooks.org/wiki/Muggles%27_Guide_to_Harry_Potter/Magic/Reducto#Overview) which distribute the responsibility of updating different parts of the state. More on that in my next post. 

The basic idea is to create a store and give it a reducer(a composite one quite likely). We dispatch actions to the store which, with the help of reducers, updates the state. Rinse and repeat.
  
Besides these core concepts in Reducto(and Redux) there are a couple more that are quite useful:

 - **Async action** - a function that may have side effects. This is where you talk to your database, call a web service, navigate to a view model, etc. Async actions can also dispatch actions (as described in the core concepts). 
 - **Middleware** - these are functions that can be hooked in the Store dispatch mechanism so you can do things like logging, profiling, authorization, etc. It's sort of a plugin mechanism which can be quite useful.
 
Let's jump right in and see an example. Let's look at a very simple model of the app state which is only concerned with logging a user in. To make things simple I have presented this in the form of a unit test with the assertions showing what the expectations are

<script src="https://gist.github.com/pshomov/d3cd0ffa326dc042cf31.js"></script>

The example starts off with defining the app state - LoginState. Point of interest here is that it is a `struct`. Remember that app state is passed to the reducer which is supposed to return a copy of it. `Struct`s have the benefit of being passed by value by default so they get copied naturally whenever they are passed as an argument.

Defined are two actions - LoginStarted and LoginSucceeded. They contain interesting information submitted from the user in the case of the former action and the authenticating service for the latter one.<br>
On Line 31 we define a reducer for the app state and then we define how we handle both actions. On a side note, if an action is dispatched that is not handled by the reducer, he sends the app state unmodified back.

Line 45 defines the app store and let the store have its reducer.<br>
Line 47 we see a subscription to the store, which gets notified whenever there is an update to the state. In line 70 we remove the subscription.

So here are the benefits that I see
- the logic is isolated in those reducers
- defining the reducers is very simple and does not require creating classes, inheriting or anything like that. A function is enough.
- testing is extremely simple - dispatch some actions, assert on the state
- framework agnostic - MVVM, MVC, WebForms apps can use it, but also this seems like an all around good way to structure all kinds of apps really.

A few interesting statistics regarding Reducto

|Metric|Value|
|-------|-----|
|lines of code| ~260|
|dependencies| 0 |
|packaging | [NuGet PCL](https://www.nuget.org/packages/Reducto/) |

In my next post I will dive a bit deeper in Reducto - Async actions and Composite reducers and connecting all of this in a Xamarin Forms app. 
The code for that post is already in development [over here](https://github.com/pshomov/reducto.sample).

And please, do share your thoughts in the comments ;) 