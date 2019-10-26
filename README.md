# Space Apps Challenge - SAFETY NETWORK

Our web and mobile application is a collaborative safety network, locating people in danger in real time and tracking them so emergency services can rescue them. [Video presentation](https://www.youtube.com/watch?v=jciM0nb98KQ)

![Alt text](./Documentation/cover.png?raw=true "Safety Network")

Having information, as fast as possible, means everything. This is how hazard areas get into the system:

- Safety network read all sort of hazard alerts from national emergency services and weather APIs and include them in the system.

- Maybe emergencies services or satellites doesn't know it happened yet. Any GPS-tracked user who reports a danger will create an alert in the system as well, which will then find nearby users and, if in danger, try to propagate a dangerous zone over the map. The system just found a hazard area and can inform now emergency services. We need to find all people in danger!

- On top of that, Safety network matches hazard alerts against NASA satellite data, to double check and even include more dangerous zones in out real time map.

- The last but not least way of information getting into the system is our neuronal network; trained continuously with every single alert which gets into the system, will create alerts in advance and alert everybody in the area. (will get better over time, it needs to exercise more and more..!).

The output of this is a real-time map where emergency services and anybody can see everyone in danger and every hazard area at a glance, with some information about each person in danger so we can really spot vulnerable people.

The technologies behind are: ionic (frontend), firebase (serverless backend, real time database), .NET core (reado/write API for external services), Tensorflow and Node (neuronal network).

And YES, four developers from Spain coded it in a few hours from scratch!

OUR APP IN GOOGLE PLAY:
https://play.google.com/store/apps/details?id=com.safety.network&hl=en_US

OUR APP IN THE WEB:
https://safety-network.firebaseapp.com

OUR PROFILE IN NASA SPACE APPS:
https://2019.spaceappschallenge.org/challenges/living-our-world/curious-minds-come-helping-hands/teams/auto/project

OUR PRESENTATION:
https://github.com/javieraviles/spaceappschallenge/blob/master/Documentation/project_slide.pptx​


AUTO team.
