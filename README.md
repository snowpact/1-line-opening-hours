# 1-line-opening-hours

Get rid of heavy responses from API when using simple opening hours, by using the OpenStreetMap `opening_hours` format.

This was first forked from [wbkd](https://github.com/wbkd/simple-opening-hours). The project then aimed to be bigger, so a lot of code has been rewrote and new features added.

It only supports the human readable parts and not [this complete crazy overengineered specification](https://wiki.openstreetmap.org/wiki/Key:opening_hours/specification).

## Supported opening_hours examples

* `Mo-Sa 06:00-22:00`
* `Mo-Fr 08:00-18:00; Sa 10:00-14:00`
* `Mo-Fr 08:00-18:00; Sa,Su 10:00-20:00`
* `Mo-Fr 08:00-12:00, We 14:00-18:00`
* `Mo-Fr 08:00-12:00, 14:00-18:00`
* `Mo-Fr 08:00+`
* `Mo-Fr 08:00-01:00`
* `Mo-Fr 08:00-18:00; We off`
* `24/7`


## Getting started

### Install
```
npm install 1-line-opening-hours --save
yarn add 1-line-opening-hours
```
### Usage
```javascript
const openingHours = new SimpleOpeningHours('Mo-Sa 06:00-22:00');

console.log('Is this open now?', openingHours.isOpenNow());
console.log('Is this open on 2016-10-01 18:00?', openingHours.isOpenOn(new Date('2016-10-01 18:00')));
console.table(openingHours.getTable());
```	