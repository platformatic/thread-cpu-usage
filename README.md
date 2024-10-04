# thread-cpu-usage

The package exports a single function: `threadCpuUsage`.

The function method returns the user and system CPU time usage of the current thread, in an object with properties `user` and `system`, whose values are microsecond values (millionth of a second).

The result of a previous call to `threadCpuUsage` can be passed as the argument to the function, to get a diff reading.

The API is purposely designed to be identical to Node.js' [process.cpuUsage([previousValue])](https://nodejs.org/dist/latest/docs/api/process.html#processcpuusagepreviousvalue) API.

## Install

```sh
npm install thread-cpu-usage
```

## License

Apache 2.0
