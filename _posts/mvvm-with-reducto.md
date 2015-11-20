---
title: MVVM with Reducto
date: 2015-11-22
template: post.html
issueId: 6
---

Let's start with a quick recap of the reasons I am writing this post. 

### The problem

I find most examples on the web regarding how to write MVVM apps at fault when it comes to choosing where to place the logic about the flow and behaviour of the app - almost all logic is stuffed into the view models. The _Model_ in MVVM is limited to service/repository wrappers and their DTOs. I think we can do better, I think the model has to be much richer and the view models much smaller.<br>
Then I found [Redux]() and I knew exactly what I needed to do, so I ported it to .NET and its name is [Reducto](). I introduced it in a [previous post]() and there is a quick refresher on that in a following section, but for a more detailed overview, please head over [here](). 

### Agenda for this post

In this post the rubber meets the road - Reducto orchestrating your Xamarin Forms app. I am going to focus on a very small part of an app - logging in a user. I think it is sufficiently simple and common and will allow me to focus on the technology necessary for building the feature.

There are some small pieces of glue that I might not talk about here but they are rather simple and live under the [`Infrastructure`](https://github.com/pshomov/reducto.sample/blob/master/src/Reducto.Sample/Infrastructure) folder in the [sample project](https://github.com/pshomov/reducto.sample) where all material here is taken from.
Although the example is with Xamarin Forms, everything should be applicable to other implementations of MVVM too. 

### Reducto ~~redux~~ recap

Reducto is a keeper of the state for your app. It helps to organize the logic that changes that state.
  
A quick refresher on the core concepts in Reducto:

 - **Action** - an object which describes what has happened - LoggedIn, SignedOut, etc. The object contains all the information relevant to the action - username, password, status, etc. Usually there are many actions in an app. 
 - **Reducer** - a side-effect free function that receives the current state of your app and an action. If the reducer does not know how to handle the action it should return the state as is. If the reducer can handle the action it 1.) makes a copy of the state 2.) it modifies it in response to the action and 3.) returns the copy.
 - **Store** - it is an object that contains your app's state. It also has a reducer. We _dispatch_ an action to the store which hands it to the reducer together with the current app state and then uses the return value of the reducer as the new state of the app. There is only one store in your app. It's created when your app starts and gets destroyed when your app quits. Your MVVM view models can _subscribe_ to be notified when the state changes so they can update themselves accordingly. 
 - **Async action** - a function that may have side effects. This is where you talk to your database, call a web service, navigate to a view model, etc. Async actions can also dispatch actions (as described above). To execute an async action it needs to be _dispatched_ to the _store_.
 - **Middleware** - I will leave this part out for now

Dispatching an action to the store is **the only way to change its state**.<br>
Dispatching an _async action_ cannot change the state but it can dispatch _actions_(more about that in a few paragraphs) which in turn can change the state.
   
### Async actions

Let's jump right in and show you the action of logging a user in. It has to be async action since it needs to talk to the "external world"
<script src="https://gist.github.com/pshomov/c534fb9eb3052dcc3f67.js?file=async.action.cs"></script>

Let's start with a few observation about async actions in general. 

 - Use the store's `asyncAction` and `asyncActionVoid` methods to create async action. In more detail: Async actions are best created by helper methods such as `asyncActionVoid` since they might need to receive their arguments in two stages - at the place of the _dispatching_ of the action and then later on internally in Reducto. So a little bit of currying is used to achieve that, take a look.  
 <script src="https://gist.github.com/pshomov/c534fb9eb3052dcc3f67.js?file=asyncaction.void.cs"></script>

 - As you can see, an async action takes as a first parameter a _dispatch_ delegate which allows the async action to dispatch synchronous ones. This comes useful when it is needed to update the app state. The second parameter is another delegate which allows us to get the app state - _getState_, useful if we need that info to make some decision about the behaviour. The third parameter is optional and is the only way for the one _invoking_ the async action to pass some information to it(remember that currying part? this's why). If the action does not need any parameters at the time of the invocation, go ahead and create async action with only two parameters.
 
 - The result of an async action can be either `Task` or `Task<T>` and such async actions are created respectively by  `asyncActionVoid` and `asyncAction` methods of the `Store`.

Coming back to this specific action - it returns `Task` and expects a parameter of type `LoginInfo` at the time of its invocation, containing the username and password the user has specified.
It dispatches actions corresponding to the progress and the outcome of the operation. Also worth noticing is it navigates to another view model upon successful authentication.

### The app state

The login async action was dispatching actions before and after the long-running network operation, but how did that affect the view on the screen? - the actions are handled by the mini-reducer responsible for that part of the state and the state is updated accordingly. 

Before we look at the reducer let's take a look at the declaration of the app state.

<script src="https://gist.github.com/pshomov/c534fb9eb3052dcc3f67.js?file=app.store.cs"></script>
 
The idea here is that the complete state of the app is broken down into smaller chunks which are handled by dedicated mini-reducers. Divide and conquer my friends, divide and conquer <i class="em em-wink"></i>.

The details about `DeviceListPageState` are intentionally missing since it is not important for this discussion.

### The reducer

What follows is an abbreviated version of the `App` class where all "app logic" lives and the reducer is an important part of it.

<script src="https://gist.github.com/pshomov/c534fb9eb3052dcc3f67.js?file=app.declaration.cs"></script>

A few things here. The reducer for the store is a `CompositeReducer` and it delegates the responsibility for different parts of the app state to other reducers, in this case - a couple of `SimpleReducers`, but this sort of brake down can be nested further - [here is an example](https://github.com/pshomov/reducto/blob/master/src/Reducto.Tests/ReducersTests.cs#L89). 

Worth noting also is the constructor of `SimpleReducer` where we can create the initial value for the state this reducer governs.

### View model

Let's take a look at the view model for the LoginPageView

<script src="https://gist.github.com/pshomov/c534fb9eb3052dcc3f67.js?file=viewmodel.cs"></script>

As you can see the view model is quite simple. Dispatches the Login async action with the username and password the user has provided and listens for updates to the store and updates its properties accordingly.
`Store.createAsyncActionCommand` is an extension method that creates an `ICommand` that dispatches an action and is something that is not part of Reducto, but might put in an Reducto.XamarinForms nuget package. For now, you can go see [the source code](https://github.com/pshomov/reducto.sample/blob/master/src/Reducto.Sample/Infrastructure/CommandToAction.cs)

### Conclusion

Needless to say this structuring of an app makes a lot more sense to me:

 - The real logic of the app is in one place and not mixed with other concerns. To quote the late Yogi Berra  
 > You can observe a lot just by watching
 - _Testing_ the logic is quite nice too. Reducers are very easy to test since they are so simple and all you need to do is give them state and an action and compare the result to what you expected it to be. Async actions which are the other half of the logic in the app need a bit more setup - mocking and stubbing but all in all pretty good experience too.
 

I know these are still early days for Reducto and may be there are some issues to be addressed but if you like where this is going, please open an issue and let's make it better.

The source code for the full sample app this post is based on can be found on [GitHub](https://github.com/pshomov/reducto.sample). 

Common guys, hit the comments and let me know what you think <i class="em em-wink"></i>. 

