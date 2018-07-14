# alpha

To record daily reading.

## Optional

If you want to sync your data with mutiple devices, you need a back end.
You could make it by yourself, or you can look at [alpha-api](https://github.com/xandeer/alpha-api).

## Run and Build

```bash
# install dependencies
yarn

# run a local server
yarn run start

# build to dist folder
yarn run dev:build
```

For more info, you can look `package.json`'s scripts.

## Todo

- [ ] features
  - [x] CRUD
  - [x] Push and Pull
  - [ ] Search
  - [ ] Generate wallpaper
  - [ ] Backup data, import and export
  - [ ] Tags collection
  - [ ] Handle conflict
  - [ ] Context menu
  - [ ] Date map
    - [ ] Jump with date
    - [ ] Next day and last day
- [ ] styles
  - [x] From and Author as link if it is
  - [ ] Markdown elements
  - [ ] Href
- [ ] others
  - [ ] CI
  - [ ] Sync peer to peer, without server?
