# "Profiles" for VS Code

Working as a developer I often need to make changes to my VS Code settings like fonts, colors and enabling/disabling extensions for enterprise, but get in the way when codding my own projects.

VS Code can launch command line flags to load settings and extensions from a non-default location.

Each folder in this repo represents one of those "profiles".

I launch each profile using an alias that I create in my `.zshrc`.

For example, this repo lives in `~/code_profiles` and the command to launch my `egghead` settings is:

```sh
code --extensions-dir $HOME/code/code_profiles/jdej/exts --user-data-dir $HOME/code/code_profiles/jdej/data
```

The alias in my `.zshrc` looks like:

```sh
alias jdej="code --extensions-dir $HOME/code/code_profiles/projects/exts --user-data-dir $HOME/code/code_profiles/projects/data"
```

And I can run that with a path like:

```sh
teach $HOME/code/projects/vscode-profiles
```
