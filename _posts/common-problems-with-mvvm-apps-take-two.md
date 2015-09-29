---
title: Common problems with MVVM apps - take two
date: 2015-09-28
draft: false
template: post.html
issueId: 4
---

My last post [Common problems with MVVM](/common-problems-with-mvvm-apps/) was it seems pretty vague and needs a concrete example to make a bit more sense. Not to mention in an attempt to not sound too authoritative I managed to represent myself like someone who is just starting with MVVM and and is taking too big of a bite.

Let's dive right into a typical example of a login page view model from a Xamarin Forms app:

<script src="https://gist.github.com/pshomov/eb03fc62e07b9497d12a.js"></script>

In case you are wondering - I am using [Fody.PropertyChanged](https://github.com/Fody/PropertyChanged) to skip the minutiae of property change notifications. 

The problem in my opinion is in the Login command - lines 23-25. Upon triggering the Login command the view model invokes the authentication process and in the case of success, navigates to the "main" view.

1. The view model should not know about the authentication process at all. Neither when nor how it should be accomplished. It's not important to the view and makes it harder to test it. Should we decide to handle failure to authenticate, the code in that login command will get more complicated real quick.  
2. The view model should not know anything about the navigation process. Again neither when nor how. Not relevant to the view. It makes it more difficult to experiment with the view or use it in a different way - for example for Sign Up.

I think we would be better off with a view model more like this one:
<script src="https://gist.github.com/pshomov/b297f5e661f88689cca4.js"></script>

Yes, I made up a pubsub "thing" that allows for publishing and subscribing ;-).

Generally speaking if view models are not the place for app logic, what kind of logic should be in there? I think we should have there animation logic, syncing states between controls in the view and in general logic directly connected to the view itself and its components.

Now this model is much simpler and rather easy to test. In fact it is so simple I think I just lost interest in testing it.

I would rather test the logic that controls it, and that is what I really wanted to get you curious about ;)


I will keep working on that new sample but meanwhile I encourage you to post your thoughts in the comments below.

Until next time.