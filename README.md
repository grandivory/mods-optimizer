# Grandivory's Mods Optimizer
Grandivory's Mods Optimizer for Star Wars: Galaxy of Heroes is a single-page application built in React.js to help
answer of the question of "how can I distribute my mods to get the most out of all of my teams?" It works by applying
constant weights to every potential stat that a character can get from a mod, and then summing up the value of all stats
included in a full set of mods. The set that has the highest total value will be the best set to equip. This only works,
of course, if the weights for each stat are also optimal, so reasonable defaults are provided for all characters in
order to make using the tool as easy as possible. Users can also adjust the stat weights themselves to tweak their
results to whatever they wish.

## Section Overview
* [Installation and Local Setup](#installation-and-local-setup)
* [External dependencies](#external-dependencies)
* [Project Structure](#project-structure)
* [Linting and Testing](#linting-and-testing)
* [Using the optimizer](#using-the-optimizer)
* [Other resources](#other-resources)

## Installation and local setup
To get started with the Mods Optimizer, you first need to have Node (and NPM) installed. You can get Node from its
official site at [https://nodejs.org/en/download/], or use a tool such as Homebrew on a Mac to install it
(`brew install node`) if you already have Homebrew available.
Once node is installed, you should be able to run `npm install` from the root directory of the repository. That will
install all of the correct versions of the dependencies for you, so that your environment is set up to run the
application locally.
At this point, if you want to run the application, simply type `npm start` from the terminal. This will start up a
local server running at `https://localhost:3030` (It uses a self-signed certificate, so you'll need to tell your
browser to trust it), and you're up and running!

## Project Structure
Almost all of the relevant files in the project are in the `src` directory. This folder is further subdivided into
`components`, `constants`, `containers`, `domain`, and `utils`.

### Components
The `components` directory holds objects that handle most of the in-page display of different bits in the app. For
example, there is a component for `ModDetail`, which will show all of the details about a mod, and a component for
`CharacterAvatar`, which will display an image for a specific character. Many of these components reference each other
to render different parts. For example, `ModDetail` has references to `ModImage`, `Pips`, and `CharacterAvatar`.

### Constants
The `constants` directory holds values that are static during the operation of the application, but that might need to
be referenced by multiple parts. This includes the list of characters, what each set bonus does, etc.

### Containers
The `containers` directory holds objects for each "page" of the app. There is `App` itself, which is the outer shell
in which everything else is rendered, then containers for each view - `Explore` and `Optimizer`, which
is further subdivided into `CharacterEdit` and `Review`

### Domain
The `domain` directory holds objects that are used to represent the data that the app needs to work on. These objects
are data holders only, and have no display information included in them at all.

### Utils
The `utils` directory holds code that needs to be accessible from various points in the app, but is purely functional.
Like `domain`, there is no display information included anywhere in `utils`. Probably the most important piece of code
for the whole application lives here, in `Optimizer`. This is the utility that will actually take a list of characters
and mods and find the best mods to equip on each.

## Linting and Testing
There are npm commands for linting the code (making sure that its style conforms to the rest of the project) and
for running tests. These commands are `npm run lint src` (to run linting on the src directory) and `npm test`,
respectively. While neither is strictly necessary right now, both will eventually be run as part of the merge process,
and will therefore need to pass prior to any code contributions!

## Using the optimizer
### Selecting characters to optimize
The mods optimizer will start out by considering all mods equipped on any character other than those that
are "Locked". Then, it will go down the list of selected characters, one by one, choosing the
best mods it can find for each character, based on the selected target. As it finishes each character, it
removes those mods from its consideration set. Therefore, the character that you want to have your absolute best
mods should always be first among your selected characters. Usually, this means that you want the character who
needs the most speed to be first.

I suggest optimizing your arena team first, in order of required speed, then characters you use for raids,
then characters for other game modes, like Territory Battles, Territory Wars, and events.

### Picking the right values
Every character in the game has been given starting values for all stats that can be used by the optimizer to
pick the best mods. These values have been named for their general purpose - hSTR Phase 1, PvP, and PvE, for
example. Some characters have multiple different targets that you can select from. **These targets, while
directionally good for characters, are only a base suggestion!** There are many reasons that you might
want to pick different values than those listed by default in the optimizer: you might want to optimize for a
different purpose (such as a phase 3 Sith Triumvirate Raid team, where speed can be detrimental), you might
want to choose something different to optimize against, or you might simply have a better set of values that
you want to employ.

The easiest way to get started with the optimizer is to choose from the pre-programmed character
templates. These are set up with sets of characters and targets that should fit various game modes. If
there's no template to fit your exact needs, you can use one as a starting point or create one from
scratch. For each individual character, if no target exists that matches what you want, 
you can select "Custom", or simply hit the "Edit" button to bring up the character edit
modal. Most characters will have the "basic" mode selected by default. In basic mode, you select a value for all
stats that is between -100 and 100. These values are weights that are assigned to each stat to determine its
value for that character. Setting two values as equal means that those stats are about equally important for
that character. In basic mode, the optimizer will automatically adjust the weights to fit the range of values
seen in-game for that stat. For example, giving speed and protection both a value of 100 means that 1 speed is
about equivalent to 200 protection (since you find much more protection on mods than you do speed).

If you want more fine-tuned control over the stat values, you can switch to "advanced" mode. In advanced mode,
the values given are the value for each point of the listed stat. In advanced mode, if speed and protection are
both given a value of 100, then the tool will never select speed, because it can more easily give that character
much more protection. I suggest sticking to basic mode until you have a strong sense for how the tool works.

## Other resources
Check out my [discord server](https://discord.gg/WFKycSm) to talk to other users of the tool, give feedback,
or ask questions!
