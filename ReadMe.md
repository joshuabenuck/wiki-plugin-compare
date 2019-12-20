# Federated Wiki - Compare Plugin

This plugin, type: compare, allows one to compare multiple specs.

## Configuration

Edit a `compare` item to configure it.

If you specify an `orientation` of `horizontal`, the display will look like:
![horizontal](screenshots/horizontal.png)

If specify an `orientation` of `vertical`, the display will look like:
![vertical](screenshots/vertical.png)

The default display layout is `horizontal` if no layout is specified.

Specify the columns to display by adding a property called `columns`. The value should be a comma separated list.

The first example on this page was configured as follows:
```
orientation: horizontal
columns: name, cpu, ram, gpu
```

The rows (for a horizontal layout) or the columns (for a vertical layout) are pulled from `specs` items up and to the left of the `compare` item.

To reorder the compared items, change the position of the corresponding `specs` item in the lineup.

To change the columns or order of columns displayed, edit the `compare` item to change its configuration.

## Filtering by Type

If a lineup contains `specs` of different types of entities (say `laptop`s and `monitor`s), `compare` will attempt to compare all of them.

To fix this, add a `TYPE` field to each `spec`, and then add a `type` property to the `compare` config to tell it to only display `spec`s of that type.

Given these three `specs`:
```
model: Acme XYZ 17
TYPE: laptop
```

```
model: Acme XYZ 15
TYPE: laptop
```

```
model: 4k
TYPE: monitor
```

This is how to configure the compare to only display the laptops:
```
orientation: vertical
type: laptop
columns: Model
```

## Build

    npm install

## License

MIT

## Usage
