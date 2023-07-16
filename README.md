# Image processing API

Resize & compress image from URL.
You can use this API to create different sizes of images.

```
$ npm install
```

## Starting App

```
$ node index.js
```

After starting navigate to http://localhost:5000

## **Query Parameter**
#### Necessary Parameter
```
/api/?url={image-url(working)}
```

### Manipulation Parameter
```
/api/?q={quality <=100 (Default: 60)} 
/api/?width={width} 
/api/?height={height} 
/api/?crop={contain, cover, fill, outside, inside} 
/api/?bw={black and white} 
```

## Sample Working Complete URL
```
http://localhost:5000/api/?format=jpeg&q=2&bw&height=10000&width=5000&crop=cover&url=https://res.cloudinary.com/dshtxwfwj/image/upload/v1648306669/ProjectWOC_ppx8rn.jpg
```
