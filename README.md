# time-series-analyzer-webapp
Time Series Analyzer has been created to analyze the data collected from sensors. Other than supporting plotting of data, it allows processing using various signal processing methods such as moving window average, linear transformation. It also supports various analysis techniques such as histogram plot, fourier transform plot, xy plot. It has been implemented in React, as a serverless tool.
<img src="https://signerd-images.s3-us-west-1.amazonaws.com/time-series-analyzer/timeseriesanalyzer_02.png" width="600px" height="800px" display="block">

To see how this web-app works use following link:
<a href="https://www.signerd.io" display="inline-block" padding="5px" color="#0074FA">signerd.io></a>

[![time series analyzer](http://img.youtube.com/vi/u_d9QtsDIIw/0.jpg)](http://www.youtube.com/watch?v=u_d9QtsDIIw "time series analyzer youtube")

time-series-analyzer-webapp comes with TimeSeriesAnalyzer and TimeSeriesAnalyzerTutorial components.
To see how these components are being used, check the demo project :
<a href="https://github.com/signerd-systems/time-series-analyzer-demo">Time Series Analyzer Demo</a>

# Building the webpack for publishing on npm:

download dependencies
```
npm install 
```

build ES5 Javascript code
```
npm run build
```

change the version in package.json

publish on https://www.npmjs.com/
```
publish npm
```