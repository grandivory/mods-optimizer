# Contributing to Grandivory's Mods Optimizer

## Scope of changes
No change is too small to be considered a worthwhile contribution! Even if you're only
changing one line of code, it can save time and bring value to the tool faster than if
you don't contribute. Go for it!

If you want to change a very large section of the code, then expect some
back-and-forth before your pull request is accepted. It means that I'm interested in
what you're doing and want to make it as good as possible - not that I'm trying to
prevent you from contributing. 

## Getting started
To get started contributing to the mods optimizer, first fork the repository. Once
you have your own copy of the repository, start making changes and committing them to
a new branch (or to your own `develop` branch, if you wish). Once your changes are
ready, open up a pull request back to the original repository.

## Commit messages
Commit messages should follow the format of:
```
Simple description of change (<50 characters)

Longer description (if necessary) of what changed, and why. Also include any caveats
for the new code or known issues / incomplete sections.
```

This makes changes easy to parse from just reading the commit log.

## Pull requests
Once you think that your changes are ready to be merged, open a pull request back to
the `develop` branch on `grandivory/mods-optimizer`. This will notify me that the
changes are ready, and will start the review process. I try to be somewhat relaxed in
any changes I request, and will often make requested changes myself to make the whole
contribution process as quick and easy as possible.

## Linting and Testing
All code contributions to the mods optimizer should pass linting (`npm lint`). If
there are any changes or additions to functionality, then new tests should also be
written (this rule will only be enforced once I myself have added tests). All
existing tests should also pass. Eventually, I plan to make these checks part of the
commit hooks, so they will run automatically as soon as code is pushed or a pull
request is opened. For now, I may request changes to make these pass if they fail on
an opened pull request.
