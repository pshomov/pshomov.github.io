---
title: Worry-free MVVM with Xamarin Forms
date: 2015-05-25
draft: 
template: post.html
---
**TL;DR** - Super-clean MVVM example with automatic Command status updates [here](https://github.com/pshomov/mvvmeasy)
***

Xamarin Forms is great for writing decent looking applications on all three major mobile platforms - iOS, Android and Windows Mobile. The Xaml support and databindings are great help to keep things clean and simple. 

So I am working on a Xamarin Forms project where we were in the process of choosing some framework or library to help us with implementing the MVVM pattern and more specifically the view models where it is necessary to send notifications as properties get changed. We looked at [MvvmLight] as well as a preview version of [Prism]. Both of them provide a base class which has helper methods for implementing properties with sending notifications. Here is how a simple Login view model looks with Prism

<script src="https://gist.github.com/pshomov/e35832cbf51c82ac50c7.js"></script>

A couple of things to notice here:
- Lot's of repetitive code in the property getters and setters
- Extra complexity in both the property setters and the command itself due to keeping the enabled/disabled state of the Login command in sync (lines 22, 30, 63 and 72)
- We need extra (and may I say not particularly pretty) testing of wether the property change notifications were sent and the update of the Login command status was triggered

In order to clean things up let's use [Fody.PropertyChanged](https://github.com/Fody/PropertyChanged#your-code). If you have not looked at this MVVM specialized weaver, please take your time now to get introduced. I think you might like it.
And here is how the new model looks like:

<script src="https://gist.github.com/pshomov/eb3f85471e632bbcb9f6.js"></script>
 
Now Fody.PropertyChanged is great, it helps us get rid of those super-boring, error-prone property setters but unfortunately does nothing about updating the Login command state. In fact this version of the model does not work correctly since the Login command never gets enabled. One way to fix this problem is by making the Login command state be more MVVM-y. To do that let's use [MVVMCommand](https://github.com/pshomov/mvvmeasy/blob/master/Infrastructure/MVVMCommand.cs) which is exactly like a normal Xamarin Forms Command except the second parameter has to be a lambda that returns the value of a property. Let's see how the fixed model looks:

<script src="https://gist.github.com/pshomov/4b158ca0b0801809b0d6.js"></script>

Notice how in line 28 the state of the command becomes extracted to a property - IsLoginEnabled. The reason that is good is because it plays on the strength of Fody.PropertyChanged. Meaning that Fody.PropertyChanged sends out ProprtyChanged notificaions about IsLoginEnabled whenever one of the properties it's value is based on changes. Now all MVVMCommand needs to do is listen for those notifications and do the updating of the enabled/disabled command state. It's actually pretty simple:

<script src="https://gist.github.com/pshomov/4e2b51ef94ca3c6cc508.js"></script>

So now testing this model becomes really a rather simple and elegant exercise of changing properties and asserting on the value of other properties and no need to worry about bookkeeping regarding who update who.

Hope this makes sense, the source for a complete example is on [GitHub](https://github.com/pshomov/mvvmeasy)

**BTW**: Sorry for not providing a way to do comments, now actively working on it, I promise. Meanwhile please file an issue on the code and let's have the conversion over there ;) 