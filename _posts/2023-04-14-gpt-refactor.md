# Website refactor with GPT4

The [website](https://safetygraphics.github.io/) for my [main open source project](https://github.com/SafetyGraphics/safetyGraphics) is waaaay overdue for a refactor. Development on the project is still pretty active, but the content on the site is pretty out of date and just uses a basic jekyll template from GitHub pages that looks pretty meh. 

I spent about an hour trying to refactor using ChatGPT - like my [first experiment making a shiny app]([https://github.com/jwildfire/shiny-gpt-demo](https://jwildfire.github.io/2023/03/29/shiny-gpt.html)) results were mixed. You can see the current site is [here](https://safetygraphics.github.io/) and after a maybe 20 prompts (most of the fiddling with hex positioning) I had the ChatGPT refactor looking like this: ): 

<img width="1149" alt="Screen Shot 2023-04-14 at 10 22 50 AM" src="https://user-images.githubusercontent.com/3680095/232071669-8dcdac5c-ead5-4b14-a572-1ae675d97c8e.png">

Definitely not good enough to merge and deploy, but I do think it's a step in a decent direction. My html/css skills are rusty so might've taken me twice as long to do this manually.  I think the most successful part of this experient was going from this version using boostrap that still looks a bit clunky and dated to the version below using [tailwind](https://tailwindcss.com/):

![image](https://user-images.githubusercontent.com/3680095/232130801-f3765e45-9b20-4fcc-a616-5e83b9370df7.png)

I actually think this looks pretty good! This change just took 5 minutes and 2 queries to GPT4 ('I'm not happy with the look and feel. lets use tailwind instead of bootstrap for the index page' and 'regenerate the content for the main section') I honestly hadn't even heard of tailwind before today (again, rusty css), so this would've taken me hours (basically, it never would've happened). 

I'll try to add the rest of the content from the original site and merge the tailwind version in the next few weeks. Here's a [PR with code](https://github.com/SafetyGraphics/SafetyGraphics.github.io/pull/12) if want to see the details.

# Notes

- I upgraded and used GPT4 for this. 
- My workflow is to copy/paste between the ChatGPT website and VSCode which is a bit clunky. Might try playing with [codegpt](https://marketplace.visualstudio.com/items?itemName=DanielSanMedium.dscodegpt) next time. 
- I fed GPT4 some of the markdown from the original site and it did just fine parsing to html and generating content for the site. 
- Still seeing quite a few long responses get cut off. html is often incomplete or has <-- fill content here --> comments embedded. 
- I spent most of my time fiddling with the hex positioning in the header. Spent maybe 10 prompts trying to get it to center the hex horizontally across the header and the nav in the first screenshot, but never got it working. 
- My next hour is going to be trying to get the safetyGraphics YAML chart specifications parsed in to a "Charts" page for this repo using JavaScript. 

# Conclusion
 
I'm more convinced than ever that this is X months away from being game changing (for me at least). I *really* want a way to say: "convert all the markdown files in this folder to html and apply the template at this URL: [xxx.com](http://xxx.com/)" I think that will happen soon, but I don't think there's a way to do it yet without devoting significant time investment to setup a custom framework.
